import { normalizeSlots } from '../utils/vnode';
import { isCallable, values } from '../utils';

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

function mergeFlags (lhs, rhs, strategy) {
  const stratName = flagMergingStrategy[strategy];

  return [lhs, rhs][stratName](f => f);
}

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
    $unsubscribe ({ vid }) {
      delete this.refs[vid];
      this.refs = Object.assign({}, this.refs);
    },
    validate () {
      return Promise.all(values(this.refs).map(ref => {
        return ref.validate().then(result => {
          ref.applyResult(result);

          return result;
        });
      })).then(results => results.every(r => r.valid));
    },
    reset () {
      return values(this.refs).forEach(ref => {
        ref.reset();
      });
    }
  },
  computed: {
    ctx () {
      return values(this.refs).reduce((acc, provider) => {
        Object.keys(flagMergingStrategy).forEach(flag => {
          if (!(flag in acc)) {
            acc[flag] = provider.flags[flag];
            return;
          }

          acc[flag] = mergeFlags(acc[flag], provider.flags[flag], flag);
        });

        acc.errors[provider.vid] = provider.messages;

        return acc;
      }, { errors: {} });
    }
  },
  render (h) {
    let slots = this.$scopedSlots.default;
    if (!isCallable(slots)) {
      slots = () => normalizeSlots(this.$slots, this.$vnode.context);
    }

    const nodes = slots(this.ctx);

    return h(this.tag, {
      attrs: this.$attrs,
      on: this.$listeners
    }, Array.isArray(nodes) ? nodes : [nodes]);
  }
};
