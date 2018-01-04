<template>
  <input :name="name" v-model="input" type="text">
</template>

<script>
export default {
  name: 'custom-input-no-props-component',
  data: () => ({
    input: null
  })
};
</script>
