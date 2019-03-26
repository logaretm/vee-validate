import { isCallable, values, findIndex, warn } from '../utils';

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

let OBSERVER_COUNTER = 0;

export const ValidationObserver = {
  name: 'ValidationObserver',
  provide () {
    return {
      $_veeObserver: this
    };
  },
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default () {
        if (!this.$vnode.context.$_veeObserver) {
          return null;
        }

        return this.$vnode.context.$_veeObserver;
      }
    }
  },
  props: {
    tag: {
      type: String,
      default: 'span'
    }
  },
  data: () => ({
    vid: `obs_${OBSERVER_COUNTER++}`,
    refs: {},
    observers: [],
  }),
  computed: {
    ctx () {
      const ctx = {
        errors: {},
        validate: (arg) => {
          const promise = this.validate(arg);

          return {
            then (thenable) {
              promise.then(success => {
                if (success && isCallable(thenable)) {
                  return Promise.resolve(thenable());
                }

                return Promise.resolve(success);
              });
            }
          };
        },
        reset: () => this.reset()
      };

      return [
        ...values(this.refs),
        ...this.observers,
      ].reduce((acc, provider) => {
        Object.keys(flagMergingStrategy).forEach(flag => {
          const flags = provider.flags || provider.ctx;
          if (!(flag in acc)) {
            acc[flag] = flags[flag];
            return;
          }

          acc[flag] = mergeFlags(acc[flag], flags[flag], flag);
        });

        acc.errors[provider.vid] = provider.messages || values(provider.ctx.errors).reduce((errs, obsErrors) => {
          return errs.concat(obsErrors);
        }, []);

        return acc;
      }, ctx);
    }
  },
  created () {
    if (this.$_veeObserver) {
      this.$_veeObserver.subscribe(this, 'observer');
    }
  },
  activated () {
    if (this.$_veeObserver) {
      this.$_veeObserver.subscribe(this, 'observer');
    }
  },
  deactivated () {
    if (this.$_veeObserver) {
      this.$_veeObserver.unsubscribe(this, 'observer');
    }
  },
  beforeDestroy () {
    if (this.$_veeObserver) {
      this.$_veeObserver.unsubscribe(this, 'observer');
    }
  },
  render (h) {
    let slots = this.$scopedSlots.default;
    this._persistedStore = this._persistedStore || {};
    if (!isCallable(slots)) {
      return h(this.tag, this.$slots.default);
    }

    return h(this.tag, {
      on: this.$listeners,
      attrs: this.$attrs
    }, slots(this.ctx));
  },
  methods: {
    subscribe (subscriber, kind = 'provider') {
      if (kind === 'observer') {
        this.observers.push(subscriber);
        return;
      }

      this.refs = Object.assign({}, this.refs, { [subscriber.vid]: subscriber });
      if (subscriber.persist && this._persistedStore[subscriber.vid]) {
        this.restoreProviderState(subscriber);
      }
    },
    unsubscribe ({ vid }, kind = 'provider') {
      if (kind === 'provider') {
        this.removeProvider(vid);
      }

      const idx = findIndex(this.observers, o => o.vid === vid);
      if (idx !== -1) {
        this.observers.splice(idx, 1);
      }
    },
    validate ({ silent } = { silent: false }) {
      return Promise.all([
        ...values(this.refs).map(ref => ref[silent ? 'validateSilent' : 'validate']().then(r => r.valid)),
        ...this.observers.map(obs => obs.validate({ silent }))
      ]).then(results => results.every(r => r));
    },
    reset () {
      return [...values(this.refs), ...this.observers].forEach(ref => ref.reset());
    },
    restoreProviderState (provider) {
      const state = this._persistedStore[provider.vid];
      provider.setFlags(state.flags);
      provider.applyResult(state);
      delete this._persistedStore[provider.vid];
    },
    removeProvider (vid) {
      const provider = this.refs[vid];
      // save it for the next time.
      if (provider && provider.persist) {
        /* istanbul ignore else */
        if (process.env.NODE_ENV !== 'production') {
          if (vid.indexOf('_vee_') === 0) {
            warn('Please provide a `vid` prop when using `persist`, there might be unexpected issues otherwise.');
          }
        }

        this._persistedStore[vid] = {
          flags: provider.flags,
          errors: provider.messages,
          failedRules: provider.failedRules
        };
      }

      this.$delete(this.refs, vid);
    },
  }
};
