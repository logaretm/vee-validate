import { values } from './utils';
import { _Vue } from './plugin';
import Field from './core/field';
import { MappedFieldState, MappedValidationState, MapStateOptions } from './types';

interface FieldObserver {
  state: {
    refs: { [k: string]: Field };
  };
  subscribe: (field: Field) => void;
  unsubscribe: (field: Field) => void;
}

export function createObserver(): FieldObserver {
  const state = _Vue.observable({ refs: {} });

  return {
    state,
    subscribe: (ctx: Field) => {
      _Vue.set(state.refs, ctx.vid, ctx);
    },
    unsubscribe: (ctx: Field) => {
      _Vue.delete(state.refs, ctx.vid);
    }
  };
}

function findObserver(vm: any): FieldObserver | undefined {
  if (vm.$_veeObserver) {
    return vm.$_veeObserver;
  }

  if (!vm.$parent) {
    return undefined;
  }

  return findObserver(vm.$parent);
}

function mapObserverState(obs: FieldObserver) {
  const collection: { [k: string]: MappedFieldState } = {};
  return values(obs.state.refs).reduce((acc, field) => {
    acc[field.name || field.vid] = {
      errors: field.errors,
      flags: field.flags,
      classes: field.classes
    };

    return acc;
  }, collection);
}

export function mapValidationState(propName: string, opts: MapStateOptions = { inherit: false }) {
  return {
    [propName](this: any): MappedValidationState {
      if (opts && opts.inherit) {
        this.$_veeObserver = findObserver(this);
      }

      if (!this.$_veeObserver) {
        this.$_veeObserver = createObserver();
      }

      const mapped = mapObserverState(this.$_veeObserver);

      return {
        fields: mapped,
        for: function(fieldNameOrVid: string): MappedFieldState {
          return this.fields[fieldNameOrVid] || { errors: [], flags: {}, classes: {} };
        }
      };
    }
  };
}
