import { normalizeSlots } from '../utils/vnode';
import { isCallable } from '../utils';

const flagMergingStrategy = {
  pristine: 'every',
  dirty: 'some',
  touched: 'some',
  untouched: 'every',
  valid: 'every',
  invalid: 'some',
  pending: 'some',
  validated: 'every'
};

export const ValidationObserver = {
  name: 'ValidationObserver',
  provide () {
    return {
      $_veeObserver: this
    };
  },
  props: {
    tag: {
      type: String,
      default: 'span'
    }
  },
  data: () => ({
    refs: {}
  }),
  methods: {
    $subscribe (provider) {
      this.refs = Object.assign({}, this.refs, { [provider.vid]: provider });
    },
    $unsubscribe (provider) {
      delete this.refs[provider.vid];
      this.refs = Object.assign({}, this.refs);
    },
    validate () {
      return Promise.all(Object.keys(this.refs).map(ref => {
        return this.refs[ref].validate().then(result => {
          this.refs[ref].applyResult(result);

          return result;
        });
      })).then(results => results.every(r => r.valid));
    },
    reset () {
      return Object.keys(this.refs).forEach(ref => {
        this.refs[ref].reset();
      });
    }
  },
  computed: {
    ctx () {
      return Object.keys(flagMergingStrategy).reduce((acc, flag) => {
        const strategy = flagMergingStrategy[flag];
        acc[flag] = Object.keys(this.refs)[strategy](p => this.refs[p].flags[flag]);

        return acc;
      }, {});
    }
  },
  render (h) {
    let slots = this.$scopedSlots.default;
    if (!isCallable(slots)) {
      slots = () => normalizeSlots(this.$slots, this.$vnode.context);
    }

    return h(this.tag, {
      attrs: this.$attrs,
      on: this.$listeners
    }, slots(this.ctx));
  }
};
