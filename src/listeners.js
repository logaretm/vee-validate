import ClassManager from './classes';
import {
  getScope, debounce, warn,
  getDataAttribute, isObject, toArray,
  find, getRules, assign, isCallable,
  getPath
} from './utils';
import config from './config';

export default class ListenerGenerator {
  constructor(el, binding, vnode, options) {
    this.unwatch = undefined;
    this.callbacks = [];
    this.el = el;
    this.scope = isObject(binding.value) ? binding.value.scope : getScope(el);
    this.binding = binding;
    this.vm = vnode.context;
    this.component = vnode.child;
    this.options = assign({}, config, options);
    this.fieldName = this._resolveFieldName();
    this.model = this._resolveModel(vnode.data.directives);
    this.classes = new ClassManager(el, this.vm.$validator, {
      component: this.component,
      enableAutoClasses: options.enableAutoClasses,
      classNames: options.classNames
    });
  }

  /**
   * Checks if the node directives contains a v-model or a specified arg.
   * Args take priority over models.
   *
   * @param {Array} directives
   * @return {Object}
   */
  _resolveModel(directives) {
    if (this.binding.arg) {
      return {
        watchable: true,
        expression: this.binding.arg,
        lazy: false
      };
    }

    if (isObject(this.binding.value) && this.binding.value.arg) {
      return {
        watchable: true,
        expression: this.binding.value.arg,
        lazy: false
      };
    }

    const result = {
      watchable: false,
      expression: null,
      lazy: false
    };
    const model = find(directives, d => d.name === 'model');
    if (!model) {
      return result;
    }

    result.expression = model.expression;
    result.watchable = /^[a-z_]+[0-9]*(\w*\.[a-z_]\w*)*$/i.test(model.expression) &&
                      this._isExistingPath(model.expression);
    result.lazy = !! model.modifiers.lazy;

    return result;
  }

  /**
   * @param {String} path
   */
  _isExistingPath(path) {
    let obj = this.vm;
    return path.split('.').every(prop => {
      if (! Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }

      obj = obj[prop];

      return true;
    });
  }

    /**
     * Resolves the field name to trigger validations.
     * @return {String} The field name.
     */
  _resolveFieldName() {
    if (this.component) {
      return getDataAttribute(this.el, 'name') || this.component.name;
    }

    return getDataAttribute(this.el, 'name') || this.el.name;
  }

    /**
     * Determines if the validation rule requires additional listeners on target fields.
     */
  _hasFieldDependency(rules) {
    let fieldName = false;
    if (! rules) {
      return false;
    }

    if (isObject(rules)) {
      Object.keys(rules).forEach(r => { // eslint-disable-line
        if (/confirmed|after|before/.test(r)) {
          fieldName = rules[r].split(',')[0];

          return false;
        }
      });

      return fieldName;
    }

    rules.split('|').every(r => {
      if (/\b(confirmed|after|before):/.test(r)) {
        fieldName = r.split(':')[1];
        return false;
      }

      if (/\b(confirmed)/.test(r)) {
        fieldName = `${this.fieldName}_confirmation`;
        return false;
      }

      return true;
    });

    return fieldName;
  }

    /**
     * Validates input value, triggered by 'input' event.
     */
  _inputListener() {
    return this._validate(this.el.value);
  }

    /**
     * Validates files, triggered by 'change' event.
     */
  _fileListener() {
    return this._validate(toArray(this.el.files)).then(isValid => {
      if (! isValid && this.binding.modifiers.reject) {
        this.el.value = '';
      }
    });
  }

    /**
     * Validates radio buttons, triggered by 'change' event.
     */
  _radioListener() {
    const checked = document.querySelector(`input[name="${this.el.name}"]:checked`);
    return this._validate(checked ? checked.value : null);
  }

    /**
     * Validates checkboxes, triggered by change event.
     */
  _checkboxListener() {
    const checkedBoxes = document.querySelectorAll(`input[name="${this.el.name}"]:checked`);
    if (! checkedBoxes || ! checkedBoxes.length) {
      this._validate(null);
      return;
    }

    toArray(checkedBoxes).forEach(box => {
      this._validate(box.value);
    });
  }

