<template>
  <ValidationProvider :rules="rule" v-slot="{ errors, validate }" :vid="$attrs.vid">
    <input
      :type="$attrs.inputType || 'text'"
      v-model="value"
      v-if="type === 'text'"
      placeholder="Enter something..."
    />
    <select v-if="type === 'select'" v-model="value">
      <option v-for="option in options" :value="option.value">{{ option.text }}</option>
    </select>
    <input type="file" v-if="type === 'file'" @change="validate" />
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>


<script>
export default {
  name: 'RuleDemo',
  props: {
    rule: {
      type: [String, Object]
    },
    type: {
      type: String,
      default: 'text'
    },
    options: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    value: ''
  })
};
</script>
