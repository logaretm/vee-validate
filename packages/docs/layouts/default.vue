<template>
  <div class="App">
    <TheHeader />
    <main class="main">
      <Nuxt />
    </main>
  </div>
</template>

<style lang="postcss">
.App {
  @apply w-full min-h-full bg-dark text-white;
  display: grid;
  grid-template-areas:
    'header header header'
    'lside content rside'
    'footer footer footer';
  grid-template-rows: auto 1fr auto;
  grid-gap: 20px;
  grid-template-columns: 1fr auto 1fr;
}

.is-light {
  .App {
    @apply bg-white text-dark;
  }
}

.main {
  grid-area: content;
  width: 80vw;
  @apply mx-auto;
}

@screen md {
  .main {
    width: 70vw;
  }
}

@screen lg {
  .main {
    width: 45rem;
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
