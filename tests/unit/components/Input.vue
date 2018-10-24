<template>
  <div>
    <input
      @input="$emit('input', $event.target.value)"
      type="text"
      :class="classes"
      id="input"
      name="first"
      placeholder="First"
      autofocus>
    <span id="error">{{ errors && errors[0] }}</span>
  </div>
</template>

<script>

export default {
  name: 'TextInput',
  props: {
    errors: Array
  }
};
</script>
