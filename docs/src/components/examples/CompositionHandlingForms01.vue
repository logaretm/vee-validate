<template>
  <form>
    <input v-bind="name" />

    <button :disabled="!meta.dirty">Submit</button>
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { meta, defineInputBinds } = useForm();

const name = defineInputBinds('name');
</script>
