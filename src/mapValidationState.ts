import { values, ValidationFlags } from './utils';
import { _Vue } from './plugin';
import Field from './core/field';

interface FieldObserver {
  state: {
    refs: { [k: string]: Field };
  };
  subscribe: (field: Field) => void;
  unsubscribe: (field: Field) => void;
}

export function createObserver (): FieldObserver {
  const state = _Vue.observable({ refs: {} });

  return {
    state,
    subscribe: (ctx: Field) => {
      _Vue.set(state.refs, ctx.vid, ctx);
    },
    unsubscribe: (ctx: Field) => {
      _Vue.delete(state.refs, ctx.vid);
    }
  }
};

function findObserver (vm: any): FieldObserver | undefined {
  if (vm.$_veeObserver) {
    return vm.$_veeObserver;
  }

  if (!vm.$parent) {
    return undefined;
  }

  return findObserver(vm.$parent);
}

interface MappedFieldState {
  errors?: string[];
  flags?: ValidationFlags;
}

interface MappedValidationState {
  fields: { [k: string]: MappedFieldState };
  for: (fieldNameOrVid: string) => MappedFieldState;
}

function mapObserverState(obs: FieldObserver, { errors = true, flags = true }) {
  const collection: { [k: string]: MappedFieldState } = {};
  return values(obs.state.refs).reduce((acc, field) => {
    acc[field.name || field.vid] = {
      errors: errors ? field.errors : null,
      flags: flags ? field.flags : null
    };

    return acc;
  }, collection);
};


export function mapValidationState (propName: string, { errors = true, flags = true, inherit = false } = {}) {
  return {
    [propName](): MappedValidationState {
      if (inherit) {
        this.$_veeObserver = findObserver(this);
      }

      if (!this.$_veeObserver) {
        this.$_veeObserver = createObserver();
      }

      const mapped = mapObserverState(this.$_veeObserver, { errors, flags });

      return {
        fields: mapped,
        for: function(fieldNameOrVid: string): MappedFieldState {
          return this.fields[fieldNameOrVid] || { errors: [] };
        }
      };
    }
  };
};
