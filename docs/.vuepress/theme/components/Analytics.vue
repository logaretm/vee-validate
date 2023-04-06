<template>
  <div></div>
</template>

<script>
export default {
  name: 'Analytics',
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const script = document.createElement('script');
      script.setAttribute('data-spa', 'auto');
      script.setAttribute('data-site', 'OYTLUCCD');
      script.src = 'https://cdn.usefathom.com/script.js';

      this.$el.appendChild(script);
    }
  }
};
</script>
