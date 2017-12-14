<template>
  <div>
    <form action="" data-vv-scope="first">
      <input type="text" v-validate="'required'" name="firstField">
      <input type="text" v-validate="'required'" name="secondField" data-vv-scope="second">
    </form>

    <form :data-vv-scope="scope">
      <input type="text" v-validate="'required'" name="thirdField">
    </form>
    <input type="text" v-validate="'required'" name="fourthField" :data-vv-scope="scope">
  </div>
</template>

<script>
export default {
  name: 'scopes-test',
  data: () => ({
    scope: 'third'
  })
};
</script>
