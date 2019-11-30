<template>
  <div>
    <ValidationObserver ref="form">
      <ValidationProvider vid="first" name="First" rules="required|confirmedBy:@second" v-slot="{ errors }">
        First
        <input type="text" v-model="first" />
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider vid="second" name="Second" rules="required" v-slot="{ errors }">
        Second
        <input type="text" v-model="second" />
        <span>{{ errors[0] }}</span>
      </ValidationProvider>
    </ValidationObserver>
  </div>
</template>

<script>
import { ValidationProvider, ValidationObserver, extend } from '@vee-validate';

extend('confirmedBy', {
  params: ['target'],
  // Target here is the value of the target field
  validate(value, { target }) {
    return value === target;
  },
  // here it is its name, because we are generating a message
  message: 'The {_field_} does not match the {target}'
});

export default {
  name: 'Example',
  components: {
    ValidationProvider,
    ValidationObserver
  },
  data: () => ({
    first: 'first',
    second: 'second'
  }),
  methods: {}
};
</script>

<style scoped>
span {
  display: block;
  margin-top: 20px;
}

input + span {
  margin-top: 3px;
}
</style>
