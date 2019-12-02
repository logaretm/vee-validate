<template>
  <ValidationProvider mode="passive" rules="required|min:3|alpha" v-slot="{ errors, validate }">
    <input v-model="value" type="text" placeholder="type something" />
    <span>{{ errors[0] }}</span>
    <button @click="validate()">Validate</button>
  </ValidationProvider>
</template>

<script>
export default {
  data: () => ({
    value: ''
  })
};
</script>
