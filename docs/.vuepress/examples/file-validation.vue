<template>
  <ValidationProvider rules="required|image" v-slot="{ validate, errors }">
    <input type="file" @change="validate" />
    <p>{{ errors[0] }}</p>
  </ValidationProvider>
</template>

<script>
export default {};
</script>
