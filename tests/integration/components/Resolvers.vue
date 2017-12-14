<template>
  <div>
    <custom-input-no-resolver v-validate="'required'" data-vv-name="no-resolver" />
    <custom-input-with-resolver v-validate="'required'" data-vv-name="with-resolver" />
    <custom-input-no-props v-validate="'required'" data-vv-name="no-props" data-vv-value-path="input" />
  </div>
</template>

<script>
import CustomInputNoResolver from './stubs/InputWithoutValueResolver';
import CustomInputWithResolver from './stubs/Input';
import CustomInputNoProps from './stubs/InputWithoutProps';

export default {
  name: 'resolvers-test',
  components: {
    CustomInputNoResolver,
    CustomInputWithResolver,
    CustomInputNoProps
  }
}
</script>
