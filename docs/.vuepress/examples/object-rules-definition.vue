<template>
  <ValidationProvider name="Email" :rules="{ required: true, email: true }" v-slot="{ errors }">
    <label for="email">Email</label>
    <input id="email" v-model="value" type="text" />
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
export default {
  data: () => ({
    value: ''
  })
};
</script>
