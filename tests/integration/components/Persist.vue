<template>
  <div v-if="displayFields">
    <input type="text" name="field" v-validate="'required'">
    <input type="text" name="field-immediate" v-validate.immediate="'required'">
    <input type="text" name="field-persist" v-validate.persist="'required'">
    <input type="text" name="field-persist-immediate" v-validate.persist.immediate="'required'">
  </div>
</template>

<script>
export default {
  name: 'persist-test',
  data () {
    return {
      displayFields: true
    };
  }
};
</script>
