<template>
  <div>
    <input type="text" name="email" v-validate="'email'">
  </div>
</template>

<script>
export default {
  name: 'validity-test'
};
</script>
