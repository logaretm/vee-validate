<template>
  <div class="AppWrapper">
    <TheHeader />
    <div class="App">
      <main class="main">
        <Ad />
        <Nuxt />
      </main>

      <div class="lside hidden lg:block">
        <DocMenu class="sticky top-0" />
      </div>

      <div class="rside hidden xl:block">
        <DocToc class="sticky top-0" />
      </div>
    </div>
  </div>
</template>

<style lang="postcss">
.AppWrapper {
  @apply bg-white text-dark w-full min-h-full;
}

.is-dark {
  .AppWrapper {
    @apply bg-dark text-white;
  }
}

.App {
  max-width: 1300px;
  @apply mx-auto;
  grid-template-areas:
    'content'
    'footer';
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;

  @screen lg {
    grid-template-areas:
      'lside content rside'
      'footer footer footer';
    grid-template-columns: 1.5fr 45rem 0.5fr;
    column-gap: 70px;
  }

  @screen xl {
    grid-template-areas:
      'lside content rside'
      'footer footer footer';
    grid-template-columns: 1fr 45rem 1fr;
  }
}

.lside {
  @apply ml-auto;
  grid-area: lside;
}

.main {
  @apply pt-16;
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
