<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomCheckbox from './CustomCheckbox.vue';

const { values, errors } = useForm({
  validationSchema: yup.object({
    drinks: yup.array().of(yup.string()).min(1, 'Please select at least 1 drink').required(),
  }),
});
</script>

<template>
  <CustomCheckbox name="drinks" checked-value="coffee" /> Coffee

  <CustomCheckbox name="drinks" checked-value="tea" /> Tea

  <CustomCheckbox name="drinks" checked-value="coke" /> Coke

  <pre>values: {{ values }}</pre>
  <pre>errors: {{ errors }}</pre>
</template>
