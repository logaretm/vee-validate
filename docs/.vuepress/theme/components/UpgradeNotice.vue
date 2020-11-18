<template>
  <div class="UpgradeNotice">
    <a href="https://vee-validate.logaretm.com/v4/">
      VeeValidate 4.0 has been released for Vue 3 🚀
    </a>
  </div>
</template>

<script>
export default {
  name: 'UpgradeNotice'
};
</script>

<style lang="stylus" scoped>
.UpgradeNotice
  position: fixed
  background: linear-gradient(90deg, #06d77b, #009f53)
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
