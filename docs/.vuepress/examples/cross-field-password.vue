<template>
  <ValidationObserver>
    <ValidationProvider rules="required|password:@confirm" v-slot="{ errors }">
      <input type="password" v-model="password" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="confirm" rules="required" v-slot="{ errors }">
      <input type="password" v-model="confirmation" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { extend } from '@vee-validate';

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});

export default {
  data: () => ({
    password: '',
    confirmation: ''
  })
};
</script>