    /**
     * Trigger the validation for a specific value.
     */
  _validate(value) {
    if ((this.component && this.component.disabled) || this.el.disabled) {
      return Promise.resolve(true);
    }

    return this.vm.$validator.validate(
      this.fieldName, value, this.scope || getScope(this.el)
    );
  }

    /**
     * Returns a scoped callback, only runs if the el scope is the same as the recieved scope
     * From the event.
     */
  _getScopedListener(callback) {
    return (scope) => {
      if (! scope || scope === this.scope || scope instanceof window.Event) {
        callback();
      }
    };
  }

    /**
     * Attaches validator event-triggered validation.
     */
  _attachValidatorEvent() {
    const listener = this._getScopedListener(this._getSuitableListener().listener.bind(this));
    const fieldName = this._hasFieldDependency(
        getRules(this.binding.expression, this.binding.value, this.el)
      );
    if (fieldName) {
            // Wait for the validator ready triggered when vm is mounted because maybe
            // the element isn't mounted yet.
      this.vm.$nextTick(() => {
        const target = document.querySelector(`input[name='${fieldName}']`);
        if (! target) {
          warn('Cannot find target field, no additional listeners were attached.');
          return;
        }

        const events = getDataAttribute(this.el, 'validate-on') || this.options.events;
        events.split('|').forEach(e => {
          target.addEventListener(e, listener, false);
          this.callbacks.push({ name: e, listener, el: target });
        });
      });
    }
  }

  /**
   * Gets a listener that listens on bound models instead of elements.
   */
  _getModeledListener() {
    if (!this.model.watchable) {
      return null;
    }

    return () => {
      this._validate(getPath(this.model.expression, this.vm));
    };
  }

    /**
     * Determines a suitable listener for the element.
     */
  _getSuitableListener() {
    let listener;
    const overrides = {
      // Models can be unwatchable and have a lazy modifier,
      // so we make sure we listen on the proper event.
      input: this.model.lazy ? 'change' : 'input',
      blur: 'blur'
    };

    if (this.el.tagName === 'SELECT') {
      overrides.input = 'change';
      listener = {
        names: ['change', 'blur'],
        listener: this._getModeledListener() || this._inputListener
      };
    } else {
      // determine the suitable listener and events to handle
      switch (this.el.type) {
      case 'file':
        overrides.input = 'change';
        overrides.blur = null;
        listener = {
          names: ['change'],
          listener: this._fileListener
        };
        break;

      case 'radio':
        overrides.input = 'change';
        overrides.blur = null;
        listener = {
          names: ['change'],
          listener: this._getModeledListener() || this._radioListener
        };
        break;

      case 'checkbox':
        overrides.input = 'change';
        overrides.blur = null;
        listener = {
          names: ['change'],
          listener: this._getModeledListener() || this._checkboxListener
        };
        break;

      default:
        listener = {
          names: ['input', 'blur'],
          listener: this._getModeledListener() || this._inputListener
        };
        break;
      }
    }
    // users are able to specify which events they want to validate on
    const events = getDataAttribute(this.el, 'validate-on') || this.options.events;
    listener.names = events.split('|')
                           .filter(e => overrides[e] !== null)
                           .map(e => overrides[e] || e);

    return listener;
  }

  /**
   * Attaches neccessary validation events for the component.
   */
  _attachComponentListeners() {
    this.componentListener = debounce((value) => {
      this._validate(value);
    }, getDataAttribute(this.el, 'delay') || this.options.delay);

    const events = getDataAttribute(this.el, 'validate-on') || this.options.events;
    events.split('|').forEach(e => {
      if (!e) {
        return;
      }
      if (e === 'input') {
        this.component.$on('input', this.componentListener);
      } else if (e === 'blur') {
        this.component.$on('blur', this.componentListener);
      } else {
        this.component.$on(e, this.componentListener);
      }

      this.componentPropUnwatch = this.component.$watch('value', this.componentListener);
    });
  }

