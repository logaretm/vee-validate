<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider tag="div" rules="required" name="First Name" v-slot="{ errors }">
        <input v-model="fname" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider tag="div" rules="required" name="Last Name" v-slot="{ errors }">
        <input v-model="lname" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider tag="div" rules="required|email" name="E-mail" v-slot="{ errors }">
        <input v-model="email" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider tag="div" rules="required|min:6|confirmed:confirmation" name="password" v-slot="{ errors }">
        <input v-model="password" type="password">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider tag="div" vid="confirmation" rules="required" name="Confirmation" v-slot="{ errors }">
        <input v-model="passwordConfirmation" type="password">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider tag="div" name="Country" rules="required" v-slot="{ errors }">
        <input v-model="country" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <button>Submit</button>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
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
