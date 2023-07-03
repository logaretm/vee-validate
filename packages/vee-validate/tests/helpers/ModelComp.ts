export const ModelComp = {
  props: ['modelValue', 'name', 'test'],
  emits: ['blur', 'update:modelValue'],
  inheritAttrs: false,
  template: `<input type="text" :name="name" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur');console.log(modelValue, '____' + modelValue + '____' )">
  <div v-if="test">{{ test }}</div>`,
};

export const CustomModelComp = {
  props: ['value', 'name', 'test'],
  emits: ['blur', 'update:value'],
  inheritAttrs: false,
  template: `<input type="text" :name="name" :value="value" @input="$emit('update:value', $event.target.value)" @blur="$emit('blur')">
  <div v-if="test">{{ test }}</div>`,
};
