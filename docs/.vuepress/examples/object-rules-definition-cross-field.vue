<template>
  <ValidationObserver>
    <ValidationProvider vid="firstValue" rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="firstValue">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider :rules="{ required: true, maxDifference: { otherValue: '@firstValue', maxDifference: maxDifference } }" v-slot="{ errors }">
      <input type="number" v-model.number="secondValue">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider rules="required" v-slot="{ errors }">
      <input type="number" v-model.number="maxDifference">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  </ValidationObserver>
</template>

<script>
import { extend } from "@vee-validate";

extend("maxDifference", {
  params: ["otherValue", "maxDifference"],
  validate: (value, { otherValue, maxDifference }) => {
    if (
      maxDifference === null ||
      maxDifference === 0 ||
      maxDifference >= Math.abs(value - otherValue)
    ) {
      return true;
    }
    return false;
  },
  message:
    "The difference between the two numbers is too great. The maximum allowed is difference is {maxDifference}."
});

export default {
  data: () => ({
    firstValue: 10,
    secondValue: 10,
    maxDifference: 10
  })
};
</script>
