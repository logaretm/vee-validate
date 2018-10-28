import { ValidationProvider, createValidationCtx, createCommonListeners, onRenderUpdate } from './provider';
import { assign, isCallable } from '../utils';
import { findModel, findModelConfig, addListenerToObject, getInputEventName, normalizeSlots } from '../utils/vnode';

export function withValidation (component, ctxToProps = null) {
  const options = isCallable(component) ? component.options : component;
  options.$__veeInject = false;
  const hoc = {
    name: `${options.name || 'AnonymousHoc'}WithValidation`,
    props: assign({}, ValidationProvider.props),
    data: ValidationProvider.data,
    computed: assign({}, ValidationProvider.computed),
    methods: assign({}, ValidationProvider.methods),
    $__veeInject: false,
    beforeDestroy: ValidationProvider.beforeDestroy,
    inject: ValidationProvider.inject
  };

  // Default ctx converts ctx props to component props.
  if (!ctxToProps) {
    ctxToProps = ctx => ctx;
  }

  const eventName = (options.model && options.model.event) || 'input';

  hoc.render = function (h) {
    this.registerField();
    const vctx = createValidationCtx(this);
    const listeners = assign({}, this.$listeners);

    const model = findModel(this.$vnode);
    this._inputEventName = this._inputEventName || getInputEventName(this.$vnode, model);
    onRenderUpdate.call(this, model);

    const { onInput, onBlur } = createCommonListeners(this);

    addListenerToObject(listeners, eventName, onInput);
    addListenerToObject(listeners, 'blur', onBlur);

    this.normalizedEvents.forEach((evt, idx) => {
      addListenerToObject(listeners, evt, (e) => {
        this.validate().then(this.applyResult);
      });
    });

    // Props are any attrs not associated with ValidationProvider Plus the model prop.
    // WARNING: Accidental prop overwrite will probably happen.
    const { prop } = findModelConfig(this.$vnode) || { prop: 'value' };
    const props = assign({}, this.$attrs, { [prop]: model.value }, ctxToProps(vctx));

    return h(options, {
      attrs: this.$attrs,
      props,
      on: listeners
    }, normalizeSlots(this.$slots, this.$vnode.context));
  };

  return hoc;
};
