import Vue, { CreateElement, VNode, VueConstructor } from 'vue';
import { values, findIndex, warn, createFlags } from '../utils';
import {
  ValidationResult,
  InactiveRefCache,
  VeeObserver,
  VNodeWithVeeContext,
  ValidationFlags,
  KnownKeys
} from '../types';
import { ValidationProvider } from './Provider';
import { normalizeChildren } from '../utils/vnode';

const FLAGS_STRATEGIES: [KnownKeys<ValidationFlags>, 'every' | 'some'][] = [
  ['pristine', 'every'],
  ['dirty', 'some'],
  ['touched', 'some'],
  ['untouched', 'every'],
  ['valid', 'every'],
  ['invalid', 'some'],
  ['pending', 'some'],
  ['validated', 'every'],
  ['changed', 'some'],
  ['passed', 'every'],
  ['failed', 'some']
];

type ProviderInstance = InstanceType<typeof ValidationProvider>;

let OBSERVER_COUNTER = 0;

function data() {
  const refs: Record<string, ProviderInstance> = {};
  const inactiveRefs: Record<string, InactiveRefCache> = {};
  // FIXME: Not sure of this one can be typed, circular type reference.
  const observers: any[] = [];

  return {
    id: '',
    refs,
    observers,
    inactiveRefs
  };
}

type ObserverErrors = Record<string, string[]>;

type withObserverNode = VueConstructor<
  Vue & {
    $_veeObserver: VeeObserver;
    $vnode: VNodeWithVeeContext;
    sources: any[];
    errors: ObserverErrors;
    flags: ValidationFlags;
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
    errors() {
      return (this as any).ctx.errors;
    },
    flags() {
      return FLAGS_STRATEGIES.reduce(
        (acc: ValidationFlags, [flag]) => {
          acc[flag] = (this as any).ctx[flag];

          return acc;
        },
        {} as ValidationFlags
      );
    },
    ctx() {
      const vms = [...values(this.refs), ...values(this.inactiveRefs), ...this.observers];

      const errors: Record<string, string> = {};
      const props = {
        errors,
        ...createFlags(),
        passes: (cb: Function) => {
          return this.validate().then((result: boolean) => {
            if (!result || !cb) {
              return;
            }

            return cb();
          });
        },
        validate: (...args: any[]) => this.validate(...args),
        reset: () => this.reset()
      };

      const length = vms.length;
      for (let i = 0; i < length; i++) {
        const vm = vms[i];
        props.errors[vm.id] = vm.errors;
      }

      FLAGS_STRATEGIES.forEach(([flag, method]) => {
        props[flag] = vms[method](vm => vm.flags[flag]);
      });

      return props;
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
          id,
          flags: provider.flags,
          errors: provider.errors,
          failedRules: provider.failedRules
        };
      }

      this.$delete(this.refs, id);
    },
    setErrors(errors: Record<string, string[]>) {
      Object.keys(errors).forEach(key => {
        const provider = this.refs[key];
        if (!provider) return;

        provider.setErrors(errors[key] || []);
      });

      this.observers.forEach((observer: any) => {
        observer.setErrors(errors);
      });
    }
  }
});
