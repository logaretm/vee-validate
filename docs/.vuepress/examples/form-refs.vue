<template>
  <ValidationObserver ref="form">
    <form @submit.prevent="handleSubmit(onSubmit)">
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
      this.$refs.form.validate().then(success => {
        if (!success) {
          return;
        }

        alert('Form has been submitted!');

        // Resetting Values
        this.firstName = this.lastName = this.email = '';

        // Wait until the models are updated in the UI
        this.$nextTick(() => {
          this.$refs.form.reset();
        });
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
span {
  display: block;
}
</style>