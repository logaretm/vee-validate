<template>
  <input :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')" />
</template>

<script setup>
const props = defineProps({
  modelValue: String,
});

const emit = defineEmits(['update:modelValue', 'blur']);
</script>
