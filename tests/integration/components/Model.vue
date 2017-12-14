<template>
  <div>
    <input type="text" name="field" v-validate="'required'" v-model="value" id="watchable">
    <input type="text" name="unwatchablefield" v-validate="'required'" v-model="form['value']" id="unwatchable">
    <input type="text" name="argField" v-validate:input="'required'" v-model="input">
  </div>
</template>

<script>
export default {
  name: 'model-test',
  data: () => ({
    value: null,
    input: null,
    form: {
      value: null
    }
  })
};
</script>
