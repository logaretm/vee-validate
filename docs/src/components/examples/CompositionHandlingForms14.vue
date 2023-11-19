<script setup>
import { onMounted } from 'vue';
import { useForm } from 'vee-validate';
import * as yup from 'yup';

/**
 * Simulate fetching data from an API
 */
async function fetchData() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        name: 'John Doe',
        email: 'test@email.com',
      });
    }, 1500);
  });
}

const { errors, resetForm, handleSubmit, defineField } = useForm({
  validationSchema: yup.object({
    email: yup.string().email().required(),
    name: yup.string().required(),
  }),
});

const [email, emailAttrs] = defineField('email');
const [name, nameAttrs] = defineField('name');

// Fetch data on mounted
onMounted(async () => {
  const data = await fetchData();

  resetForm({ values: data });
});

const onSubmit = handleSubmit(values => {
  alert(JSON.stringify(values, null, 2));
});
</script>

<template>
  <form @submit="onSubmit">
    <input name="email" v-model="email" v-bind="emailAttrs" />
    <span>{{ errors.email }}</span>

    <input name="name" v-model="name" v-bind="nameAttrs" />
    <span>{{ errors.name }}</span>

    <button>Submit</button>
  </form>
</template>
