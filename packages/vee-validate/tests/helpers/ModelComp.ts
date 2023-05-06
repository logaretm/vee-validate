export default {
  props: ['modelValue', 'test'],
  emits: ['blur', 'update:modelValue'],
  template: `<input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')">
  <div v-if="test">{{ test }}</div>`,
};
