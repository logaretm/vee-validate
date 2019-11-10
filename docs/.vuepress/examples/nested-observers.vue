<template>
<ValidationObserver v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(onSubmit)">
    <ValidationObserver v-if="currentStep === 1">
      <fieldset>
        <legend>Step 1</legend>
        <ValidationProvider name="email" rules="required|email" v-slot="{ errors }">
          <input v-model="email" type="text" placeholder="Your email">
          <span>{{ errors[0] }}</span>
        </ValidationProvider>
      </fieldset>
    </ValidationObserver>

    <ValidationObserver v-else-if="currentStep === 2">
      <fieldset>
        <legend>Step 2</legend>
        <ValidationProvider name="first name" rules="required" v-slot="{ errors }">
          <input v-model="fname" type="text" placeholder="Your first name">
          <span>{{ errors[0] }}</span>
        </ValidationProvider>

        <ValidationProvider name="last name" rules="required" v-slot="{ errors }">
          <input v-model="lname" type="text" placeholder="Your last name">
          <span>{{ errors[0] }}</span>
        </ValidationProvider>
      </fieldset>
    </ValidationObserver>

    <ValidationObserver v-else-if="currentStep === 3">
      <fieldset>
        <legend>Step 3</legend>
        <ValidationProvider name="address" rules="required|min:5" v-slot="{ errors }">
          <textarea v-model="address" type="text" placeholder="Your address"></textarea>
          <span>{{ errors[0] }}</span>
        </ValidationProvider>
      </fieldset>
    </ValidationObserver>

    <button type="submit">Next</button>
  </form>
</ValidationObserver>
</template>

<script>
export default {
  data: () => ({
    currentStep: 1,
    address: '',
    fname: '',
    lname: '',
    email: ''
  }),
  methods: {
    onSubmit () {
      if (this.currentStep === 3) {
        alert('Form submitted!');
        return;
      }

      this.currentStep++;
    }
  }
}
</script>

<style lang="stylus" scoped>
span {
  display: block;
}

button {
  margin-top: 20px;
}
</style>
