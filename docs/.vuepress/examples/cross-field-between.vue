<template>
  <ValidationObserver>
    <ValidationProvider name="min" rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="minValue" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider rules="required|between:@min,@max" v-slot="{ errors }">
      <input type="number" v-model.number="value" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="max" rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="maxValue" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { extend } from '@vee-validate';

extend('between', {
  params: ['min', 'max'],
  validate(value, { min, max }) {
    return value >= min && value <= max;
  },
  message: 'This field value must be between {min} and {max}'
});

export default {
  data: () => ({
    minValue: 0,
    value: 1,
    maxValue: 10
  })
};
</script>