  /**
   * Attachs a suitable listener for the input.
   */
  _attachFieldListeners() {
    // If it is a component, use vue events instead.
    if (this.component) {
      this._attachComponentListeners();

      return;
    }

    const handler = this._getSuitableListener();
    const listener = debounce(
      handler.listener.bind(this),
      getDataAttribute(this.el, 'delay') || this.options.delay
    );

    if (~['radio', 'checkbox'].indexOf(this.el.type)) {
      this.vm.$nextTick(() => {
        const elms = document.querySelectorAll(`input[name="${this.el.name}"]`);
        toArray(elms).forEach(input => {
          handler.names.forEach(handlerName => {
            input.addEventListener(handlerName, listener, false);
            this.callbacks.push({ name: handlerName, listener, el: input });
          });
        });
      });

      return;
    }

    handler.names.forEach(handlerName => {
      this.el.addEventListener(handlerName, listener, false);
      this.callbacks.push({ name: handlerName, listener, el: this.el });
    });
  }

  /**
   * Returns a context, getter factory pairs for each input type.
   */
  _resolveValueGetter() {
    if (this.model.watchable) {
      return {
        context: () => this.vm,
        // eslint-disable-next-line
        getter: (context) => { 
          return getPath(this.model.expression, context);
        }
      };
    }

    if (this.component) {
      return {
        context: () => this.component,
        getter: (context) => {
          const path = getDataAttribute(this.el, 'value-path');
          if (path) {
            return getPath(path, this.component);
          }
          return context.value;
        }
      };
    }

    switch (this.el.type) {
    case 'checkbox': return {
      context: () => document.querySelectorAll(`input[name="${this.el.name}"]:checked`),
      getter(context) {
        if (! context || ! context.length) {
          return null;
        }

        return toArray(context).map(checkbox => checkbox.value);
      }
    };
    case 'radio': return {
      context: () => document.querySelector(`input[name="${this.el.name}"]:checked`),
      getter(context) {
        return context && context.value;
      }
    };
    case 'file': return {
      context: () => this.el,
      getter(context) {
        return toArray(context.files);
      }
    };

    default: return {
      context: () => this.el,
      getter(context) {
        return context.value;
      }
    };
    }
  }

  /**
   * Attaches model watchers and extra listeners.
   */
  _attachModelWatcher(arg) {
    const events = getDataAttribute(this.el, 'validate-on') || this.options.events;
    const listener = debounce(
      this._getSuitableListener().listener.bind(this),
      getDataAttribute(this.el, 'delay') || this.options.delay
    );
    events.split('|').forEach(name => {
      if (~['input', 'change'].indexOf(name)) {
        const debounced = debounce((value) => {
          this.vm.$validator.validate(
            this.fieldName, value, this.scope || getScope(this.el)
          );
        }, getDataAttribute(this.el, 'delay') || this.options.delay);
        this.unwatch = this.vm.$watch(arg, debounced, { deep: true });
        // No need to attach it on element as it will use the vue watcher.
        return;
      }

      this.el.addEventListener(name, listener, false);
      this.callbacks.push({ name, listener, el: this.el });
    });
  }

  /**
   * Attaches the Event Listeners.
   */
  attach() {
    const { context, getter } = this._resolveValueGetter();
    this.vm.$validator.attach(
      this.fieldName,
      getRules(this.binding.expression, this.binding.value, this.el), {
        // eslint-disable-next-line
        scope: () => {
          return this.scope || getScope(this.el);
        },
        prettyName: getDataAttribute(this.el, 'as') || this.el.title,
        context,
        getter,
        listeners: this,
        initial: this.binding.modifiers.initial
      }
    );

    if (this.binding.modifiers.disable) {
      return;
    }

    this._attachValidatorEvent();
    if (this.model.watchable) {
      this._attachModelWatcher(this.model.expression);
      return;
    }

    this._attachFieldListeners();
  }

    /**
     * Removes all attached event listeners.
     */
  detach() {
    if (this.component) {
      this.component.$off('input', this.componentListener);
      this.component.$off('blur', this.componentListener);

      if (isCallable(this.componentPropUnwatch)) {
        this.componentPropUnwatch();
      }
    }

    if (this.unwatch) {
      this.unwatch();
    }

    this.classes.detach();

    this.callbacks.forEach(h => {
      h.el.removeEventListener(h.name, h.listener);
    });
    this.callbacks = [];
  }
}
