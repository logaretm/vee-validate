<template>
  <ValidationProvider
    name="a11y"
    rules="required|email"
    :bails="false"
    v-slot="{ errors, ariaMsg, ariaInput }"
  >
    <div>
      <input type="text" v-model="value" v-bind="ariaInput">
      <span v-bind="ariaMsg">{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'aria',
  data: () => ({
    value: ''
  })
}
</script>
