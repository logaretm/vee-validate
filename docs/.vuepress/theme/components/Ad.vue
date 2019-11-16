<template>
  <div id="ad"></div>
</template>

<script>
export default {
  name: 'SidebarAd',
  mounted() {
    const script = document.createElement('script');
    script.src = '//cdn.carbonads.com/carbon.js?serve=CE7DKKQ7&placement=logaretmgithubio';
    script.id = '_carbonads_js';
    this.$el.appendChild(script);
  }
};
</script>

<style lang="stylus">
#ad
  width: 300px
  position: fixed
  z-index: 19
  bottom: 5rem
  right: 10px
  background-color: #fff
  border-radius: 3px
  font-size: 13px

  #carbonads
    display: block
    overflow: hidden
    padding: 10px
    box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.05)
    border-radius: 4px
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', Helvetica, Arial, sans-serif
    line-height: 1.5
    max-width: 300px
    font-size: 12px
    background-color: #fff

  #carbonads a
    text-decoration: none

  #carbonads span
    position: relative
    display: block
    overflow: hidden

  .carbon-img
    float: left
    margin-right: 1em

  .carbon-img img
    display: block

  .carbon-text
    display: block
    float: left
    max-width: calc(100% - 130px - 1em)
    text-align: left
    color: #637381

  .carbon-poweredby
    position: absolute
    left: 142px
    bottom: 0
    display: block
    font-size: 10px
    color: #4b6169
    font-weight: 500
    text-transform: uppercase
    line-height: 1
    letter-spacing: 1px

@media screen and (max-width: 1500px) and (min-width: 1301px)
  #ad
    width: 150px
    #carbonads
      max-width: 150px

    .carbon-img
      margin: 0

    #carbonads,
    .carbon-wrap
      display: flex
      flex-direction: column

    .carbon-text
      margin-top: 10px
      max-width: 150px

    .carbon-poweredby
      position: static
      margin-top: 10px

@media screen and (max-width: 1300px)
  #ad
    margin-top: 3.6rem
    z-index: 1
    position: relative
    padding: 0
    bottom: 0
    right: 0
    float: right
    padding: 0 0 20px 30px
</style>
