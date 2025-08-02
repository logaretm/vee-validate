<template>
  <input type="text" v-model="value" />
  {{ errorMessage }}
</template>

<script setup>
import { useField } from 'vee-validate';
import * as v from 'valibot';

const { value, errorMessage } = useField('email', v.pipe(v.string(), v.email('Invalid email'), v.nonEmpty('Required')));
</script>
