/**
  * vee-validate v2.0.7
  * (c) 2018 Abdelrahman Awad
  * @license MIT
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.VeeValidate = factory());
}(this, (function () { 'use strict';

  var supportsPassive = true;
  var detectPassiveSupport = function () {
      try {
          var opts = Object.defineProperty({}, 'passive', {
              get: function get() {
                  supportsPassive = true;
              }
          });
          window.addEventListener('testPassive', null, opts);
          window.removeEventListener('testPassive', null, opts);
      } catch (e) {
          supportsPassive = false;
      }
      return supportsPassive;
  };
  var addEventListener = function (el, eventName, cb) {
      el.addEventListener(eventName, cb, supportsPassive ? {
          passive: true
      } : false);
  };
  var isTextInput = function (el) { return ['text','number','password','search','email','tel',
      'url','textarea'].indexOf(el.type) !== -1; };
  var getDataAttribute = function (el, name) { return el.getAttribute(("data-vv-" + name)); };
  var isNullOrUndefined = function (value) { return value === null || value === undefined; };
  var setDataAttribute = function (el, name, value) { return el.setAttribute(("data-vv-" + name), value); };
  var createFlags = function () { return ({
      untouched: true,
      touched: false,
      dirty: false,
      pristine: true,
      valid: null,
      invalid: null,
      validated: false,
      pending: false,
      required: false,
      changed: false
  }); };
  var isEqual = function (lhs, rhs) {
      if (lhs instanceof RegExp && rhs instanceof RegExp) {
          return isEqual(lhs.source, rhs.source) && isEqual(lhs.flags, rhs.flags);
      }
      if (Array.isArray(lhs) && Array.isArray(rhs)) {
          if (lhs.length !== rhs.length) 
              { return false; }
          for (var i = 0;i < lhs.length; i++) {
              if (!isEqual(lhs[i], rhs[i])) {
                  return false;
              }
          }
          return true;
      }
      if (isObject(lhs) && isObject(rhs)) {
          return Object.keys(lhs).every(function (key) { return isEqual(lhs[key], rhs[key]); }) && Object.keys(rhs).every(function (key) { return isEqual(lhs[key], rhs[key]); });
      }
      return lhs === rhs;
  };
  var getScope = function (el) {
      var scope = getDataAttribute(el, 'scope');
      if (isNullOrUndefined(scope) && el.form) {
          scope = getDataAttribute(el.form, 'scope');
      }
      return !isNullOrUndefined(scope) ? scope : null;
  };
  var getPath = function (path, target, def) {
      if ( def === void 0 ) def = undefined;

      if (!path || !target) 
          { return def; }
      var value = target;
      path.split('.').every(function (prop) {
          if (!Object.prototype.hasOwnProperty.call(value, prop) && value[prop] === undefined) {
              value = def;
              return false;
          }
          value = value[prop];
          return true;
      });
      return value;
  };
  var hasPath = function (path, target) {
      var obj = target;
      return path.split('.').every(function (prop) {
          if (!Object.prototype.hasOwnProperty.call(obj, prop)) {
              return false;
          }
          obj = obj[prop];
          return true;
      });
  };
  var parseRule = function (rule) {
      var params = [];
      var name = rule.split(':')[0];
      if (~rule.indexOf(':')) {
          params = rule.split(':').slice(1).join(':').split(',');
      }
      return {
          name: name,
          params: params
      };
  };
  var debounce = function (fn, wait, immediate) {
      if ( wait === void 0 ) wait = 0;
      if ( immediate === void 0 ) immediate = false;

      if (wait === 0) {
          return fn;
      }
      var timeout;
      return function () {
          var args = [], len = arguments.length;
          while ( len-- ) args[ len ] = arguments[ len ];

          var later = function () {
              timeout = null;
              if (!immediate) 
                  { fn.apply(void 0, args); }
          };
          var callNow = immediate && !timeout;
          clearTimeout(timeout);
          timeout = setTimeout(later, wait);
          if (callNow) 
              { fn.apply(void 0, args); }
      };
  };
  var normalizeRules = function (rules) {
      if (!rules) {
          return {};
      }
      if (isObject(rules)) {
          return Object.keys(rules).reduce(function (prev, curr) {
              var params = [];
              if (rules[curr] === true) {
                  params = [];
              } else if (Array.isArray(rules[curr])) {
                  params = rules[curr];
              } else {
                  params = [rules[curr]];
              }
              if (rules[curr] !== false) {
                  prev[curr] = params;
              }
              return prev;
          }, {});
      }
      if (typeof rules !== 'string') {
          warn('rules must be either a string or an object.');
          return {};
      }
      return rules.split('|').reduce(function (prev, rule) {
          var parsedRule = parseRule(rule);
          if (!parsedRule.name) {
              return prev;
          }
          prev[parsedRule.name] = parsedRule.params;
          return prev;
      }, {});
  };
  var warn = function (message) {
      console.warn(("[vee-validate] " + message));
  };
  var createError = function (message) { return new Error(("[vee-validate] " + message)); };
  var isObject = function (obj) { return obj !== null && obj && typeof obj === 'object' && !Array.isArray(obj); };
  var isCallable = function (func) { return typeof func === 'function'; };
  var hasClass = function (el, className) {
      if (el.classList) {
          return el.classList.contains(className);
      }
      return !(!el.className.match(new RegExp(("(\\s|^)" + className + "(\\s|$)"))));
  };
  var addClass = function (el, className) {
      if (el.classList) {
          el.classList.add(className);
          return;
      }
      if (!hasClass(el, className)) {
          el.className += " " + className;
      }
  };
  var removeClass = function (el, className) {
      if (el.classList) {
          el.classList.remove(className);
          return;
      }
      if (hasClass(el, className)) {
          var reg = new RegExp(("(\\s|^)" + className + "(\\s|$)"));
          el.className = el.className.replace(reg, ' ');
      }
  };
  var toggleClass = function (el, className, status) {
      if (!el || !className) 
          { return; }
      if (Array.isArray(className)) {
          className.forEach(function (item) { return toggleClass(el, item, status); });
          return;
      }
      if (status) {
          return addClass(el, className);
      }
      removeClass(el, className);
  };
  var toArray = function (arrayLike) {
      if (isCallable(Array.from)) {
          return Array.from(arrayLike);
      }
      var array = [];
      var length = arrayLike.length;
      for (var i = 0;i < length; i++) {
          array.push(arrayLike[i]);
      }
      return array;
  };
  var assign = function (target) {
      var others = [], len = arguments.length - 1;
      while ( len-- > 0 ) others[ len ] = arguments[ len + 1 ];

      if (isCallable(Object.assign)) {
          return Object.assign.apply(Object, [ target ].concat( others ));
      }
      if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
      }
      var to = Object(target);
      others.forEach(function (arg) {
          if (arg != null) {
              Object.keys(arg).forEach(function (key) {
                  to[key] = arg[key];
              });
          }
      });
      return to;
  };
  var id = 0;
  var idTemplate = '{id}';
  var uniqId = function () {
      if (id >= 9999) {
          id = 0;
          idTemplate = idTemplate.replace('{id}', '_{id}');
      }
      id++;
      var newId = idTemplate.replace('{id}', String(id));
      return newId;
  };
  var find = function (arrayLike, predicate) {
      var array = Array.isArray(arrayLike) ? arrayLike : toArray(arrayLike);
      for (var i = 0;i < array.length; i++) {
          if (predicate(array[i])) {
              return array[i];
          }
      }
      return undefined;
  };
  var isBuiltInComponent = function (vnode) {
      if (!vnode) {
          return false;
      }
      var tag = vnode.componentOptions.tag;
      return /keep-alive|transition|transition-group/.test(tag);
  };
  var makeEventsArray = function (events) { return typeof events === 'string' && events.length ? events.split('|') : []; };
  var makeDelayObject = function (events, delay, delayConfig) {
      if (typeof delay === 'number') {
          return events.reduce(function (prev, e) {
              prev[e] = delay;
              return prev;
          }, {});
      }
      return events.reduce(function (prev, e) {
          if (typeof delay === 'object' && e in delay) {
              prev[e] = delay[e];
              return prev;
          }
          if (typeof delayConfig === 'number') {
              prev[e] = delayConfig;
              return prev;
          }
          prev[e] = delayConfig && delayConfig[e] || 0;
          return prev;
      }, {});
  };
  var deepParseInt = function (input) {
      if (typeof input === 'number') 
          { return input; }
      if (typeof input === 'string') 
          { return parseInt(input); }
      var map = {};
      for (var element in input) {
          map[element] = parseInt(input[element]);
      }
      return map;
  };
  var merge = function (target, source) {
      if (!(isObject(target) && isObject(source))) {
          return target;
      }
      Object.keys(source).forEach(function (key) {
          var obj, obj$1;

          if (isObject(source[key])) {
              if (!target[key]) {
                  assign(target, ( obj = {}, obj[key] = {}, obj ));
              }
              merge(target[key], source[key]);
              return;
          }
          assign(target, ( obj$1 = {}, obj$1[key] = source[key], obj$1 ));
      });
      return target;
  };

  var ErrorBag = function ErrorBag() {
      this.items = [];
  };
  ErrorBag.prototype[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] = function () {
          var this$1 = this;

      var index = 0;
      return {
          next: function () { return ({
              value: this$1.items[index++],
              done: index > this$1.items.length
          }); }
      };
  };
  ErrorBag.prototype.add = function add (error) {
          var ref;

      if (arguments.length > 1) {
          error = {
              field: arguments[0],
              msg: arguments[1],
              rule: arguments[2],
              scope: !isNullOrUndefined(arguments[3]) ? arguments[3] : null,
              regenerate: null
          };
      }
      (ref = this.items).push.apply(ref, this._normalizeError(error));
  };
  ErrorBag.prototype._normalizeError = function _normalizeError (error) {
      if (Array.isArray(error)) {
          return error.map(function (e) {
              e.scope = !isNullOrUndefined(e.scope) ? e.scope : null;
              return e;
          });
      }
      error.scope = !isNullOrUndefined(error.scope) ? error.scope : null;
      return [error];
  };
  ErrorBag.prototype.regenerate = function regenerate () {
      this.items.forEach(function (i) {
          i.msg = isCallable(i.regenerate) ? i.regenerate() : i.msg;
      });
  };
  ErrorBag.prototype.update = function update (id, error) {
      var item = find(this.items, function (i) { return i.id === id; });
      if (!item) {
          return;
      }
      var idx = this.items.indexOf(item);
      this.items.splice(idx, 1);
      item.scope = error.scope;
      this.items.push(item);
  };
  ErrorBag.prototype.all = function all (scope) {
      if (isNullOrUndefined(scope)) {
          return this.items.map(function (e) { return e.msg; });
      }
      return this.items.filter(function (e) { return e.scope === scope; }).map(function (e) { return e.msg; });
  };
  ErrorBag.prototype.any = function any (scope) {
      if (isNullOrUndefined(scope)) {
          return !(!this.items.length);
      }
      return !(!this.items.filter(function (e) { return e.scope === scope; }).length);
  };
  ErrorBag.prototype.clear = function clear (scope) {
          var this$1 = this;

      if (isNullOrUndefined(scope)) {
          scope = null;
      }
      for (var i = 0;i < this.items.length; ++i) {
          if (this$1.items[i].scope === scope) {
              this$1.items.splice(i, 1);
              --i;
          }
      }
  };
  ErrorBag.prototype.collect = function collect (field, scope, map) {
          if ( map === void 0 ) map = true;

      if (!field) {
          var collection = {};
          this.items.forEach(function (e) {
              if (!collection[e.field]) {
                  collection[e.field] = [];
              }
              collection[e.field].push(map ? e.msg : e);
          });
          return collection;
      }
      field = !isNullOrUndefined(field) ? String(field) : field;
      if (isNullOrUndefined(scope)) {
          return this.items.filter(function (e) { return e.field === field; }).map(function (e) { return map ? e.msg : e; });
      }
      return this.items.filter(function (e) { return e.field === field && e.scope === scope; }).map(function (e) { return map ? e.msg : e; });
  };
  ErrorBag.prototype.count = function count () {
      return this.items.length;
  };
  ErrorBag.prototype.firstById = function firstById (id) {
      var error = find(this.items, function (i) { return i.id === id; });
      return error ? error.msg : null;
  };
  ErrorBag.prototype.first = function first (field, scope) {
          var this$1 = this;
          if ( scope === void 0 ) scope = null;

      if (isNullOrUndefined(field)) {
          return null;
      }
      field = String(field);
      var selector = this._selector(field);
      var scoped = this._scope(field);
      if (scoped) {
          var result = this.first(scoped.name, scoped.scope);
          if (result) {
              return result;
          }
      }
      if (selector) {
          return this.firstByRule(selector.name, selector.rule, scope);
      }
      for (var i = 0;i < this.items.length; ++i) {
          if (this$1.items[i].field === field && this$1.items[i].scope === scope) {
              return this$1.items[i].msg;
          }
      }
      return null;
  };
  ErrorBag.prototype.firstRule = function firstRule (field, scope) {
      var errors = this.collect(field, scope, false);
      return errors.length && errors[0].rule || null;
  };
  ErrorBag.prototype.has = function has (field, scope) {
          if ( scope === void 0 ) scope = null;

      return !(!this.first(field, scope));
  };
  ErrorBag.prototype.firstByRule = function firstByRule (name, rule, scope) {
          if ( scope === void 0 ) scope = null;

      var error = this.collect(name, scope, false).filter(function (e) { return e.rule === rule; })[0];
      return error && error.msg || null;
  };
  ErrorBag.prototype.firstNot = function firstNot (name, rule, scope) {
          if ( rule === void 0 ) rule = 'required';
          if ( scope === void 0 ) scope = null;

      var error = this.collect(name, scope, false).filter(function (e) { return e.rule !== rule; })[0];
      return error && error.msg || null;
  };
  ErrorBag.prototype.removeById = function removeById (id) {
          var this$1 = this;

      if (Array.isArray(id)) {
          this.items = this.items.filter(function (i) { return id.indexOf(i.id) === -1; });
          return;
      }
      for (var i = 0;i < this.items.length; ++i) {
          if (this$1.items[i].id === id) {
              this$1.items.splice(i, 1);
              --i;
          }
      }
  };
  ErrorBag.prototype.remove = function remove (field, scope) {
          var this$1 = this;

      field = !isNullOrUndefined(field) ? String(field) : field;
      var removeCondition = function (e) {
          if (!isNullOrUndefined(scope)) {
              return e.field === field && e.scope === scope;
          }
          return e.field === field && e.scope === null;
      };
      for (var i = 0;i < this.items.length; ++i) {
          if (removeCondition(this$1.items[i])) {
              this$1.items.splice(i, 1);
              --i;
          }
      }
  };
  ErrorBag.prototype._selector = function _selector (field) {
      if (field.indexOf(':') > -1) {
          var ref = field.split(':');
              var name = ref[0];
              var rule = ref[1];
          return {
              name: name,
              rule: rule
          };
      }
      return null;
  };
  ErrorBag.prototype._scope = function _scope (field) {
      if (field.indexOf('.') > -1) {
          var ref = field.split('.');
              var scope = ref[0];
              var name = ref.slice(1);
          return {
              name: name.join('.'),
              scope: scope
          };
      }
      return null;
  };

  var LOCALE = 'en';
  var Dictionary = function Dictionary(dictionary) {
      if ( dictionary === void 0 ) dictionary = {};

      this.container = {};
      this.merge(dictionary);
  };

  var prototypeAccessors = { locale: { configurable: true } };
  prototypeAccessors.locale.get = function () {
      return LOCALE;
  };
  prototypeAccessors.locale.set = function (value) {
      LOCALE = value || 'en';
  };
  Dictionary.prototype.hasLocale = function hasLocale (locale) {
      return !(!this.container[locale]);
  };
  Dictionary.prototype.setDateFormat = function setDateFormat (locale, format) {
      if (!this.container[locale]) {
          this.container[locale] = {};
      }
      this.container[locale].dateFormat = format;
  };
  Dictionary.prototype.getDateFormat = function getDateFormat (locale) {
      if (!this.container[locale] || !this.container[locale].dateFormat) {
          return null;
      }
      return this.container[locale].dateFormat;
  };
  Dictionary.prototype.getMessage = function getMessage (locale, key, data) {
      var message = null;
      if (!this.hasMessage(locale, key)) {
          message = this._getDefaultMessage(locale);
      } else {
          message = this.container[locale].messages[key];
      }
      return isCallable(message) ? message.apply(void 0, data) : message;
  };
  Dictionary.prototype.getFieldMessage = function getFieldMessage (locale, field, key, data) {
      if (!this.hasLocale(locale)) {
          return this.getMessage(locale, key, data);
      }
      var dict = this.container[locale].custom && this.container[locale].custom[field];
      if (!dict || !dict[key]) {
          return this.getMessage(locale, key, data);
      }
      var message = dict[key];
      return isCallable(message) ? message.apply(void 0, data) : message;
  };
  Dictionary.prototype._getDefaultMessage = function _getDefaultMessage (locale) {
      if (this.hasMessage(locale, '_default')) {
          return this.container[locale].messages._default;
      }
      return this.container.en.messages._default;
  };
  Dictionary.prototype.getAttribute = function getAttribute (locale, key, fallback) {
          if ( fallback === void 0 ) fallback = '';

      if (!this.hasAttribute(locale, key)) {
          return fallback;
      }
      return this.container[locale].attributes[key];
  };
  Dictionary.prototype.hasMessage = function hasMessage (locale, key) {
      return !(!(this.hasLocale(locale) && this.container[locale].messages && this.container[locale].messages[key]));
  };
  Dictionary.prototype.hasAttribute = function hasAttribute (locale, key) {
      return !(!(this.hasLocale(locale) && this.container[locale].attributes && this.container[locale].attributes[key]));
  };
  Dictionary.prototype.merge = function merge$1 (dictionary) {
      merge(this.container, dictionary);
  };
  Dictionary.prototype.setMessage = function setMessage (locale, key, message) {
      if (!this.hasLocale(locale)) {
          this.container[locale] = {
              messages: {},
              attributes: {}
          };
      }
      this.container[locale].messages[key] = message;
  };
  Dictionary.prototype.setAttribute = function setAttribute (locale, key, attribute) {
      if (!this.hasLocale(locale)) {
          this.container[locale] = {
              messages: {},
              attributes: {}
          };
      }
      this.container[locale].attributes[key] = attribute;
  };

  Object.defineProperties( Dictionary.prototype, prototypeAccessors );

  var normalizeValue = function (value) {
      if (isObject(value)) {
          return Object.keys(value).reduce(function (prev, key) {
              prev[key] = normalizeValue(value[key]);
              return prev;
          }, {});
      }
      if (isCallable(value)) {
          return value('{0}', ['{1}','{2}','{3}']);
      }
      return value;
  };
  var normalizeFormat = function (locale) {
      var messages = normalizeValue(locale.messages);
      var custom = normalizeValue(locale.custom);
      return {
          messages: messages,
          custom: custom,
          attributes: locale.attributes,
          dateFormat: locale.dateFormat
      };
  };
  var I18nDictionary = function I18nDictionary(i18n, rootKey) {
      this.i18n = i18n;
      this.rootKey = rootKey;
  };

  var prototypeAccessors$1 = { locale: { configurable: true } };
  prototypeAccessors$1.locale.get = function () {
      return this.i18n.locale;
  };
  prototypeAccessors$1.locale.set = function (value) {
      warn('Cannot set locale from the validator when using vue-i18n, use i18n.locale setter instead');
  };
  I18nDictionary.prototype.getDateFormat = function getDateFormat (locale) {
      return this.i18n.getDateTimeFormat(locale || this.locale);
  };
  I18nDictionary.prototype.setDateFormat = function setDateFormat (locale, value) {
      this.i18n.setDateTimeFormat(locale || this.locale, value);
  };
  I18nDictionary.prototype.getMessage = function getMessage (locale, key, data) {
      var path = (this.rootKey) + ".messages." + key;
      if (!this.i18n.te(path)) {
          return this.i18n.t(((this.rootKey) + ".messages._default"), locale, data);
      }
      return this.i18n.t(path, locale, data);
  };
  I18nDictionary.prototype.getAttribute = function getAttribute (locale, key, fallback) {
          if ( fallback === void 0 ) fallback = '';

      var path = (this.rootKey) + ".attributes." + key;
      if (!this.i18n.te(path)) {
          return fallback;
      }
      return this.i18n.t(path, locale);
  };
  I18nDictionary.prototype.getFieldMessage = function getFieldMessage (locale, field, key, data) {
      var path = (this.rootKey) + ".custom." + field + "." + key;
      if (this.i18n.te(path)) {
          return this.i18n.t(path);
      }
      return this.getMessage(locale, key, data);
  };
  I18nDictionary.prototype.merge = function merge$1 (dictionary) {
          var this$1 = this;

      Object.keys(dictionary).forEach(function (localeKey) {
              var obj;

          var clone = merge({}, getPath((localeKey + "." + (this$1.rootKey)), this$1.i18n.messages, {}));
          var locale = merge(clone, normalizeFormat(dictionary[localeKey]));
          this$1.i18n.mergeLocaleMessage(localeKey, ( obj = {}, obj[this$1.rootKey] = locale, obj ));
          if (locale.dateFormat) {
              this$1.i18n.setDateTimeFormat(localeKey, locale.dateFormat);
          }
      });
  };
  I18nDictionary.prototype.setMessage = function setMessage (locale, key, value) {
          var obj, obj$1;

      this.merge(( obj$1 = {}, obj$1[locale] = {
              messages: ( obj = {}, obj[key] = value, obj )
          }, obj$1 ));
  };
  I18nDictionary.prototype.setAttribute = function setAttribute (locale, key, value) {
          var obj, obj$1;

      this.merge(( obj$1 = {}, obj$1[locale] = {
              attributes: ( obj = {}, obj[key] = value, obj )
          }, obj$1 ));
  };

  Object.defineProperties( I18nDictionary.prototype, prototypeAccessors$1 );

  var defaultConfig = {
      locale: 'en',
      delay: 0,
      errorBagName: 'errors',
      dictionary: null,
      strict: true,
      fieldsBagName: 'fields',
      classes: false,
      classNames: null,
      events: 'input|blur',
      inject: true,
      fastExit: true,
      aria: true,
      validity: false,
      i18n: null,
      i18nRootKey: 'validation'
  };
  var currentConfig = assign({}, defaultConfig);
  var dependencies = {
      dictionary: new Dictionary({
          en: {
              messages: {},
              attributes: {},
              custom: {}
          }
      })
  };
  var Config = function Config () {};

  var staticAccessors = { default: { configurable: true },current: { configurable: true } };

  staticAccessors.default.get = function () {
      return defaultConfig;
  };
  staticAccessors.current.get = function () {
      return currentConfig;
  };
  Config.dependency = function dependency (key) {
      return dependencies[key];
  };
  Config.merge = function merge$$1 (config) {
      currentConfig = assign({}, currentConfig, config);
      if (currentConfig.i18n) {
          Config.register('dictionary', new I18nDictionary(currentConfig.i18n, currentConfig.i18nRootKey));
      }
  };
  Config.register = function register (key, value) {
      dependencies[key] = value;
  };
  Config.resolve = function resolve (context) {
      var selfConfig = getPath('$options.$_veeValidate', context, {});
      return assign({}, Config.current, selfConfig);
  };

  Object.defineProperties( Config, staticAccessors );

  var Generator = function Generator () {};

  Generator.generate = function generate (el, binding, vnode) {
      var model = Generator.resolveModel(binding, vnode);
      var options = Config.resolve(vnode.context);
      return {
          name: Generator.resolveName(el, vnode),
          el: el,
          listen: !binding.modifiers.disable,
          scope: Generator.resolveScope(el, binding, vnode),
          vm: Generator.makeVM(vnode.context),
          expression: binding.value,
          component: vnode.child,
          classes: options.classes,
          classNames: options.classNames,
          getter: Generator.resolveGetter(el, vnode, model),
          events: Generator.resolveEvents(el, vnode) || options.events,
          model: model,
          delay: Generator.resolveDelay(el, vnode, options),
          rules: Generator.resolveRules(el, binding),
          initial: !(!binding.modifiers.initial),
          validity: options.validity,
          aria: options.aria,
          initialValue: Generator.resolveInitialValue(vnode)
      };
  };
  Generator.getCtorConfig = function getCtorConfig (vnode) {
      if (!vnode.child) 
          { return null; }
      var config = getPath('child.$options.$_veeValidate', vnode);
      return config;
  };
  Generator.resolveRules = function resolveRules (el, binding) {
      if (!binding.value && (!binding || !binding.expression)) {
          return getDataAttribute(el, 'rules');
      }
      if (binding.value && ~['string','object'].indexOf(typeof binding.value.rules)) {
          return binding.value.rules;
      }
      return binding.value;
  };
  Generator.resolveInitialValue = function resolveInitialValue (vnode) {
      var model = vnode.data.model || find(vnode.data.directives, function (d) { return d.name === 'model'; });
      return model && model.value;
  };
  Generator.makeVM = function makeVM (vm) {
      return {
          get $el() {
              return vm.$el;
          },
          get $refs() {
              return vm.$refs;
          },
          $watch: vm.$watch ? vm.$watch.bind(vm) : function () {},
          $validator: vm.$validator ? {
              errors: vm.$validator.errors,
              validate: vm.$validator.validate.bind(vm.$validator),
              update: vm.$validator.update.bind(vm.$validator)
          } : null
      };
  };
  Generator.resolveDelay = function resolveDelay (el, vnode, options) {
      var delay = getDataAttribute(el, 'delay');
      var globalDelay = options && 'delay' in options ? options.delay : 0;
      if (!delay && vnode.child && vnode.child.$attrs) {
          delay = vnode.child.$attrs['data-vv-delay'];
      }
      if (!isObject(globalDelay)) {
          return deepParseInt(delay || globalDelay);
      }
      globalDelay.input = delay || 0;
      return deepParseInt(globalDelay);
  };
  Generator.resolveEvents = function resolveEvents (el, vnode) {
      var events = getDataAttribute(el, 'validate-on');
      if (!events && vnode.child && vnode.child.$attrs) {
          events = vnode.child.$attrs['data-vv-validate-on'];
      }
      if (!events && vnode.child) {
          var config = Generator.getCtorConfig(vnode);
          events = config && config.events;
      }
      return events;
  };
  Generator.resolveScope = function resolveScope (el, binding, vnode) {
          if ( vnode === void 0 ) vnode = {};

      var scope = null;
      if (vnode.child && isNullOrUndefined(scope)) {
          scope = vnode.child.$attrs && vnode.child.$attrs['data-vv-scope'];
      }
      return !isNullOrUndefined(scope) ? scope : getScope(el);
  };
  Generator.resolveModel = function resolveModel (binding, vnode) {
      if (binding.arg) {
          return {
              expression: binding.arg
          };
      }
      var model = vnode.data.model || find(vnode.data.directives, function (d) { return d.name === 'model'; });
      if (!model) {
          return null;
      }
      var watchable = !/[^\w.$]/.test(model.expression) && hasPath(model.expression, vnode.context);
      var lazy = !(!(model.modifiers && model.modifiers.lazy));
      if (!watchable) {
          return {
              expression: null,
              lazy: lazy
          };
      }
      return {
          expression: model.expression,
          lazy: lazy
      };
  };
  Generator.resolveName = function resolveName (el, vnode) {
      var name = getDataAttribute(el, 'name');
      if (!name && !vnode.child) {
          return el.name;
      }
      if (!name && vnode.child && vnode.child.$attrs) {
          name = vnode.child.$attrs['data-vv-name'] || vnode.child.$attrs['name'];
      }
      if (!name && vnode.child) {
          var config = Generator.getCtorConfig(vnode);
          if (config && isCallable(config.name)) {
              var boundGetter = config.name.bind(vnode.child);
              return boundGetter();
          }
          return vnode.child.name;
      }
      return name;
  };
  Generator.resolveGetter = function resolveGetter (el, vnode, model) {
      if (model && model.expression) {
          return function () { return getPath(model.expression, vnode.context); };
      }
      if (vnode.child) {
          var path = getDataAttribute(el, 'value-path') || vnode.child.$attrs && vnode.child.$attrs['data-vv-value-path'];
          if (path) {
              return function () { return getPath(path, vnode.child); };
          }
          var config = Generator.getCtorConfig(vnode);
          if (config && isCallable(config.value)) {
              var boundGetter = config.value.bind(vnode.child);
              return function () { return boundGetter(); };
          }
          return function () { return vnode.child.value; };
      }
      switch (el.type) {
          case 'checkbox':
              return function () {
                  var els = document.querySelectorAll(("input[name=\"" + (el.name) + "\"]"));
                  els = toArray(els).filter(function (el) { return el.checked; });
                  if (!els.length) 
                      { return undefined; }
                  return els.map(function (checkbox) { return checkbox.value; });
              };
          case 'radio':
              return function () {
                  var els = document.querySelectorAll(("input[name=\"" + (el.name) + "\"]"));
                  var elm = find(els, function (el) { return el.checked; });
                  return elm && elm.value;
              };
          case 'file':
              return function (context) { return toArray(el.files); };
          case 'select-multiple':
              return function () { return toArray(el.options).filter(function (opt) { return opt.selected; }).map(function (opt) { return opt.value; }); };
          default:
              return function () { return el && el.value; };
      }
  };

  var DEFAULT_OPTIONS = {
      targetOf: null,
      initial: false,
      scope: null,
      listen: true,
      name: null,
      rules: {},
      vm: null,
      classes: false,
      validity: true,
      aria: true,
      events: 'input|blur',
      delay: 0,
      classNames: {
          touched: 'touched',
          untouched: 'untouched',
          valid: 'valid',
          invalid: 'invalid',
          pristine: 'pristine',
          dirty: 'dirty'
      }
  };
  var Field = function Field(options) {
      if ( options === void 0 ) options = {};

      this.id = uniqId();
      this.el = options.el;
      this.updated = false;
      this.dependencies = [];
      this.watchers = [];
      this.events = [];
      this.delay = 0;
      this.rules = {};
      this._cacheId(options);
      this.classNames = assign({}, DEFAULT_OPTIONS.classNames);
      options = assign({}, DEFAULT_OPTIONS, options);
      this._delay = !isNullOrUndefined(options.delay) ? options.delay : 0;
      this.validity = options.validity;
      this.aria = options.aria;
      this.flags = createFlags();
      this.vm = options.vm;
      this.component = options.component;
      this.ctorConfig = this.component ? getPath('$options.$_veeValidate', this.component) : undefined;
      this.update(options);
      this.initialValue = this.value;
      this.updated = false;
  };

  var prototypeAccessors$2 = { validator: { configurable: true },isRequired: { configurable: true },isDisabled: { configurable: true },alias: { configurable: true },value: { configurable: true },rejectsFalse: { configurable: true } };
  prototypeAccessors$2.validator.get = function () {
      if (!this.vm || !this.vm.$validator) {
          warn('No validator instance detected.');
          return {
              validate: function () {}
          };
      }
      return this.vm.$validator;
  };
  prototypeAccessors$2.isRequired.get = function () {
      return !(!this.rules.required);
  };
  prototypeAccessors$2.isDisabled.get = function () {
      return !(!(this.component && this.component.disabled)) || !(!(this.el && this.el.disabled));
  };
  prototypeAccessors$2.alias.get = function () {
      if (this._alias) {
          return this._alias;
      }
      var alias = null;
      if (this.el) {
          alias = getDataAttribute(this.el, 'as');
      }
      if (!alias && this.component) {
          return this.component.$attrs && this.component.$attrs['data-vv-as'];
      }
      return alias;
  };
  prototypeAccessors$2.value.get = function () {
      if (!isCallable(this.getter)) {
          return undefined;
      }
      return this.getter();
  };
  prototypeAccessors$2.rejectsFalse.get = function () {
      if (this.component && this.ctorConfig) {
          return !(!this.ctorConfig.rejectsFalse);
      }
      if (!this.el) {
          return false;
      }
      return this.el.type === 'checkbox';
  };
  Field.prototype.matches = function matches (options) {
      if (!options) {
          return true;
      }
      if (options.id) {
          return this.id === options.id;
      }
      if (options.name === undefined && options.scope === undefined) {
          return true;
      }
      if (options.scope === undefined) {
          return this.name === options.name;
      }
      if (options.name === undefined) {
          return this.scope === options.scope;
      }
      return options.name === this.name && options.scope === this.scope;
  };
  Field.prototype._cacheId = function _cacheId (options) {
      if (this.el && !options.targetOf) {
          setDataAttribute(this.el, 'id', this.id);
      }
  };
  Field.prototype.update = function update (options) {
      this.targetOf = options.targetOf || null;
      this.initial = options.initial || this.initial || false;
      if (!isNullOrUndefined(options.scope) && options.scope !== this.scope && isCallable(this.validator.update)) {
          this.validator.update(this.id, {
              scope: options.scope
          });
      }
      this.scope = !isNullOrUndefined(options.scope) ? options.scope : !isNullOrUndefined(this.scope) ? this.scope : null;
      this.name = (!isNullOrUndefined(options.name) ? String(options.name) : options.name) || this.name || null;
      this.rules = options.rules !== undefined ? normalizeRules(options.rules) : this.rules;
      this.model = options.model || this.model;
      this.listen = options.listen !== undefined ? options.listen : this.listen;
      this.classes = (options.classes || this.classes || false) && !this.component;
      this.classNames = isObject(options.classNames) ? merge(this.classNames, options.classNames) : this.classNames;
      this.getter = isCallable(options.getter) ? options.getter : this.getter;
      this._alias = options.alias || this._alias;
      this.events = options.events ? makeEventsArray(options.events) : this.events;
      this.delay = options.delay ? makeDelayObject(this.events, options.delay, this._delay) : makeDelayObject(this.events, this.delay, this._delay);
      this.updateDependencies();
      this.addActionListeners();
      if (!this.name) {
          warn('A field is missing a "name" or "data-vv-name" attribute');
      }
      if (options.rules !== undefined) {
          this.flags.required = this.isRequired;
      }
      if (this.flags.validated && options.rules !== undefined && this.updated) {
          this.validator.validate(("#" + (this.id)));
      }
      this.updated = true;
      this.addValueListeners();
      if (!this.el) {
          return;
      }
      this.updateClasses();
      this.updateAriaAttrs();
  };
  Field.prototype.reset = function reset () {
          var this$1 = this;

      var defaults = createFlags();
      Object.keys(this.flags).filter(function (flag) { return flag !== 'required'; }).forEach(function (flag) {
          this$1.flags[flag] = defaults[flag];
      });
      this.addActionListeners();
      this.updateClasses();
      this.updateAriaAttrs();
      this.updateCustomValidity();
  };
  Field.prototype.setFlags = function setFlags (flags) {
          var this$1 = this;

      var negated = {
          pristine: 'dirty',
          dirty: 'pristine',
          valid: 'invalid',
          invalid: 'valid',
          touched: 'untouched',
          untouched: 'touched'
      };
      Object.keys(flags).forEach(function (flag) {
          this$1.flags[flag] = flags[flag];
          if (negated[flag] && flags[negated[flag]] === undefined) {
              this$1.flags[negated[flag]] = !flags[flag];
          }
      });
      if (flags.untouched !== undefined || flags.touched !== undefined || flags.dirty !== undefined || flags.pristine !== undefined) {
          this.addActionListeners();
      }
      this.updateClasses();
      this.updateAriaAttrs();
      this.updateCustomValidity();
  };
  Field.prototype.updateDependencies = function updateDependencies () {
          var this$1 = this;

      this.dependencies.forEach(function (d) { return d.field.destroy(); });
      this.dependencies = [];
      var fields = Object.keys(this.rules).reduce(function (prev, r) {
          if (Validator.isTargetRule(r)) {
              var selector = this$1.rules[r][0];
              if (r === 'confirmed' && !selector) {
                  selector = (this$1.name) + "_confirmation";
              }
              prev.push({
                  selector: selector,
                  name: r
              });
          }
          return prev;
      }, []);
      if (!fields.length || !this.vm || !this.vm.$el) 
          { return; }
      fields.forEach(function (ref) {
              var selector = ref.selector;
              var name = ref.name;

          var el = null;
          if (selector[0] === '$') {
              var ref$1 = this$1.vm.$refs[selector.slice(1)];
              el = Array.isArray(ref$1) ? ref$1[0] : ref$1;
          } else {
              try {
                  el = this$1.vm.$el.querySelector(selector);
              } catch (err) {
                  el = null;
              }
          }
          if (!el) {
              try {
                  el = this$1.vm.$el.querySelector(("input[name=\"" + selector + "\"]"));
              } catch (err) {
                  el = null;
              }
          }
          if (!el) {
              return;
          }
          var options = {
              vm: this$1.vm,
              classes: this$1.classes,
              classNames: this$1.classNames,
              delay: this$1.delay,
              scope: this$1.scope,
              events: this$1.events.join('|'),
              initial: this$1.initial,
              targetOf: this$1.id
          };
          if (isCallable(el.$watch)) {
              options.component = el;
              options.el = el.$el;
              options.getter = Generator.resolveGetter(el.$el, {
                  child: el
              });
          } else {
              options.el = el;
              options.getter = Generator.resolveGetter(el, {});
          }
          this$1.dependencies.push({
              name: name,
              field: new Field(options)
          });
      });
  };
  Field.prototype.unwatch = function unwatch (tag) {
          if ( tag === void 0 ) tag = null;

      if (!tag) {
          this.watchers.forEach(function (w) { return w.unwatch(); });
          this.watchers = [];
          return;
      }
      this.watchers.filter(function (w) { return tag.test(w.tag); }).forEach(function (w) { return w.unwatch(); });
      this.watchers = this.watchers.filter(function (w) { return !tag.test(w.tag); });
  };
  Field.prototype.updateClasses = function updateClasses () {
      if (!this.classes || this.isDisabled) 
          { return; }
      toggleClass(this.el, this.classNames.dirty, this.flags.dirty);
      toggleClass(this.el, this.classNames.pristine, this.flags.pristine);
      toggleClass(this.el, this.classNames.touched, this.flags.touched);
      toggleClass(this.el, this.classNames.untouched, this.flags.untouched);
      if (!isNullOrUndefined(this.flags.valid) && this.flags.validated) {
          toggleClass(this.el, this.classNames.valid, this.flags.valid);
      }
      if (!isNullOrUndefined(this.flags.invalid) && this.flags.validated) {
          toggleClass(this.el, this.classNames.invalid, this.flags.invalid);
      }
  };
  Field.prototype.addActionListeners = function addActionListeners () {
          var this$1 = this;

      this.unwatch(/class/);
      if (!this.el) 
          { return; }
      var onBlur = function () {
          this$1.flags.touched = true;
          this$1.flags.untouched = false;
          if (this$1.classes) {
              toggleClass(this$1.el, this$1.classNames.touched, true);
              toggleClass(this$1.el, this$1.classNames.untouched, false);
          }
          this$1.unwatch(/^class_blur$/);
      };
      var inputEvent = isTextInput(this.el) ? 'input' : 'change';
      var onInput = function () {
          this$1.flags.dirty = true;
          this$1.flags.pristine = false;
          if (this$1.classes) {
              toggleClass(this$1.el, this$1.classNames.pristine, false);
              toggleClass(this$1.el, this$1.classNames.dirty, true);
          }
          this$1.unwatch(/^class_input$/);
      };
      if (this.component && isCallable(this.component.$once)) {
          this.component.$once('input', onInput);
          this.component.$once('blur', onBlur);
          this.watchers.push({
              tag: 'class_input',
              unwatch: function () {
                  this$1.component.$off('input', onInput);
              }
          });
          this.watchers.push({
              tag: 'class_blur',
              unwatch: function () {
                  this$1.component.$off('blur', onBlur);
              }
          });
          return;
      }
      if (!this.el) 
          { return; }
      addEventListener(this.el, inputEvent, onInput);
      var blurEvent = ['radio','checkbox'].indexOf(this.el.type) === -1 ? 'blur' : 'click';
      addEventListener(this.el, blurEvent, onBlur);
      this.watchers.push({
          tag: 'class_input',
          unwatch: function () {
              this$1.el.removeEventListener(inputEvent, onInput);
          }
      });
      this.watchers.push({
          tag: 'class_blur',
          unwatch: function () {
              this$1.el.removeEventListener(blurEvent, onBlur);
          }
      });
  };
  Field.prototype.checkValueChanged = function checkValueChanged () {
      if (this.initialValue === null && this.value === '' && isTextInput(this.el)) {
          return false;
      }
      return this.value !== this.initialValue;
  };
  Field.prototype.addValueListeners = function addValueListeners () {
          var this$1 = this;

      this.unwatch(/^input_.+/);
      if (!this.listen || !this.el) 
          { return; }
      var fn = this.targetOf ? function () {
          this$1.flags.changed = this$1.checkValueChanged();
          this$1.validator.validate(("#" + (this$1.targetOf)));
      } : function () {
              var args = [], len = arguments.length;
              while ( len-- ) args[ len ] = arguments[ len ];

          if (args.length === 0 || isCallable(Event) && args[0] instanceof Event || args[0] && args[0].srcElement) {
              args[0] = this$1.value;
          }
          this$1.flags.changed = this$1.checkValueChanged();
          this$1.validator.validate(("#" + (this$1.id)), args[0]);
      };
      var inputEvent = isTextInput(this.el) ? 'input' : 'change';
      inputEvent = this.model && this.model.lazy ? 'change' : inputEvent;
      var events = !this.events.length || isTextInput(this.el) ? this.events : ['change'];
      if (this.model && this.model.expression && events.indexOf(inputEvent) !== -1) {
          var debouncedFn = debounce(fn, this.delay[inputEvent]);
          var unwatch = this.vm.$watch(this.model.expression, function () {
                  var args = [], len = arguments.length;
                  while ( len-- ) args[ len ] = arguments[ len ];

              this$1.flags.pending = true;
              debouncedFn.apply(void 0, args);
          });
          this.watchers.push({
              tag: 'input_model',
              unwatch: unwatch
          });
          events = events.filter(function (e) { return e !== inputEvent; });
      }
      events.forEach(function (e) {
          var debouncedFn = debounce(fn, this$1.delay[e]);
          var validate = function () {
                  var args = [], len = arguments.length;
                  while ( len-- ) args[ len ] = arguments[ len ];

              this$1.flags.pending = true;
              debouncedFn.apply(void 0, args);
          };
          this$1._addComponentEventListener(e, validate);
          this$1._addHTMLEventListener(e, validate);
      });
  };
  Field.prototype._addComponentEventListener = function _addComponentEventListener (evt, validate) {
          var this$1 = this;

      if (!this.component) 
          { return; }
      this.component.$on(evt, validate);
      this.watchers.push({
          tag: 'input_vue',
          unwatch: function () {
              this$1.component.$off(evt, validate);
          }
      });
  };
  Field.prototype._addHTMLEventListener = function _addHTMLEventListener (evt, validate) {
          var this$1 = this;

      if (!this.el || this.component) 
          { return; }
      addEventListener(this.el, evt, validate);
      this.watchers.push({
          tag: 'input_native',
          unwatch: function () {
              this$1.el.removeEventListener(evt, validate);
          }
      });
      if (~['radio','checkbox'].indexOf(this.el.type)) {
          var els = document.querySelectorAll(("input[name=\"" + (this.el.name) + "\"]"));
          toArray(els).forEach(function (el) {
              if (getDataAttribute(el, 'id') && el !== this$1.el) {
                  return;
              }
              addEventListener(el, evt, validate);
              this$1.watchers.push({
                  tag: 'input_native',
                  unwatch: function () {
                      el.removeEventListener(evt, validate);
                  }
              });
          });
      }
  };
  Field.prototype.updateAriaAttrs = function updateAriaAttrs () {
      if (!this.aria || !this.el || !isCallable(this.el.setAttribute)) 
          { return; }
      this.el.setAttribute('aria-required', this.isRequired ? 'true' : 'false');
      this.el.setAttribute('aria-invalid', this.flags.invalid ? 'true' : 'false');
  };
  Field.prototype.updateCustomValidity = function updateCustomValidity () {
      if (!this.validity || !this.el || !isCallable(this.el.setCustomValidity)) 
          { return; }
      this.el.setCustomValidity(this.flags.valid ? '' : this.validator.errors.firstById(this.id) || '');
  };
  Field.prototype.destroy = function destroy () {
      this.unwatch();
      this.dependencies.forEach(function (d) { return d.field.destroy(); });
      this.dependencies = [];
  };

  Object.defineProperties( Field.prototype, prototypeAccessors$2 );

  var FieldBag = function FieldBag() {
      this.items = [];
  };

  var prototypeAccessors$3 = { length: { configurable: true } };
  FieldBag.prototype[typeof Symbol === 'function' ? Symbol.iterator : '@@iterator'] = function () {
          var this$1 = this;

      var index = 0;
      return {
          next: function () { return ({
              value: this$1.items[index++],
              done: index > this$1.items.length
          }); }
      };
  };
  prototypeAccessors$3.length.get = function () {
      return this.items.length;
  };
  FieldBag.prototype.find = function find$1 (matcher) {
      return find(this.items, function (item) { return item.matches(matcher); });
  };
  FieldBag.prototype.filter = function filter (matcher) {
      if (Array.isArray(matcher)) {
          return this.items.filter(function (item) { return matcher.some(function (m) { return item.matches(m); }); });
      }
      return this.items.filter(function (item) { return item.matches(matcher); });
  };
  FieldBag.prototype.map = function map (mapper) {
      return this.items.map(mapper);
  };
  FieldBag.prototype.remove = function remove (matcher) {
      var item = null;
      if (matcher instanceof Field) {
          item = matcher;
      } else {
          item = this.find(matcher);
      }
      if (!item) 
          { return null; }
      var index = this.items.indexOf(item);
      this.items.splice(index, 1);
      return item;
  };
  FieldBag.prototype.push = function push (item) {
      if (!(item instanceof Field)) {
          throw createError('FieldBag only accepts instances of Field that has an id defined.');
      }
      if (!item.id) {
          throw createError('Field id must be defined.');
      }
      if (this.find({
          id: item.id
      })) {
          throw createError(("Field with id " + (item.id) + " is already added."));
      }
      this.items.push(item);
  };

  Object.defineProperties( FieldBag.prototype, prototypeAccessors$3 );

  var RULES = {};
  var STRICT_MODE = true;
  var TARGET_RULES = ['confirmed','after','before'];
  var Validator = function Validator(validations, options) {
      var this$1 = this;
      if ( options === void 0 ) options = {
      fastExit: true
  };

      this.strict = STRICT_MODE;
      this.errors = new ErrorBag();
      this.fields = new FieldBag();
      this.flags = {};
      this._createFields(validations);
      this.paused = false;
      this.fastExit = options.fastExit || false;
      this.ownerId = options.vm && options.vm._uid;
      this._localeListener = (function () {
          this$1.errors.regenerate();
      });
      if (this._vm) {
          this._vm.$on('localeChanged', this._localeListener);
      }
  };

  var prototypeAccessors$4 = { dictionary: { configurable: true },_vm: { configurable: true },locale: { configurable: true },rules: { configurable: true } };
  var staticAccessors$1 = { dictionary: { configurable: true },locale: { configurable: true },rules: { configurable: true } };
  prototypeAccessors$4.dictionary.get = function () {
      return Config.dependency('dictionary');
  };
  prototypeAccessors$4._vm.get = function () {
      return Config.dependency('vm');
  };
  staticAccessors$1.dictionary.get = function () {
      return Config.dependency('dictionary');
  };
  prototypeAccessors$4.locale.get = function () {
      return this.dictionary.locale;
  };
  prototypeAccessors$4.locale.set = function (value) {
      Validator.locale = value;
  };
  staticAccessors$1.locale.get = function () {
      return Validator.dictionary.locale;
  };
  staticAccessors$1.locale.set = function (value) {
      var hasChanged = value !== Validator.dictionary.locale;
      Validator.dictionary.locale = value;
      if (hasChanged && Config.dependency('vm')) {
          Config.dependency('vm').$emit('localeChanged');
      }
  };
  prototypeAccessors$4.rules.get = function () {
      return RULES;
  };
  staticAccessors$1.rules.get = function () {
      return RULES;
  };
  Validator.create = function create (validations, options) {
      return new Validator(validations, options);
  };
  Validator.extend = function extend (name, validator, options) {
          if ( options === void 0 ) options = {};

      Validator._guardExtend(name, validator);
      Validator._merge(name, validator);
      if (options && options.hasTarget) {
          TARGET_RULES.push(name);
      }
  };
  Validator.remove = function remove (name) {
      delete RULES[name];
      var idx = TARGET_RULES.indexOf(name);
      if (idx === -1) 
          { return; }
      TARGET_RULES.splice(idx, 1);
  };
  Validator.isTargetRule = function isTargetRule (name) {
      return TARGET_RULES.indexOf(name) !== -1;
  };
  Validator.setStrictMode = function setStrictMode (strictMode) {
          if ( strictMode === void 0 ) strictMode = true;

      STRICT_MODE = strictMode;
  };
  Validator.prototype.localize = function localize (lang, dictionary) {
      Validator.localize(lang, dictionary);
  };
  Validator.localize = function localize (lang, dictionary) {
          var obj;

      if (isObject(lang)) {
          Validator.dictionary.merge(lang);
          return;
      }
      if (dictionary) {
          var locale = lang || dictionary.name;
          dictionary = assign({}, dictionary);
          Validator.dictionary.merge(( obj = {}, obj[locale] = dictionary, obj ));
      }
      if (lang) {
          Validator.locale = lang;
      }
  };
  Validator.prototype.attach = function attach (field) {
      if (arguments.length > 1) {
          warn('This signature of the attach method has been deprecated, please consult the docs.');
          field = assign({}, {
              name: arguments[0],
              rules: arguments[1]
          }, arguments[2] || {
              vm: {
                  $validator: this
              }
          });
      }
      var value = field.initialValue;
      if (!(field instanceof Field)) {
          field = new Field(field);
      }
      this.fields.push(field);
      if (field.initial) {
          this.validate(("#" + (field.id)), value || field.value);
      } else {
          this._validate(field, value || field.value, true).then(function (result) {
              field.flags.valid = result.valid;
              field.flags.invalid = !result.valid;
          });
      }
      this._addFlag(field, field.scope);
      return field;
  };
  Validator.prototype.flag = function flag (name, flags) {
      var field = this._resolveField(name);
      if (!field || !flags) {
          return;
      }
      field.setFlags(flags);
  };
  Validator.prototype.detach = function detach (name, scope) {
      var field = name instanceof Field ? name : this._resolveField(name, scope);
      if (!field) 
          { return; }
      field.destroy();
      this.errors.remove(field.name, field.scope, field.id);
      this.fields.remove(field);
      var flags = this.flags;
      if (!isNullOrUndefined(field.scope) && flags[("$" + (field.scope))]) {
          delete flags[("$" + (field.scope))][field.name];
      } else if (isNullOrUndefined(field.scope)) {
          delete flags[field.name];
      }
      this.flags = assign({}, flags);
  };
  Validator.prototype.extend = function extend (name, validator, options) {
          if ( options === void 0 ) options = {};

      Validator.extend(name, validator, options);
  };
  Validator.prototype.reset = function reset (matcher) {
      return new Promise((function ($return, $error) {
          return this._vm.$nextTick().then((function ($await_1) {
              try {
                  return this._vm.$nextTick().then((function ($await_2) {
                          var this$1 = this;

                      try {
                          this.fields.filter(matcher).forEach(function (field) {
                              field.reset();
                              this$1.errors.remove(field.name, field.scope, field.id);
                          });
                          return $return();
                      } catch ($boundEx) {
                          return $error($boundEx);
                      }
                  }).bind(this), $error);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }).bind(this));
  };
  Validator.prototype.update = function update (id, ref) {
          var scope = ref.scope;

      var field = this._resolveField(("#" + id));
      if (!field) 
          { return; }
      this.errors.update(id, {
          scope: scope
      });
      if (!isNullOrUndefined(field.scope) && this.flags[("$" + (field.scope))]) {
          delete this.flags[("$" + (field.scope))][field.name];
      } else if (isNullOrUndefined(field.scope)) {
          delete this.flags[field.name];
      }
      this._addFlag(field, scope);
  };
  Validator.prototype.remove = function remove (name) {
      Validator.remove(name);
  };
  Validator.prototype.validate = function validate (name, value, scope, silent) {
          if ( scope === void 0 ) scope = null;
          if ( silent === void 0 ) silent = false;

      var $args = arguments;
      return new Promise((function ($return, $error) {
          var matched, field, result;
          if (this.paused) 
              { return $return(Promise.resolve(true)); }
          if ($args.length === 0) {
              return $return(this.validateScopes());
          }
          if ($args.length === 1 && $args[0] === '*') {
              return $return(this.validateAll());
          }
          if ($args.length === 1 && typeof $args[0] === 'string' && /^(.+)\.\*$/.test($args[0])) {
              matched = $args[0].match(/^(.+)\.\*$/)[1];
              return $return(this.validateAll(matched));
          }
          field = this._resolveField(name, scope);
          if (!field) {
              return $return(this._handleFieldNotFound(name, scope));
          }
          if (!silent) 
              { field.flags.pending = true; }
          if ($args.length === 1) {
              value = field.value;
          }
          if (field.isDisabled) {
              return $return(true);
          }
          return this._validate(field, value).then((function ($await_3) {
              try {
                  result = $await_3;
                  if (!silent) {
                      this._handleValidationResults([result]);
                  }
                  return $return(result.valid);
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }).bind(this));
  };
  Validator.prototype.pause = function pause () {
      this.paused = true;
      return this;
  };
  Validator.prototype.resume = function resume () {
      this.paused = false;
      return this;
  };
  Validator.prototype.validateAll = function validateAll (values, scope, silent) {
          if ( scope === void 0 ) scope = null;
          if ( silent === void 0 ) silent = false;

      return new Promise((function ($return, $error) {
              var this$1 = this;

          var results;
          var matcher, providedValues;
          if (this.paused) 
              { return $return(true); }
          matcher = null;
          providedValues = false;
          if (typeof values === 'string') {
              matcher = {
                  scope: values
              };
          } else if (isObject(values)) {
              matcher = Object.keys(values).map(function (key) { return ({
                  name: key,
                  scope: scope
              }); });
              providedValues = true;
          } else if (Array.isArray(values)) {
              matcher = values.map(function (key) { return ({
                  name: key,
                  scope: scope
              }); });
          } else {
              matcher = {
                  scope: scope
              };
          }
          return Promise.all(this.fields.filter(matcher).map(function (field) { return this$1._validate(field, providedValues ? values[field.name] : field.value); })).then((function ($await_4) {
              try {
                  results = $await_4;
                  if (!silent) {
                      this._handleValidationResults(results);
                  }
                  return $return(results.every(function (t) { return t.valid; }));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }).bind(this));
  };
  Validator.prototype.validateScopes = function validateScopes (silent) {
          if ( silent === void 0 ) silent = false;

      return new Promise((function ($return, $error) {
              var this$1 = this;

          var results;
          if (this.paused) 
              { return $return(true); }
          return Promise.all(this.fields.map(function (field) { return this$1._validate(field, field.value); })).then((function ($await_5) {
              try {
                  results = $await_5;
                  if (!silent) {
                      this._handleValidationResults(results);
                  }
                  return $return(results.every(function (t) { return t.valid; }));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }).bind(this));
  };
  Validator.prototype.destroy = function destroy () {
      this._vm.$off('localeChanged', this._localeListener);
  };
  Validator.prototype._createFields = function _createFields (validations) {
          var this$1 = this;

      if (!validations) 
          { return; }
      Object.keys(validations).forEach(function (field) {
          var options = assign({}, {
              name: field,
              rules: validations[field]
          });
          this$1.attach(options);
      });
  };
  Validator.prototype._getDateFormat = function _getDateFormat (validations) {
      var format = null;
      if (validations.date_format && Array.isArray(validations.date_format)) {
          format = validations.date_format[0];
      }
      return format || this.dictionary.getDateFormat(this.locale);
  };
  Validator.prototype._isADateRule = function _isADateRule (rule) {
      return !(!(~['after','before','date_between','date_format'].indexOf(rule)));
  };
  Validator.prototype._formatErrorMessage = function _formatErrorMessage (field, rule, data, targetName) {
          if ( data === void 0 ) data = {};
          if ( targetName === void 0 ) targetName = null;

      var name = this._getFieldDisplayName(field);
      var params = this._getLocalizedParams(rule, targetName);
      return this.dictionary.getFieldMessage(this.locale, field.name, rule.name, [name,
          params,data]);
  };
  Validator.prototype._getLocalizedParams = function _getLocalizedParams (rule, targetName) {
          if ( targetName === void 0 ) targetName = null;

      if (~TARGET_RULES.indexOf(rule.name) && rule.params && rule.params[0]) {
          var localizedName = targetName || this.dictionary.getAttribute(this.locale, rule.params[0], rule.params[0]);
          return [localizedName].concat(rule.params.slice(1));
      }
      return rule.params;
  };
  Validator.prototype._getFieldDisplayName = function _getFieldDisplayName (field) {
      return field.alias || this.dictionary.getAttribute(this.locale, field.name, field.name);
  };
  Validator.prototype._addFlag = function _addFlag (field, scope) {
          var obj, obj$1, obj$2;

          if ( scope === void 0 ) scope = null;
      if (isNullOrUndefined(scope)) {
          this.flags = assign({}, this.flags, ( obj = {}, obj[("" + (field.name))] = field.flags, obj ));
          return;
      }
      var scopeObj = assign({}, this.flags[("$" + scope)] || {}, ( obj$1 = {}, obj$1[("" + (field.name))] = field.flags, obj$1 ));
      this.flags = assign({}, this.flags, ( obj$2 = {}, obj$2[("$" + scope)] = scopeObj, obj$2 ));
  };
  Validator.prototype._test = function _test (field, value, rule) {
          var this$1 = this;

      var validator = RULES[rule.name];
      var params = Array.isArray(rule.params) ? toArray(rule.params) : [];
      var targetName = null;
      if (!validator || typeof validator !== 'function') {
          throw createError(("No such validator '" + (rule.name) + "' exists."));
      }
      if (TARGET_RULES.indexOf(rule.name) !== -1) {
          var target = find(field.dependencies, function (d) { return d.name === rule.name; });
          if (target) {
              targetName = target.field.alias;
              params = [target.field.value].concat(params.slice(1));
          }
      } else if (rule.name === 'required' && field.rejectsFalse) {
          params = params.length ? params : [true];
      }
      if (this._isADateRule(rule.name)) {
          var dateFormat = this._getDateFormat(field.rules);
          if (rule.name !== 'date_format') {
              params.push(dateFormat);
          }
      }
      var result = validator(value, params);
      if (isCallable(result.then)) {
          return result.then(function (values) {
              var allValid = true;
              var data = {};
              if (Array.isArray(values)) {
                  allValid = values.every(function (t) { return isObject(t) ? t.valid : t; });
              } else {
                  allValid = isObject(values) ? values.valid : values;
                  data = values.data;
              }
              return {
                  valid: allValid,
                  errors: allValid ? [] : [this$1._createFieldError(field, rule, data, targetName)]
              };
          });
      }
      if (!isObject(result)) {
          result = {
              valid: result,
              data: {}
          };
      }
      return {
          valid: result.valid,
          errors: result.valid ? [] : [this._createFieldError(field, rule, result.data, targetName)]
      };
  };
  Validator._merge = function _merge (name, validator) {
      if (isCallable(validator)) {
          RULES[name] = validator;
          return;
      }
      RULES[name] = validator.validate;
      if (validator.getMessage) {
          Validator.dictionary.setMessage(this.locale, name, validator.getMessage);
      }
  };
  Validator._guardExtend = function _guardExtend (name, validator) {
      if (isCallable(validator)) {
          return;
      }
      if (!isCallable(validator.validate)) {
          throw createError(("Extension Error: The validator '" + name + "' must be a function or have a 'validate' method."));
      }
  };
  Validator.prototype._createFieldError = function _createFieldError (field, rule, data, targetName) {
          var this$1 = this;

      return {
          id: field.id,
          field: field.name,
          msg: this._formatErrorMessage(field, rule, data, targetName),
          rule: rule.name,
          scope: field.scope,
          regenerate: function () { return this$1._formatErrorMessage(field, rule, data, targetName); }
      };
  };
  Validator.prototype._resolveField = function _resolveField (name, scope) {
      if (!isNullOrUndefined(scope)) {
          return this.fields.find({
              name: name,
              scope: scope
          });
      }
      if (name[0] === '#') {
          return this.fields.find({
              id: name.slice(1)
          });
      }
      if (name.indexOf('.') > -1) {
          var ref = name.split('.');
              var fieldScope = ref[0];
              var fieldName = ref.slice(1);
          var field = this.fields.find({
              name: fieldName.join('.'),
              scope: fieldScope
          });
          if (field) {
              return field;
          }
      }
      return this.fields.find({
          name: name,
          scope: null
      });
  };
  Validator.prototype._handleFieldNotFound = function _handleFieldNotFound (name, scope) {
      if (!this.strict) 
          { return true; }
      var fullName = isNullOrUndefined(scope) ? name : ("" + (!isNullOrUndefined(scope) ? scope + '.' : '') + name);
      throw createError(("Validating a non-existent field: \"" + fullName + "\". Use \"attach()\" first."));
  };
  Validator.prototype._handleValidationResults = function _handleValidationResults (results) {
      var matchers = results.map(function (result) { return ({
          id: result.id
      }); });
      this.errors.removeById(matchers.map(function (m) { return m.id; }));
      var allErrors = results.reduce(function (prev, curr) {
          prev.push.apply(prev, curr.errors);
          return prev;
      }, []);
      this.errors.add(allErrors);
      this.fields.filter(matchers).forEach(function (field) {
          var result = find(results, function (r) { return r.id === field.id; });
          field.setFlags({
              pending: false,
              valid: result.valid,
              validated: true
          });
      });
  };
  Validator.prototype._validate = function _validate (field, value) {
      return new Promise((function ($return, $error) {
              var this$1 = this;

          var promises, errors;
          var isExitEarly;
          if (!field.isRequired && (isNullOrUndefined(value) || value === '')) {
              return $return({
                  valid: true,
                  id: field.id,
                  errors: []
              });
          }
          promises = [];
          errors = [];
          isExitEarly = false;
          Object.keys(field.rules).some(function (rule) {
              var result = this$1._test(field, value, {
                  name: rule,
                  params: field.rules[rule]
              });
              if (isCallable(result.then)) {
                  promises.push(result);
              } else if (this$1.fastExit && !result.valid) {
                  errors.push.apply(errors, result.errors);
                  isExitEarly = true;
              } else {
                  promises.push(new Promise(function (resolve) { return resolve(result); }));
              }
              return isExitEarly;
          });
          if (isExitEarly) {
              return $return({
                  valid: false,
                  errors: errors,
                  id: field.id
              });
          }
          return Promise.all(promises).then((function ($await_6) {
              try {
                  return $return($await_6.reduce(function (prev, v) {
                          var ref;

                      if (!v.valid) {
                          (ref = prev.errors).push.apply(ref, v.errors);
                      }
                      prev.valid = prev.valid && v.valid;
                      return prev;
                  }, {
                      valid: true,
                      errors: errors,
                      id: field.id
                  }));
              } catch ($boundEx) {
                  return $error($boundEx);
              }
          }).bind(this), $error);
      }).bind(this));
  };

  Object.defineProperties( Validator.prototype, prototypeAccessors$4 );
  Object.defineProperties( Validator, staticAccessors$1 );

  var requestsValidator = function (injections) {
      if (isObject(injections) && injections.$validator) {
          return true;
      }
      return false;
  };
  var createValidator = function (vm, options) { return new Validator(null, {
      vm: vm,
      fastExit: options.fastExit
  }); };
  var mixin = {
      provide: function provide() {
          if (this.$validator && !isBuiltInComponent(this.$vnode)) {
              return {
                  $validator: this.$validator
              };
          }
          return {};
      },
      beforeCreate: function beforeCreate() {
          if (isBuiltInComponent(this.$vnode)) {
              return;
          }
          if (!this.$parent) {
              Config.merge(this.$options.$_veeValidate || {});
          }
          var options = Config.resolve(this);
          var Vue = this.$options._base;
          if (this.$options.$validates) {
              warn('The ctor $validates option has been deprecated please set the $_veeValidate.validator option to "new" instead');
              this.$validator = createValidator(this, options);
          }
          if (!this.$parent || this.$options.$_veeValidate && /new/.test(this.$options.$_veeValidate.validator)) {
              this.$validator = createValidator(this, options);
          }
          var requested = requestsValidator(this.$options.inject);
          if (!this.$validator && options.inject && !requested) {
              this.$validator = createValidator(this, options);
          }
          if (!requested && !this.$validator) {
              return;
          }
          if (!requested && this.$validator) {
              Vue.util.defineReactive(this.$validator, 'errors', this.$validator.errors);
              Vue.util.defineReactive(this.$validator, 'flags', this.$validator.flags);
          }
          if (!this.$options.computed) {
              this.$options.computed = {};
          }
          this.$options.computed[options.errorBagName || 'errors'] = function errorBagGetter() {
              return this.$validator.errors;
          };
          this.$options.computed[options.fieldsBagName || 'fields'] = function fieldBagGetter() {
              return this.$validator.flags;
          };
      },
      beforeDestroy: function beforeDestroy() {
          if (isBuiltInComponent(this.$vnode)) 
              { return; }
          if (this.$validator && this.$validator.ownerId === this._uid) {
              this.$validator.pause();
              this.$validator.destroy();
          }
      }
  }

  var findField = function (el, context) {
      if (!context || !context.$validator) {
          return null;
      }
      return context.$validator.fields.find({
          id: getDataAttribute(el, 'id')
      });
  };
  var directive = {
      bind: function bind(el, binding, vnode) {
          var validator = vnode.context.$validator;
          if (!validator) {
              warn("No validator instance is present on vm, did you forget to inject '$validator'?");
              return;
          }
          var fieldOptions = Generator.generate(el, binding, vnode);
          validator.attach(fieldOptions);
      },
      inserted: function (el, binding, vnode) {
          var field = findField(el, vnode.context);
          var scope = Generator.resolveScope(el, binding, vnode);
          if (!field || scope === field.scope) 
              { return; }
          field.update({
              scope: scope
          });
          field.updated = false;
      },
      update: function (el, binding, vnode) {
          var field = findField(el, vnode.context);
          if (!field || field.updated && isEqual(binding.value, binding.oldValue)) 
              { return; }
          var scope = Generator.resolveScope(el, binding, vnode);
          var rules = Generator.resolveRules(el, binding);
          field.update({
              scope: scope,
              rules: rules
          });
      },
      unbind: function unbind(el, binding, ref) {
          var context = ref.context;

          var field = findField(el, context);
          if (!field) 
              { return; }
          context.$validator.detach(field);
      }
  }

  var Vue;
  function install(_Vue, options) {
      if ( options === void 0 ) options = {};

      if (Vue && _Vue === Vue) {
          if (process.env.NODE_ENV !== 'production') {
              warn('already installed, Vue.use(VeeValidate) should only be called once.');
          }
          return;
      }
      detectPassiveSupport();
      Vue = _Vue;
      Config.register('vm', new Vue());
      Config.merge(options);
      var ref = Config.current;
      var dictionary = ref.dictionary;
      var i18n = ref.i18n;
      if (dictionary) {
          Validator.localize(dictionary);
      }
      if (i18n && i18n._vm && isCallable(i18n._vm.$watch)) {
          i18n._vm.$watch('locale', function () {
              Validator.regenerate();
          });
      }
      if (!i18n && options.locale) {
          Validator.localize(options.locale);
      }
      Validator.setStrictMode(Config.current.strict);
      Vue.mixin(mixin);
      Vue.directive('validate', directive);
  }

  function use(plugin, options) {
      if ( options === void 0 ) options = {};

      if (!isCallable(plugin)) {
          return warn('The plugin must be a callable function');
      }
      plugin({
          Validator: Validator,
          ErrorBag: ErrorBag,
          Rules: Validator.rules
      }, options);
  }

  var normalize = function (fields) {
      if (Array.isArray(fields)) {
          return fields.reduce(function (prev, curr) {
              if (~curr.indexOf('.')) {
                  prev[curr.split('.')[1]] = curr;
              } else {
                  prev[curr] = curr;
              }
              return prev;
          }, {});
      }
      return fields;
  };
  var combine = function (lhs, rhs) {
      var mapper = {
          pristine: function (lhs, rhs) { return lhs && rhs; },
          dirty: function (lhs, rhs) { return lhs || rhs; },
          touched: function (lhs, rhs) { return lhs || rhs; },
          untouched: function (lhs, rhs) { return lhs && rhs; },
          valid: function (lhs, rhs) { return lhs && rhs; },
          invalid: function (lhs, rhs) { return lhs || rhs; },
          pending: function (lhs, rhs) { return lhs || rhs; },
          required: function (lhs, rhs) { return lhs || rhs; },
          validated: function (lhs, rhs) { return lhs && rhs; }
      };
      return Object.keys(mapper).reduce(function (flags, flag) {
          flags[flag] = mapper[flag](lhs[flag], rhs[flag]);
          return flags;
      }, {});
  };
  var mapScope = function (scope, deep) {
      if ( deep === void 0 ) deep = true;

      return Object.keys(scope).reduce(function (flags, field) {
      if (!flags) {
          flags = assign({}, scope[field]);
          return flags;
      }
      var isScope = field.indexOf('$') === 0;
      if (deep && isScope) {
          return combine(mapScope(scope[field]), flags);
      } else if (!deep && isScope) {
          return flags;
      }
      flags = combine(flags, scope[field]);
      return flags;
  }, null);
  };
  var mapFields = function (fields) {
      if (!fields) {
          return function () {
              return mapScope(this.$validator.flags);
          };
      }
      var normalized = normalize(fields);
      return Object.keys(normalized).reduce(function (prev, curr) {
          var field = normalized[curr];
          prev[curr] = function mappedField() {
              if (this.$validator.flags[field]) {
                  return this.$validator.flags[field];
              }
              if (normalized[curr] === '*') {
                  return mapScope(this.$validator.flags, false);
              }
              var index = field.indexOf('.');
              if (index <= 0) {
                  return {};
              }
              var ref = field.split('.');
              var scope = ref[0];
              var name = ref.slice(1);
              scope = this.$validator.flags[("$" + scope)];
              name = name.join('.');
              if (name === '*' && scope) {
                  return mapScope(scope);
              }
              if (scope && scope[name]) {
                  return scope[name];
              }
              return {};
          };
          return prev;
      }, {});
  };

  var ErrorComponent = {
      name: 'vv-error',
      inject: ['$validator'],
      functional: true,
      props: {
          for: {
              type: String,
              required: true
          },
          tag: {
              type: String,
              default: 'span'
          }
      },
      render: function render(createElement, ref) {
          var props = ref.props;
          var injections = ref.injections;

          return createElement(props.tag, injections.$validator.errors.first(props.for));
      }
  };

  var index_minimal = {
      install: install,
      use: use,
      directive: directive,
      mixin: mixin,
      mapFields: mapFields,
      Validator: Validator,
      ErrorBag: ErrorBag,
      ErrorComponent: ErrorComponent,
      version: '2.0.7'
  }

  return index_minimal;

})));
