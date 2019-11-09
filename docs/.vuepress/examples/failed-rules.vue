<template>
  <ValidationProvider
    name="field"
    rules="required|min:3|email|max:100"
    :bails="false"
    v-slot="{
      failedRules
    }"
  >
    <input type="text" v-model="value">
    <pre style="color: white;">{{ failedRules }}</pre>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'failed-rules',
  data: () => ({
    value: ''
  })
};
</script>
