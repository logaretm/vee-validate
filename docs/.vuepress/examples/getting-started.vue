<template>
  <ValidationProvider rules="even" v-slot="{ errors }">
    <input v-model="value" type="number" placeholder="type something">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
import { extend } from '@vee-validate';

extend('even', value => {
  return value % 2 === 0;
});

export default {
 data: () => ({
    value: ''
  })
};
</script>

