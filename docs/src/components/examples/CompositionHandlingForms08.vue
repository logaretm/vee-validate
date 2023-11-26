<script setup>
import { useForm } from 'vee-validate';
import * as yup from 'yup';

const { resetForm, defineField, meta, errors } = useForm({
  validationSchema: yup.object({
    name: yup.string().required(),
    email: yup.string().email().required(),
    password: yup.string().min(6).required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [name, nameAttrs] = defineField('name');
const [password, passwordAttrs] = defineField('password');
</script>

<template>
  <form>
    <input v-model="name" v-bind="nameAttrs" />
    {{ errors.name }}

    <input type="email" v-model="email" v-bind="emailAttrs" />
    {{ errors.email }}

    <input type="password" v-model="password" v-bind="passwordAttrs" />
    {{ errors.password }}

    <div>
      <button type="button" @click="resetForm()">Reset</button>
      <button
        type="button"
        @click="resetForm({ values: { email: 'test@email.com' }, errors: { password: 'Password taken :-)' } })"
      >
        Reset to specific state
      </button>
    </div>

    <pre>{{ meta }}</pre>
  </form>
</template>
