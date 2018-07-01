<template>
  <div>
    <input type="text" name="bails" v-validate.bails="'required|min:3|is:3'">
    <input type="text" name="continues" v-validate.continues="'required|min:3|is:3'">
    <input type="text" name="notRequired" v-validate.continues="'min:3|is:3'">
    <input type="text" name="undefined" v-validate="'required|min:3|is:3'">
  </div>
</template>

<script>
export default {
  name: 'basic-test'
};
</script>
