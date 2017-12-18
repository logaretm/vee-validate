<template>
  <input :name="name" :value="value" type="text" @input="$emit('input', $event.target.value)" @blur="$emit('blur', $event.target.value)">
</template>

<script>
export default {
  name: 'custom-input-no-resolvers-component',
  props: ['value']
};
</script>
