export default {
  props: ['modelValue', 'name', 'test'],
  emits: ['blur', 'update:modelValue'],
  inheritAttrs: false,
  template: `<input type="text" :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')">
  <div v-if="test">{{ test }}</div>`,
};
