<template>
  <div>
    <input type="text" name="name" id="name" v-validate="'required'">
    <span v-if="fields.name && fields.name.invalid" id="error">{{ errors.first('name') }}</span>

    <input type="text" name="scoped" id="scoped" v-validate="'required'" data-vv-scope="s1">
    <span v-if="fields.$s1 && fields.$s1.name && fields.$s1.name.invalid" id="scopeError">{{ errors.first('scoped') }}</span>
  </div>
</template>

<script>
export default {
  name: 'flags-test'
};
</script>
