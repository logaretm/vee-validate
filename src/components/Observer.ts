import Vue, { CreateElement, VNode, VueConstructor } from 'vue';
import { values, findIndex, warn } from '../utils';
import { ValidationResult, InactiveRefCache, VeeObserver, VNodeWithVeeContext } from '../types';
import { ValidationProvider } from './Provider';
import { normalizeChildren } from '../utils/vnode';

const flagMergingStrategy: {
  [x: string]: 'every' | 'some';
} = {
  pristine: 'every',
  dirty: 'some',
  touched: 'some',
  untouched: 'every',
  valid: 'every',
  invalid: 'some',
  pending: 'some',
  validated: 'every',
  changed: 'some'
};

function mergeFlags(lhs: any, rhs: any, strategy: string) {
  const stratName = flagMergingStrategy[strategy];

  return [lhs, rhs][stratName](f => f);
}

type ProviderInstance = InstanceType<typeof ValidationProvider>;

let OBSERVER_COUNTER = 0;

function data() {
  const refs: Record<string, ProviderInstance> = {};
  const refsByName: typeof refs = {};
  const inactiveRefs: Record<string, InactiveRefCache> = {};
  // FIXME: Not sure of this one can be typed, circular type reference.
  const observers: any[] = [];

  return {
    id: '',
    refs,
    refsByName,
    observers,
    inactiveRefs
  };
}
type withObserverNode = VueConstructor<
  Vue & {
    $_veeObserver: VeeObserver;
    $vnode: VNodeWithVeeContext;
  }
>;

export const ValidationObserver = (Vue as withObserverNode).extend({
  name: 'ValidationObserver',
  provide() {
    return {
      $_veeObserver: this
    };
  },
  inject: {
    $_veeObserver: {
      from: '$_veeObserver',
      default() {
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
      default() {
        return `obs_${OBSERVER_COUNTER++}`;
      }
    },
    slim: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data,
  computed: {
    ctx() {
      const ctx = {
        errors: {},
        passes: (cb: Function) => {
          return this.validate().then(result => {
            if (result) {
              return cb();
            }
          });
        },
        validate: (...args: any[]) => this.validate(...args),
        reset: () => this.reset()
      };
      return [
        ...values(this.refs),
        ...Object.keys(this.inactiveRefs).map(key => {
          return {
            vid: key,
            flags: this.inactiveRefs[key].flags,
            messages: this.inactiveRefs[key].errors
          };
        }),
        ...this.observers
      ].reduce((acc: any, provider: any) => {
        Object.keys(flagMergingStrategy).forEach(flag => {
          const flags = provider.flags || provider.ctx;
          if (!(flag in acc)) {
            acc[flag] = flags[flag];
            return;
          }

          acc[flag] = mergeFlags(acc[flag], flags[flag], flag);
        });

        acc.errors[provider.id] =
          provider.messages ||
          values(provider.ctx.errors).reduce((errs: any[], obsErrors) => {
            return errs.concat(obsErrors);
          }, []);

        return acc;
      }, ctx);
    }
  },
  created() {
    this.id = this.vid;
    if (this.$_veeObserver) {
      this.$_veeObserver.subscribe(this, 'observer');
    }
  },
  activated() {
    if (this.$_veeObserver) {
      this.$_veeObserver.subscribe(this, 'observer');
    }
  },
  deactivated() {
    if (this.$_veeObserver) {
      this.$_veeObserver.unsubscribe(this.id, 'observer');
    }
  },
  beforeDestroy() {
    if (this.$_veeObserver) {
      this.$_veeObserver.unsubscribe(this.id, 'observer');
    }
  },
  render(h: CreateElement): VNode {
    const children = normalizeChildren(this, this.ctx);

    return this.slim && children.length <= 1 ? children[0] : h(this.tag, { on: this.$listeners }, children);
  },
  methods: {
    subscribe(subscriber: any, kind = 'provider') {
      if (kind === 'observer') {
        this.observers.push(subscriber);
        return;
      }

      this.refs = { ...this.refs, ...{ [subscriber.id]: subscriber } };
      this.refsByName = { ...this.refsByName, ...{ [subscriber.name]: subscriber } };
      if (subscriber.persist) {
        this.restoreProviderState(subscriber);
      }
    },
    unsubscribe(id: string, kind = 'provider') {
      if (kind === 'provider') {
        this.removeProvider(id);
        return;
      }

      const idx = findIndex(this.observers, o => o.id === id);
      if (idx !== -1) {
        this.observers.splice(idx, 1);
      }
    },
    async validate({ silent = false }: { silent?: boolean } = {}) {
      const results = await Promise.all([
        ...values(this.refs)
          .filter(r => !r.disabled)
          .map((ref: any) => ref[silent ? 'validateSilent' : 'validate']().then((r: ValidationResult) => r.valid)),
        ...this.observers.filter(o => !o.disabled).map((obs: any) => obs.validate({ silent }))
      ]);

      return results.every(r => r);
    },
    reset() {
      Object.keys(this.inactiveRefs).forEach(key => {
        this.$delete(this.inactiveRefs, key);
      });

      return [...values(this.refs), ...this.observers].forEach(ref => ref.reset());
    },
    restoreProviderState(provider: ProviderInstance) {
      const id = provider.id;
      const state = this.inactiveRefs[id];
      if (!state) {
        return;
      }

      provider.setFlags(state.flags);
      provider.applyResult(state);
      this.$delete(this.inactiveRefs, provider.id);
    },
    removeProvider(id: string) {
      const provider = this.refs[id];
      if (!provider) {
        // FIXME: inactive refs are not being cleaned up.
        return;
      }

      if (provider.persist) {
        /* istanbul ignore next */
        if (process.env.NODE_ENV !== 'production') {
          if (id.indexOf('_vee_') === 0) {
            warn(
              'Please provide a `vid` or a `name` prop when using `persist`, there might be unexpected issues otherwise.'
            );
          }
        }

        // save it for the next time.
        this.inactiveRefs[id] = {
          flags: provider.flags,
          errors: provider.messages,
          failedRules: provider.failedRules
        };
      }

      this.$delete(this.refs, id);
      this.$delete(this.refsByName, provider.name);
    },
    setErrors(errors: Record<string, string[]>) {
      Object.keys(errors).forEach(key => {
        const provider = this.refs[key] || this.refsByName[key];
        if (!provider) return;

        provider.setErrors(errors[key] || []);
      });
    }
  }
});
