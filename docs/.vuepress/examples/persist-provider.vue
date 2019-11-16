<template>
<ValidationObserver ref="form">
  <form @submit.prevent="onSubmit">
    <fieldset>
      <legend >Step {{ currentStep }}</legend>
      <keep-alive>
        <ValidationProvider v-if="currentStep === 1" name="email" rules="required|email" v-slot="{ errors }">
          <input v-model="email" type="text" placeholder="Your email">
          <span>{{ errors[0] }}</span>
        </ValidationProvider>
      </keep-alive>

        <keep-alive>
          <ValidationProvider v-if="currentStep === 2" name="first name" rules="required" v-slot="{ errors }">
            <input v-model="fname" type="text" placeholder="Your first name">
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </keep-alive>
        <keep-alive>
          <ValidationProvider v-if="currentStep === 2" name="last name" rules="required" v-slot="{ errors }">
            <input v-model="lname" type="text" placeholder="Your last name">
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </keep-alive>

        <keep-alive>
          <ValidationProvider v-if="currentStep === 3" name="address" rules="required|min:5" v-slot="{ errors }">
            <textarea v-model="address" type="text" placeholder="Your address"></textarea>
            <span>{{ errors[0] }}</span>
          </ValidationProvider>
        </keep-alive>
    </fieldset>

    <button type="button" @click="goToStep(currentStep - 1)">Previous</button>
    <button type="button" @click="goToStep(currentStep + 1)">{{ currentStep === 3 ? 'Submit' : 'Next' }}</button>
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
    goToStep (step) {
      if (step < 1) {
        return;
      }

      if (step > 3) {
        this.onSubmit();
        return;
      }

      this.currentStep = step;
    },
    onSubmit () {
      this.$refs.form.validate().then(success => {
        if (!success) {
          return;
        }

        alert('Success!');
      });
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
