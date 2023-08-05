<template>
  <input :value="checkedValue" :checked="checked" @change="handleChange" type="checkbox" />
</template>

<script setup>
import { useField } from 'vee-validate';

const props = defineProps({
  name: String,
  checkedValue: String,
});

// The `name` is returned in a function because we want to make sure it stays reactive
// If the name changes you want `useField` to be able to pick it up
const { handleChange, checked } = useField(() => props.name, undefined, {
  type: 'checkbox',
  checkedValue: props.checkedValue,
});
</script>
