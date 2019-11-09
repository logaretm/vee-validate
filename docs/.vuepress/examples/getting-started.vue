<template>
  <ValidationProvider rules="secret" v-slot="{ errors }">
    <input v-model="value" type="text" placeholder="type something">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>

<script>
export default {
 data: () => ({
    value: ''
  }),
  mounted () {
    this.extendRule('secret', {
      validate: value => value === 'example',
      message: 'This is not the magic word'
    });
  }
};
</script>

