<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const initialUserData = {
  id: 1,
  name: '',
  address: '',
  createdAt: Date.now(),
};

const { defineField, handleSubmit } = useForm({
  initialValues: initialUserData,
});

const [name, nameAttrs] = defineField('name');
const [address, addressAttrs] = defineField('address');

const onSubmit = handleSubmit.withControlled(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form @submit="onSubmit">
    <input name="name" v-model="name" v-bind="nameAttrs" />

    <textarea name="address" v-model="address" v-bind="addressAttrs"></textarea>

    <button>Submit</button>
  </form>
</template>
