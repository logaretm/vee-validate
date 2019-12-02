<template>
  <ValidationProvider mode="lazy" rules="required|min:3|alpha" v-slot="{ errors }">
    <input v-model="value" type="text" placeholder="type something" />
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
