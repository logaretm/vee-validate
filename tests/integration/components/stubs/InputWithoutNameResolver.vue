<template>
  <input :name="name" :value="value" type="text" @input="$emit('input', $event.target.value)" @blur="$emit('blur', $event.target.value)">
</template>

<script>
export default {
  name: 'custom-input-component-no-name-resolver',
  $_veeValidate: {
    // value resolver
    value: function () {
      return this.$el.value;
    }
  },
  props: {
    name: String,
    value: null
  }
};
</script>
