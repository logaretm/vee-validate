<template>
  <ValidationProvider rules="required|image" ref="provider" v-slot="{ validate, errors }">
    <input type="file" @change="handleFileChange" />
    <p>{{ errors[0] }}</p>
  </ValidationProvider>
</template>

<script>
export default {
  methods: {
    async handleFileChange(e) {
      const { valid } = await this.$refs.provider.validate(e);

      if (valid) {
        // TODO: Upload the file
        console.log('Uploaded the file...');
      }
    }
  }
};
</script>
