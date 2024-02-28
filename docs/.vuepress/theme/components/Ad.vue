<template>
  <div id="ad">
    <div data-ea-publisher="vee-validatelogaretmcom" data-ea-type="image"></div>
  </div>
</template>

<script>
export default {
  name: 'SidebarAd',
  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Fix duplicated ads.
        this.$el.querySelector('#ad')
      ) {
        this.$el.innerHTML = '';
        this.load();
      }
    }
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const script = document.createElement('script');
      script.src = 'https://media.ethicalads.io/media/client/ethicalads.min.js';
      this.$el.appendChild(script);
    }
  }
};
</script>

<style lang="stylus">
#ad
  position: fixed
  bottom: 10px
  right: 10px
</style>
