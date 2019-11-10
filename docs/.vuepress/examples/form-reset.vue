<template>
  <ValidationObserver v-slot="{ handleSubmit, reset }">
    <form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
      <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
        <input v-model="email" type="email">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
        <input v-model="firstName" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
        <input v-model="lastName" type="text">
        <span>{{ errors[0] }}</span>
      </ValidationProvider>

      <button type="submit">Submit</button>
      <button type="reset">Reset</button>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  data: () => ({
    firstName: '',
    lastName: '',
    email: ''
  }),
  methods: {
    onSubmit () {
      alert('Form has been submitted!');
    }
  }
};
</script>

<style lang="stylus" scoped>
span {
  display: block;
}
</style>
