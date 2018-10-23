// VNode Utils
import { find } from './index';

// Gets the model object on the vnode.
export function findModel (vnode) {
  if (!vnode.data) {
    return null;
  }

  // Component Model
  if (vnode.data.model) {
    return vnode.data.model;
  }

  return !!(vnode.data.directives) && find(vnode.data.directives, d => d.name === 'model');
}
