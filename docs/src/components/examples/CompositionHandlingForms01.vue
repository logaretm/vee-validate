<template>
  <input v-bind="name" />

  <button :disabled="!meta.touched">Submit</button>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { meta, defineInputBinds } = useForm();

const name = defineInputBinds('name');
</script>
