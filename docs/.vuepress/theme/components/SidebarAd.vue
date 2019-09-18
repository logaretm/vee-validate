<template>
  <div id="codefund">
    <!-- fallback content -->
  </div>
</template>

<script>
function loadScript(src) {
  const script = document.createElement('script');
  script.async = true;
  script.defer = true;
  script.src = src;

  document.body.appendChild(script);
}

export default {
  name: 'SidebarAd',
  mounted() {
    loadScript('https://codefund.io/properties/443/funder.js');
  }
};
</script>
