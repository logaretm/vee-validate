import { getDataAttribute } from './utils/helpers';

export default {
    bind(el, binding, vnode) {
        const scope = binding.arg || binding.value || getDataAttribute('scope');
        vnode.context.$validator.addScope(scope);
        el.setAttribute('data-vv-scope', scope);
    }
};
