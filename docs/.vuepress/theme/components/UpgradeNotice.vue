<template>
  <div class="UpgradeNotice">
    <a href="https://logaretm.github.io/vee-validate/">VeeValidate 3 has been released 🚀</a>
  </div>
</template>

<script>
export default {
  name: "UpgradeNotice"
};
</script>

<style lang="stylus" scoped>
.UpgradeNotice
  position: fixed
  background: #087ff4
  width: 100%
  height: 50px
  display: flex
  justify-content: center
  align-items: center
  z-index: 100

  a
    color: #fff
    font-size: 18px
    font-weight: 600
</style>