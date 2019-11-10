<template>
  <ValidationProvider
    name="field"
    rules="required|min:3|email|max:100"
    :bails="false"
    v-slot="{
      classes,
      errors
    }"
  >
    <div class="control" :class="classes">
      <input type="text" v-model="value">
      <span>{{ errors[0] }}</span>
    </div>
  </ValidationProvider>
</template>

<script>
export default {
  data: () => ({
    value: ''
  })
};
</script>

<style lang="stylus" scoped>
  .control
    width: 100%
    span
      display: block
    input
      padding: 5px 10px

    &.invalid
      input, span
        color: #EB0600
      input
        border: 1px #EB0600 solid
    &.valid
      input, span
        color: #045929
      input
        border: 1px #045929 solid

</style>
