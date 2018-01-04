<template>
  <div>
    <input type="text" name="f1" v-validate="'required|confirmed:f2'" id="f1">
    <input type="text" name="f2" id="f2">

    <input type="text" name="f3" v-validate="'required|confirmed:#f4'" id="f3">
    <input type="text" name="f4" id="f4">

    <input type="text" name="f5" v-validate="'required|confirmed:.f6'" id="f5">
    <input type="text" name="f6" class="f6">

    <custom-input some-prop="f7" v-validate="'required|confirmed:$f8'" v-model="d1"></custom-input>
    <custom-input some-prop="f8" ref="f8" v-model="d2"></custom-input>

    <input type="text" name="f9" v-validate="'required|confirmed:#f10'" id="f9">

    <input type="text" name="f11" v-validate="'required|confirmed:%$selector'" id="f11">

    <input type="text" name="f12" v-validate="'required|confirmed'" id="f12">
    <input type="text" name="f12_confirmation" id="f13">
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
    d2: null
  })
}
</script>
