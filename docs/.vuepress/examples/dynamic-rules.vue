<template>
  <div>
    <ValidationProvider :rules="{ required }" v-slot="{ errors }">
      <input v-model="value" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <div>
      <input type="checkbox" v-model="required"> Is Required?
    </div>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: '',
    required: false
  })
};
</script>

