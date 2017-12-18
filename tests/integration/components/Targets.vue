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
