<template>
  <ValidationProvider rules="required" name="fullName" v-slot="{ errors }">
    <input type="text" v-model="fullName" />
    <p>{{ errors[0] }}</p>
    <p>first name: {{ firstName }}</p>
    <p>last name: {{ lastName }}</p>
  </ValidationProvider>
</template>

<script>
export default {
  data: () => ({
    firstName: '',
    lastName: undefined
  }),
  computed: {
    fullName: {
      get() {
        if (this.lastName === undefined) {
          return this.firstName;
        }

        return this.firstName + ' ' + this.lastName;
      },
      set(value) {
        const names = value.split(' ');
        console.log(names);
        this.firstName = names[0];
        this.lastName = names.length === 1 ? undefined : names[1];
      }
    }
  }
};
</script>
