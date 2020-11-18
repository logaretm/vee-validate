<template>
  <div class="AppWrapper">
    <TheHeader />
    <div class="App">
      <main class="main">
        <Ad />
        <Nuxt />
      </main>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="postcss" scoped>
.AppWrapper {
  @apply bg-white text-gray-700 w-full h-full min-h-screen;
}

.dark {
  .AppWrapper {
    @apply bg-gray-700 text-white;
  }
}

.App {
  @apply h-full mx-auto;
  max-width: 1500px;
  grid-template-areas:
    'content'
    'footer';
  display: grid;
  grid-gap: 20px;
}

.App {
  max-width: 45rem;
  @apply mx-auto;
}

.main {
  @apply py-12 px-6 min-w-0;

  @screen lg {
    @apply px-0;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.8s ease-in-out, transform 0.2s ease-in-out;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
  transform: translate3d(40%, 0, 0);
}
</style>
