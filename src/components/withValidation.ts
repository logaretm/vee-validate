import { ValidationProvider } from './Provider';
import { identity } from '../utils';
import {
  findModel,
  findModelConfig,
  mergeVNodeListeners,
  getInputEventName,
  normalizeSlots,
  findValue
} from '../utils/vnode';
import { CreateElement, Component } from 'vue';
import { createValidationCtx, onRenderUpdate, createCommonHandlers, ValidationContext } from './common';

type ValidationContextMapper = (ctx: ValidationContext) => Record<string, any>;
type ComponentLike = Component | { options: any };

export function withValidation(component: ComponentLike, mapProps: ValidationContextMapper = identity): Component {
  const options = 'options' in component ? component.options : component;
  const providerOpts = (ValidationProvider as any).options;
  const hoc: any = {
    name: `${options.name || 'AnonymousHoc'}WithValidation`,
    props: { ...providerOpts.props },
    data: providerOpts.data,
    computed: { ...providerOpts.computed },
    methods: { ...providerOpts.methods },
    beforeDestroy: providerOpts.beforeDestroy,
    inject: providerOpts.inject
  };

  const eventName = options?.model?.event || 'input';

  hoc.render = function(h: CreateElement) {
    this.registerField();
    const vctx = createValidationCtx(this);
    const listeners = { ...this.$listeners };

    const model = findModel(this.$vnode);
    this._inputEventName = this._inputEventName || getInputEventName(this.$vnode, model);
    const value = findValue(this.$vnode);
    onRenderUpdate(this, value?.value);

    const { onInput, onBlur, onValidate } = createCommonHandlers(this);

    mergeVNodeListeners(listeners, eventName, onInput);
    mergeVNodeListeners(listeners, 'blur', onBlur);
    this.normalizedEvents.forEach((evt: string) => {
      mergeVNodeListeners(listeners, evt, onValidate);
    });

    // Props are any attrs not associated with ValidationProvider Plus the model prop.
    // WARNING: Accidental prop overwrite will probably happen.
    const { prop } = findModelConfig(this.$vnode) || { prop: 'value' };
    const props = { ...this.$attrs, ...{ [prop]: model?.value }, ...mapProps(vctx) };

    return h(
      options,
      {
        attrs: this.$attrs,
        props,
        on: listeners,
        scopedSlots: this.$scopedSlots
      },
      normalizeSlots(this.$slots, this.$vnode.context)
    );
  };

  return hoc;
}
