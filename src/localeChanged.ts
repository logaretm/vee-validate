import Vue from 'vue';

const EVENT_BUS = new Vue();

export function localeChanged() {
  EVENT_BUS.$emit('change:locale');
}

export { EVENT_BUS };
