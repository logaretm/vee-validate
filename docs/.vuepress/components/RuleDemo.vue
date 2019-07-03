<template>
  <ValidationProvider :rules="rule" v-slot="{ errors, validate }" :vid="$attrs.vid" class="vprovider">
    <input
      :type="$attrs.inputType || 'text'"
      v-model="value"
      v-if="type === 'text'"
      placeholder="Enter something..."
    />
    <select v-if="type === 'select'" v-model="value">
      <option v-for="option in options" :value="option.value">{{ option.text }}</option>
    </select>
    <input type="file" v-if="type === 'file'" @change="validate" />
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</template>


<script>
export default {
  name: 'RuleDemo',
  props: {
    rule: {
      type: [String, Object]
    },
    type: {
      type: String,
      default: 'text'
    },
    options: {
      type: Array,
      default: null
    }
  },
  data: () => ({
    value: ''
  })
};
</script>

<style lang="stylus" scoped>
$margin = 0.5em
$padding = 0.5em
$border = 1px
$element-lineheight = 1.3
$gray = #E9E8F2
$dark = #383555
$border-radius = 4px

input
  margin-bottom: $margin
  padding: $padding ($padding * 1.5)
  width: 100%
  outline: none
  border-width: $border
  border-style: solid
  border-radius: $border-radius
  border-color: #888888
  background-color: $white
  line-height: $element-lineheight
  -webkit-appearance: none
  -moz-appearance: none
  _input-color: $gray $dark
  &:focus
    z-index: 1
    border-color: #302d48
    box-shadow: 0 0 0 3px rgba(56,53,85,.25)
    z-index: 1

  &:disabled,
  &.is-disabled
    cursor: not-allowed
    background: $gray

  &[type="color"]
    padding: 0

.vprovider
  span
    display: block
    margin-bottom: .5em
    font-size: .75em
    color: #f22435

</style>