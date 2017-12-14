<template>
  <div>
    <input type="text" name="textField" id="text" v-validate="'required'">

    <input type="radio" name="radioField" value="1" id="rad1" v-validate="'required'">
    <input type="radio" name="radioField" value="2" id="rad2">

    <input type="checkbox" name="checkboxField" value="1" id="cb1" v-validate="'required'">
    <input type="checkbox" name="checkboxField" value="2" id="cb2">

    <input type="file" name="fileField" id="file">

    <select name="selectField" v-validate="'required'" id="select">
      <option value="">0</option>
      <option value="1">1</option>
      <option value="2">2</option>
    </select>
  </div>
</template>

<script>

export default {
  name: 'input-types-test'
}
</script>
