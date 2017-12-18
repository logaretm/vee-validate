<template>
  <div>
    <input type="text" name="name" id="name" v-validate="'required'">
    <span v-if="fields.name.invalid" id="error">{{ errors.first('name') }}</span>
  </div>
</template>

<script>
export default {
  name: 'flags-test'
};
</script>
