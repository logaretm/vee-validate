import { getDataAttribute } from '../utils/helpers';

// eslint-disable-next-line
export default (options) => ({
    bind(el, binding, vnode) {
        const scope = binding.arg || binding.value || getDataAttribute('scope');
        vnode.context.$validator.addScope(scope);
        el.setAttribute('data-vv-scope', scope);
    }
});
