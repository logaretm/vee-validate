import { values } from './utils';
import { Vue } from './plugin';

function createObserver () {
  const state = Vue.observable({ refs: {} });
  state.subscribe = (ctx) => {
    Vue.set(state.refs, ctx.vid, ctx);
  };

  state.unsubscribe = (ctx) => {
    Vue.delete(state.refs, ctx.vid);
  };

  return state;
}

export function mapValidationState (propName, { errors = true, flags = true } = {}) {
  function mapObserverState (obs) {
    return values(obs.refs).reduce((acc, field) => {
      acc[field.name || field.vid] = {
        errors: errors ? field.errors : null,
        flags: flags ? field.flags : null
      };

      return acc;
    }, {});
  };

  return {
    [propName] () {
      if (!this.$_veeObserver) {
        this.$_veeObserver = createObserver();
      }

      const state = mapObserverState(this.$_veeObserver);
      state.for = function (field) {
        return this[field] || { errors: [] };
      };

      return state;
    }
  };
};
