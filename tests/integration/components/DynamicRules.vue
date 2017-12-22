<template>
  <div>
    <input type="text" name="name" v-validate="rules">
  </div>
</template>

<script>
export default {
  name: 'dynamic-rules-test',
  data: () => ({
    rules: 'required'
  })
};
</script>
