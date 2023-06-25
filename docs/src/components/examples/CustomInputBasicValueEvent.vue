<template>
  <input :value="value" @input="$emit('update:value', $event.target.value)" @blur="$emit('blur')" />
</template>

<script setup>
const props = defineProps({
  value: String,
});

const emit = defineEmits(['update:value', 'blur']);
</script>
