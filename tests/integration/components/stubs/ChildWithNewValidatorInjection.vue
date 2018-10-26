<template>
  <input type="text" name="field" v-validate="'required'">
</template>

<script>
export default {
  name: 'inject-new-validator-test',
  $_veeValidate: {
    validator: 'new' // request new validator instance
  }
};
</script>
