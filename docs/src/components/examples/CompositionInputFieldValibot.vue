<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/valibot';
import * as v from 'valibot';

const { value, errorMessage } = useField(
  'email',
  toTypedSchema(v.pipe(v.string(), v.email('Invalid email'), v.nonEmpty('Required'))),
);
</script>
