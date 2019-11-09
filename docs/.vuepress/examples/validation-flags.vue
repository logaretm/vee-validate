<template>
  <ValidationProvider
    name="field"
    rules="required"
    v-slot="{
      valid,
      invalid,
      changed,
      touched,
      untouched,
      pristine,
      dirty,
      pending,
      required,
      validated,
      passed,
      failed
    }"
  >
    <input type="text" v-model="value">
    <ul class="BooleanSwitches">
      <li :class="`is-${valid}`">valid: {{ valid }}</li>
      <li :class="`is-${invalid}`">invalid: {{ invalid }}</li>
      <li :class="`is-${changed}`">changed: {{ changed }}</li>
      <li :class="`is-${touched}`">touched: {{ touched }}</li>
      <li :class="`is-${untouched}`">untouched: {{ untouched }}</li>
      <li :class="`is-${pristine}`">pristine: {{ pristine }}</li>
      <li :class="`is-${dirty}`">dirty: {{ dirty }}</li>
      <li :class="`is-${pending}`">pending: {{ pending }}</li>
      <li :class="`is-${required}`">required: {{ required }}</li>
      <li :class="`is-${validated}`">validated: {{ validated }}</li>
      <li :class="`is-${passed}`">passed: {{ passed }}</li>
      <li :class="`is-${failed}`">failed: {{ failed }}</li>
    </ul>
  </ValidationProvider>
</template>

<script>
export default {
  name: 'validation-flags',
  data: () => ({
    value: ''
  })
};
</script>

<style lang="stylus" scoped>
  .BooleanSwitches
    list-style: none
    padding: 0
    margin: 0
    margin-top: 20px
    box-sizing: border-box
    column-count: 3

    li
      padding: 5px 10px
      transition: background-color 0.3s, color 0.3s ease-in-out
      font-weight: bold
      border-radius: 20px
      text-align: center

      &.is-true
        background-color: #0AE569
        color: #045929

      &.is-false
        background-color: #FFA4A2
        color: #EB0600

    li + li
      margin-top: 10px

</style>
