import Field from './core/field';

// @flow
export default {
  bind (el, binding, vnode) {
    const field = Field.from(el, vnode) || new Field(el, binding, vnode);
    field.onUpdate(el, binding, vnode);
  },
  update (el: HTMLElement, binding, vnode, oldVnode) {
    if (!vnode.context.$validator) {
      return;
    }

    const field = Field.from(el, vnode);
    if (vnode === oldVnode || !field) {
      return;
    }

    field.onUpdate(el, binding, vnode);
  },
  unbind (el: HTMLElement, binding, { context }) {
    // TODO: Clear Field errors if not persisted.
  }
};
