/* eslint-disable @typescript-eslint/ban-types */
import Vue, { VueConstructor, VNode } from 'vue';
import { values, findIndex, debounce, createFlags } from '../utils';
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

interface ObserverField {
  id: string;
  name: string;
  failedRules: Record<string, string>;
  pristine: boolean;
  dirty: boolean;
  touched: boolean;
  untouched: boolean;
  valid: boolean;
  invalid: boolean;
  pending: boolean;
  validated: boolean;
  changed: boolean;
  passed: boolean;
  failed: boolean;
}

let OBSERVER_COUNTER = 0;

type withObserverNode = VueConstructor<
  Vue & {
    // eslint-disable-next-line camelcase
    $_veeObserver: VeeObserver;
    $vnode: VNodeWithVeeContext;
  }
>;

function data() {
  const refs: Record<string, ProviderInstance> = {};
  const errors: ObserverErrors = {};
  const flags: ValidationFlags = createObserverFlags();
  const fields: Record<string, ObserverField> = {};
  // FIXME: Not sure of this one can be typed, circular type reference.
  const observers: any[] = [];

  return {
    id: '',
    refs,
    observers,
    errors,
    flags,
    fields
  };
}

function provideSelf(this: any) {
  return {
    $_veeObserver: this
  };
}

export const ValidationObserver = (Vue as withObserverNode).extend({
  name: 'ValidationObserver',
  provide: provideSelf,
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

    const onChange = debounce(
      ({
        errors,
        flags,
        fields
      }: {
        errors: ObserverErrors;
        flags: ValidationFlags;
        fields: Record<string, ObserverField>;
      }) => {
        this.errors = errors;
        this.flags = flags;
        this.fields = fields;
      },
      16
    );

    this.$watch(computeObserverState, onChange as any);
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
  render(h): VNode {
    const children = normalizeChildren(this, prepareSlotProps(this));

    return this.slim && children.length <= 1 ? children[0] : h(this.tag, { on: this.$listeners }, children);
  },
  methods: {
    observe(subscriber: any, kind = 'provider') {
      if (kind === 'observer') {
        this.observers.push(subscriber);
        return;
      }

      this.refs = { ...this.refs, ...{ [subscriber.id]: subscriber } };
    },
    unobserve(id: string, kind = 'provider') {
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
    async validateWithInfo({ silent = false }: { silent?: boolean } = {}) {
      const results = await Promise.all([
        ...values(this.refs)
          .filter((r: any) => !r.disabled)
          .map((ref: any) => ref[silent ? 'validateSilent' : 'validate']().then((r: ValidationResult) => r.valid)),
        ...this.observers.filter((o: any) => !o.disabled).map((obs: any) => obs.validate({ silent }))
      ]);

      const isValid = results.every(r => r);
      const { errors, flags, fields } = computeObserverState.call(this);
      this.errors = errors;
      this.flags = flags;
      this.fields = fields;

      return {
        errors,
        flags,
        fields,
        isValid
      };
    },
    async validate({ silent = false }: { silent?: boolean } = {}) {
      const { isValid } = await this.validateWithInfo({ silent });

      return isValid;
    },
    async handleSubmit(cb: Function) {
      const isValid = await this.validate();
      if (!isValid || !cb) {
        return;
      }

      return cb();
    },
    reset() {
      return [...values(this.refs), ...this.observers].forEach(ref => ref.reset());
    },
    setErrors(errors: Record<string, string[] | string>) {
      Object.keys(errors).forEach(key => {
        const provider = this.refs[key];
        if (!provider) return;
        let errorArr = errors[key] || [];
        errorArr = typeof errorArr === 'string' ? [errorArr] : errorArr;

        provider.setErrors(errorArr);
      });

      this.observers.forEach((observer: any) => {
        observer.setErrors(errors);
      });
    }
  }
});

type ObserverInstance = InstanceType<typeof ValidationObserver>;

function unregister(vm: ObserverInstance) {
  if (vm.$_veeObserver) {
    vm.$_veeObserver.unobserve(vm.id, 'observer');
  }
}

function register(vm: ObserverInstance) {
  if (vm.$_veeObserver) {
    vm.$_veeObserver.observe(vm, 'observer');
  }
}

function prepareSlotProps(vm: ObserverInstance) {
  return {
    ...vm.flags,
    errors: vm.errors,
    fields: vm.fields,
    validate: vm.validate,
    validateWithInfo: vm.validateWithInfo,
    passes: vm.handleSubmit,
    handleSubmit: vm.handleSubmit,
    reset: vm.reset
  };
}

// Creates a modified version of validation flags
function createObserverFlags() {
  return {
    ...createFlags(),
    valid: true,
    invalid: false
  };
}

function computeObserverState(this: ObserverInstance) {
  const vms = [...values(this.refs), ...this.observers.filter(o => !o.disabled)];

  let errors: ObserverErrors = {};
  const flags: ValidationFlags = createObserverFlags();
  let fields: Record<string, ObserverField> = {};

  const length = vms.length;
  for (let i = 0; i < length; i++) {
    const vm = vms[i];

    // validation provider
    if (Array.isArray(vm.errors)) {
      errors[vm.id] = vm.errors;
      fields[vm.id] = {
        id: vm.id,
        name: vm.name,
        failedRules: vm.failedRules,
        ...vm.flags
      };
      continue;
    }

    // Nested observer, merge errors and fields
    errors = { ...errors, ...vm.errors };
    fields = { ...fields, ...vm.fields };
  }

  FLAGS_STRATEGIES.forEach(([flag, method]) => {
    flags[flag] = vms[method](vm => vm.flags[flag]);
  });

  return { errors, flags, fields };
}
