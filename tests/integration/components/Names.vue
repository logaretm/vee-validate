<template>
  <div>
    <input type="text" name="first" v-validate="'required'" v-model="first">
    <input type="text" name="field" data-vv-name="second" v-validate="'required'" v-model="second">
    <custom-input-no-name-resolver name="third" v-validate="'required'" v-model="third" />
    <custom-input-no-name-resolver data-vv-name="fourth" v-validate="'required'" v-model="fourth" />
    <custom-input some-prop="fifth" v-validate="'required'" v-model="fifth" />
  </div>
</template>

<script>
import CustomInputNoNameResolver from './stubs/InputWithoutNameResolver';
import CustomInput from './stubs/Input';

export default {
  name: 'names-test',
  components: {
    CustomInputNoNameResolver,
    CustomInput
  },
  data: () => ({
    first: null,
    second: null,
    third: null,
    fourth: null,
    fifth: null
  })
}
</script>
