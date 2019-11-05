<template>
  <ValidationProvider class="StyledProvider" v-bind="$attrs" v-slot="context">
    <slot v-bind="context"></slot>
  </ValidationProvider>
</template>


<script>
export default {
  name: 'StyledProvider',
  data: () => ({
    value: ''
  })
};
</script>

<style lang="stylus">
$margin = 0.5em
$padding = 0.5em
$border = 1px
$element-lineheight = 1.3
$gray = #E9E8F2
$dark = #383555
$border-radius = 4px

.StyledProvider
  input
    margin-bottom: $margin
    padding: $padding ($padding * 1.5)
    width: 100%
    outline: none
    border-width: $border
    border-style: solid
    border-radius: $border-radius
    border-color: #888888
    box-sizing: border-box
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


  select
    position: relative
    margin-bottom: $margin
    padding: $padding ($padding * 1.5)
    max-width: 100%
    width: 100%
    outline: none
    border-width: $border
    border-style: solid
    border-radius: $border-radius
    background-color: $white
    background-position: right 0.75em center
    background-size: 0.5em
    background-repeat: no-repeat
    box-sizing: border-box
    text-align: left
    -webkit-appearance: none
    -moz-appearance: none
    _select-color: $gray $primary

    &:not([multiple])
      background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 5'%3E%3Cpath fill='#D4D2E5' d='M2 0L0 2h4zm0 5L0 3h4z'/%3E%3C/svg%3E")

    /*
    * select elments
    */
    &-input
      display: flex
      padding: 0
      border: 0
      outline: none
      background-color: transparent
      color: inherit
      text-align: left
      font-size: inherit
      -webkit-appearance: textfield
      -moz-appearance: none

    select
      display: none

    &-labels
      position: absolute
      top: 0
      {$dir-start}: 0
      display: inline-flex
      flex-wrap: wrap
      margin-{$dir-end}: 2em
      padding: 0

    &-label
      display: inline-flex
      justify-content: center
      align-items: center
      overflow: hidden
      margin: 0.2em
      padding: 0.4em
      border-radius: $border-radius
      background-color: $black
      color: $white
      font-size: 1em
      line-height: 1
      _icon-color: currentColor

    &-labelDismiss
      width: 1em
      height: 1em
      color: currentColor

      &:hover
        fill: $gray

    &-menu
      position: absolute
      top: 100%
      right: 0
      left: 0
      z-index: 999
      margin: 0 (- $border)
      border-width: 0 $border $border $border
      border-style: solid
      border-color: inherit
      border-radius: 0 0 $border-radius $border-radius
      background: $white
      font-size: inherit

    &-list
      overflow: auto
      margin: 0
      padding: 0
      max-height: 40vh
      list-style: none

    &-item
      padding: 0
      width: 100%

      &:not(.is-group)
        padding: $padding
        cursor: pointer

    &-childMenu
      margin: 0
      padding: 0
      list-style: none

    &-childTitle
      display: block
      padding: $padding
      color: $gray

    &-childItem
      padding: $padding $padding $padding ($padding * 2)
      cursor: pointer

    // generate size modifiers
    generateSizes()

    // generate color modifiers
    for color in $modifiers-color
      $color = lookup('$' + color)
      $text = isLight(color) ? $black : $color

      &.is-{color}
        _select-color: $color $text

    .is-visible
      display: block

    .is-hidden
      display: none

    &.is-rounded
      border-radius: 10em

    &:disabled, &.is-disabled
      opacity: 0.7
      cursor: not-allowed

    &.is-active
      border-bottom-left-radius: 0
      border-bottom-right-radius: 0

    &.is-disabled
      opacity: 0.7
      pointer-events: none
</style>
