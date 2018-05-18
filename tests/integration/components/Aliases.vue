<template>
  <div>
    <input type="password" name="password" v-model="password" v-validate.initial="'required|confirmed:confirm'" data-vv-as="Password">
    <input type="password" name="confirm" v-model="confirm" v-validate.initial="'required'">
  </div>
</template>

<script>
export default {
  name: 'aliases-test',
  data: () => ({
    password: null,
    confirm: null
  })
};
</script>
