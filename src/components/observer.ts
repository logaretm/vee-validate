import { isCallable, values, findIndex, warn } from '../utils';
import { ValidationResult } from '../types';
import { CreateElement, VNode } from 'vue';

const flagMergingStrategy: {
  [x: string]: 'every' | 'some',
} = {
  pristine: 'every',
  dirty: 'some',
  touched: 'some',
  untouched: 'every',
  valid: 'every',
  invalid: 'some',
  pending: 'some',
  validated: 'every',
};

function mergeFlags (lhs: any, rhs: any, strategy: string) {
  const stratName = flagMergingStrategy[strategy];

  return [lhs, rhs][stratName](f => f);
}

let OBSERVER_COUNTER = 0;

export const ValidationObserver: any = {
  name: 'ValidationObserver',
  provide () {
    return {
      $_veeObserver: this
    };
  },
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default(this: any) {
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
    },
    vid: {
      type: String,
      default () {
        return `obs_${OBSERVER_COUNTER++}`;
      }
    }
  },
  data: (): { refs: {}, observers: any[] } => ({
    refs: {},
    observers: [],
  }),
  computed: {
    ctx(this: any) {
      const ctx = {
        errors: {},
        validate: (arg: any) => {
          const promise = this.validate(arg);

          return {
            then (thenable: { then: CallableFunction }) {
              promise.then((success: boolean) => {
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

        acc.errors[provider.vid] = provider.messages || values(provider.ctx.errors).reduce((errs: any[], obsErrors) => {
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
  render (h: CreateElement): VNode {
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
    subscribe(this: any, subscriber: any, kind = 'provider') {
      if (kind === 'observer') {
        this.observers.push(subscriber);
        return;
      }

      this.refs = Object.assign({}, this.refs, { [subscriber.vid]: subscriber });
      if (subscriber.persist && this._persistedStore[subscriber.vid]) {
        this.restoreProviderState(subscriber);
      }
    },
    unsubscribe(this: any, { vid }: any, kind = 'provider') {
      if (kind === 'provider') {
        this.removeProvider(vid);
      }

      const idx = findIndex(this.observers, o => (o as any).vid === vid);
      if (idx !== -1) {
        this.observers.splice(idx, 1);
      }
    },
    async validate(this: any, { silent } = { silent: false }) {
      const results = await Promise.all([
        ...values(this.refs).map((ref: any) => ref[silent ? 'validateSilent' : 'validate']().then((r: ValidationResult) => r.valid)),
        ...this.observers.map((obs: any) => obs.validate({ silent }))
      ]);

      return results.every(r => r);
    },
    reset(this: any) {
      return [...values(this.refs), ...this.observers].forEach(ref => ref.reset());
    },
    restoreProviderState(this: any, provider: any) {
      const state = this._persistedStore[provider.vid];
      provider.setFlags(state.flags);
      provider.applyResult(state);
      delete this._persistedStore[provider.vid];
    },
    removeProvider(this: any, vid: string) {
      const provider = this.refs[vid];
      // save it for the next time.
      if (provider && provider.persist) {
        /* istanbul ignore next */
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
