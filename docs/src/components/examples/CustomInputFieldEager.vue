<template>
  <input :value="value" v-on="validationListeners" type="text" />
  <span>{{ errorMessage }}</span>
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  type: String,
});

const { errorMessage, value, handleChange, handleBlur } = useField(() => props.name, undefined, {
  validateOnValueUpdate: false,
});

const validationListeners = {
  blur: evt => handleBlur(evt, true),
  change: handleChange,
  input: evt => handleChange(evt, !!errorMessage.value),
};
</script>
