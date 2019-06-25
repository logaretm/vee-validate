import { ValidationProvider, ValidationObserver } from '../../dist/vee-validate.full.esm';

const CodeSample = {
  functional: true,
  render (h, { slots }) {
    const demo = h('div', {
      style: {
        width: '50%',
        flexBasis: '50%'
      }
    }, slots.demo);

    const snippet = h('div', {
      style: {
        width: '50%',
        flexBasis: '50%'
      }
    }, slots.code);

    return h('div', {
      style: {
        display: 'flex',
        flexDirection: 'row'
      }
    }, [demo, snippet]);
  }
};

export default ({ Vue }) => {
  Vue.component('CodeSample', CodeSample);
  Vue.component('ValidationProvider', ValidationProvider);
  Vue.component('ValidationObserver', ValidationObserver);
};
