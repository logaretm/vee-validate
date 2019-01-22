<template>
  <div>
    <input type="text" name="f1" v-validate="'required_if:text,foo,baz|between:20,30'" id="f1" />
    <input type="text" name="f1-continues" v-validate.continues="'required_if:text,foo,baz|between:20,30'" id="f1-continues" />
    <input type="text" name="f2" ref="text" id="f2" />
  </div>
</template>

<script>
export default {
  name: 'computes-required'
}
</script>
