<template>
  <input type="text" name="field" v-validate="'required'">
</template>

<script>
export default {
  name: 'inject-validator-test',
  inject: ['$validator']
};
</script>
