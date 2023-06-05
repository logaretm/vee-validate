<template>
  <div class="input-field">
    <input
      :value="value"
      :type="type || 'text'"
      :class="{ dirty: meta.dirty, valid: meta.touched && meta.valid, invalid: meta.touched && !meta.valid }"
      @change="handleChange"
      @blur="handleBlur"
    />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  type: String,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { handleChange, value, handleBlur, errorMessage, meta } = useField(() => props.name, undefined);
</script>

<style scoped>
.input-field {
  font-size: 14px;
}

input {
  display: block;
}

input.valid {
  border-color: #41b883;
}

input.invalid {
  border-color: #e74c3c;
}

input.dirty::after {
  content: '*';
  color: cadetblue;
}

.error {
  color: red;
  display: block;
}
</style>
