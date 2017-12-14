<template>
  <div>
    <custom-input-no-resolver v-validate="'required'" data-vv-name="no-resolver" />
    <custom-input-with-resolver v-validate="'required'" data-vv-name="with-resolver" />
  </div>
</template>

<script>
import CustomInputNoResolver from './stubs/InputWithoutValueResolver';
import CustomInputWithResolver from './stubs/Input';

export default {
  name: 'resolvers-test',
  components: {
    CustomInputNoResolver,
    CustomInputWithResolver
  }
}
</script>
