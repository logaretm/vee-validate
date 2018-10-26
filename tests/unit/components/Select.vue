<template>
<div>
  <select :value="value" @change="$emit('input', $event.target.value)">
    <slot></slot>
  </select>
  <span id="error">{{ errors[0] }}</span>
</div>
</template>

<script>
export default {
  props: ['errors', 'value']
}
</script>
