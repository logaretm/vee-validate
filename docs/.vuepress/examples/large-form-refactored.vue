<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onSubmit)">
      <TextInput v-model="fname" name="First Name" rules="required" />

      <TextInput v-model="lname" name="Last Name" rules="required" />

      <TextInput v-model="email" name="E-mail" rules="required|email" />

      <TextInput v-model="password" type="password" name="Password" rules="required|min:6|confirmed:confirmation" />

      <TextInput v-model="passwordConfirmation" type="password" name="Confirmation" vid="confirmation" rules="required" />

      <TextInput v-model="country" name="Country" rules="required" />

      <button>Submit</button>
    </form>
  </ValidationObserver>
</template>

<script>
import TextInput from './text-input';

export default {
  components: {
    TextInput
  },
  data: () => ({
    fname: '',
    lname: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    country: ''
  }),
  methods: {
    onSubmit () {
      alert('Form submitted!');
    }
  }
}
</script>
