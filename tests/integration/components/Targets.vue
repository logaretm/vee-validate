<template>
  <div>
    <input type="text" name="f1" v-validate="'required|confirmed:text'" id="f1">
    <input type="text" name="f2" ref="text" id="f2">

    <!-- NON EXISTANT REF -->
    <input type="text" name="f3" v-validate="'required|confirmed:na'" id="f3">
    <input type="text" name="f4" id="f4">

    <custom-input some-prop="f5" v-validate="'required|confirmed:f6'" v-model="d1"></custom-input>
    <custom-input some-prop="f6" ref="f6" v-model="d2"></custom-input>

    <template v-for="n in 3">
      <custom-input :some-prop="'f7_' + n" v-validate="'required|confirmed:f8_' + n" v-model="d3"></custom-input>
      <custom-input :some-prop="'f8_' + n" :ref="'f8_' + n" v-model="d4"></custom-input>
    </template>
  </div>
</template>

<script>
import CustomInput from './stubs/Input';

export default {
  name: 'targets-test',
  components: {
    CustomInput
  },
  data: () => ({
    d1: null,
    d2: null,
    d3: null,
    d4: null
  })
}
</script>
