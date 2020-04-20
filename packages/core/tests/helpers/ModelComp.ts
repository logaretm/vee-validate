export default {
  props: ['value'],
  template: `<input type="text" :value="value" @input="emit('input', $event)">`,
};
