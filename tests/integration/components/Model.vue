<template>
  <div>
    <input type="text" name="field" v-validate="'required'" v-model="value" id="watchable">
    <input type="text" name="unwatchablefield" v-validate="'required'" v-model="form['value']" id="unwatchable">
    <input type="text" name="argField" v-validate:input="'required'" v-model="input">
    <input type="text" id="lazy" name="lazy" v-validate="'required'" v-model.lazy="input">
    <child-with-model v-model="value" v-validate="'required'" data-vv-name="customModel"></child-with-model>

    <child-with-model v-for="(val, n) in values" :key="n" v-model="val.value" v-validate="'required'" :data-vv-name="`loop[${n}]`"></child-with-model>
  </div>
</template>

<script>
import ChildWithModel from './stubs/ChildWithModel';

export default {
  name: 'model-test',
  components: {
    ChildWithModel
  },
  data: () => ({
    value: null,
    input: null,
    form: {
      value: null
    },
    values: [
      { value: null }
    ]
  })
};
</script>
