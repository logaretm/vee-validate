import { ValidationProvider } from './provider';
import { identity } from '../utils';
import { findModel, findModelConfig, mergeVNodeListeners, getInputEventName, normalizeSlots } from '../utils/vnode';
import { CreateElement, Component } from 'vue';
import { createValidationCtx, onRenderUpdate, createCommonHandlers, ValidationContext } from './common';

type ValidationContextMapper = (ctx: ValidationContext) => { [k: string]: any };
type ComponentLike = Component | { options: any };

export function withValidation(component: ComponentLike, mapProps: ValidationContextMapper = identity): Component {
  const options = 'options' in component ? component.options : component;
  const hoc: any = {
    name: `${options.name || 'AnonymousHoc'}WithValidation`,
    props: { ...ValidationProvider.props },
    data: ValidationProvider.data,
    computed: { ...ValidationProvider.computed },
    methods: { ...ValidationProvider.methods },
    beforeDestroy: ValidationProvider.beforeDestroy,
    inject: ValidationProvider.inject
  };

  const eventName = (options.model && options.model.event) || 'input';

  hoc.render = function(h: CreateElement) {
    this.registerField();
    const vctx = createValidationCtx(this);
    const listeners = { ...this.$listeners };

    const model = findModel(this.$vnode);
    this._inputEventName = this._inputEventName || getInputEventName(this.$vnode, model);
    onRenderUpdate(this, model);

    const { onInput, onBlur, onValidate } = createCommonHandlers(this);

    mergeVNodeListeners(listeners, eventName, onInput);
    mergeVNodeListeners(listeners, 'blur', onBlur);
    this.normalizedEvents.forEach((evt: string) => {
      mergeVNodeListeners(listeners, evt, onValidate);
    });

    // Props are any attrs not associated with ValidationProvider Plus the model prop.
    // WARNING: Accidental prop overwrite will probably happen.
    const { prop } = findModelConfig(this.$vnode) || { prop: 'value' };
    const props = { ...this.$attrs, ...{ [prop]: model.value }, ...mapProps(vctx) };

    return h(
      options,
      {
        attrs: this.$attrs,
        props,
        on: listeners
      },
      normalizeSlots(this.$slots, this.$vnode.context)
    );
  };

  return hoc;
}
