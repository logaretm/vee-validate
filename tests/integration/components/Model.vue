<template>
  <input type="text" name="field" v-validate="'required'" v-model="value">
</template>

<script>
export default {
  name: 'model-test',
  data: () => ({
    value: null
  })
};
</script>
