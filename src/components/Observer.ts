import Vue, { VueConstructor } from 'vue';
import { values, findIndex, debounce } from '../utils';
import { ValidationResult, VeeObserver, VNodeWithVeeContext, ValidationFlags, KnownKeys } from '../types';
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
type ObserverErrors = Record<string, string[]>;

let OBSERVER_COUNTER = 0;

type withObserverNode = VueConstructor<
  Vue & {
    $_veeObserver: VeeObserver;
    $vnode: VNodeWithVeeContext;
  }
>;

function data() {
  const refs: Record<string, ProviderInstance> = {};
  const errors: ObserverErrors = {};
  const flags: ValidationFlags = {} as ValidationFlags;
  // FIXME: Not sure of this one can be typed, circular type reference.
  const observers: any[] = [];

  return {
    id: '',
    refs,
    observers,
    errors,
    flags
  };
}

const methods = {
  subscribe(this: any, subscriber: any, kind = 'provider') {
    if (kind === 'observer') {
      this.observers.push(subscriber);
      return;
    }

    this.refs = { ...this.refs, ...{ [subscriber.id]: subscriber } };
  },
  unsubscribe(this: any, id: string, kind = 'provider') {
    if (kind === 'provider') {
      const provider = this.refs[id];
      if (!provider) {
        return;
      }

      this.$delete(this.refs, id);
      return;
    }

    const idx = findIndex(this.observers, (o: any) => o.id === id);
    if (idx !== -1) {
      this.observers.splice(idx, 1);
    }
  },
  async validate(this: any, { silent = false }: { silent?: boolean } = {}) {
    const results = await Promise.all([
      ...values(this.refs)
        .filter((r: any) => !r.disabled)
        .map((ref: any) => ref[silent ? 'validateSilent' : 'validate']().then((r: ValidationResult) => r.valid)),
      ...this.observers.filter((o: any) => !o.disabled).map((obs: any) => obs.validate({ silent }))
    ]);

    return results.every(r => r);
  },
  async handleSubmit(cb: Function) {
    const isValid = await this.validate();
    if (!isValid || !cb) {
      return;
    }

    return cb();
  },
  reset(this: any) {
    return [...values(this.refs), ...this.observers].forEach(ref => ref.reset());
  },
  setErrors(this: any, errors: Record<string, string[]>) {
    Object.keys(errors).forEach(key => {
      const provider = this.refs[key];
      if (!provider) return;

      provider.setErrors(errors[key] || []);
    });

    this.observers.forEach((observer: any) => {
      observer.setErrors(errors);
    });
  }
};

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
  created() {
    this.id = this.vid;
    register(this);

    const onChange = debounce(({ errors, flags }: { errors: ObserverErrors; flags: ValidationFlags }) => {
      this.errors = errors;
      this.flags = flags;
    }, 16);

    this.$watch(() => {
      const vms = [...values(this.refs), ...this.observers];
      const errors: ObserverErrors = {};
      const flags: ValidationFlags = {} as ValidationFlags;

      const length = vms.length;
      for (let i = 0; i < length; i++) {
        const vm = vms[i];
        errors[vm.id] = vm.errors;
      }

      FLAGS_STRATEGIES.forEach(([flag, method]) => {
        flags[flag] = vms[method](vm => vm.flags[flag]);
      });

      return { errors, flags };
    }, onChange as any);
  },
  activated() {
    register(this);
  },
  deactivated() {
    unregister(this);
  },
  beforeDestroy() {
    unregister(this);
  },
  render(h) {
    const children = normalizeChildren(this, prepareSlotProps(this));

    return this.slim && children.length <= 1 ? children[0] : h(this.tag, { on: this.$listeners }, children);
  },
  methods
});

type ObserverInstance = InstanceType<typeof ValidationObserver>;

function unregister(vm: ObserverInstance) {
  if (vm.$_veeObserver) {
    vm.$_veeObserver.unsubscribe(vm.id, 'observer');
  }
}

function register(vm: ObserverInstance) {
  if (vm.$_veeObserver) {
    vm.$_veeObserver.subscribe(vm, 'observer');
  }
}

function prepareSlotProps(vm: ObserverInstance) {
  return {
    ...vm.flags,
    errors: vm.errors,
    validate: vm.validate,
    passes: vm.handleSubmit,
    handleSubmit: vm.handleSubmit,
    reset: vm.reset
  };
}
