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
    'lside content rside'
    'footer footer footer';
  display: grid;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
  grid-template-columns: 1fr auto 1fr;

  @screen lg {
    column-gap: 50px;
  }

  @screen xl {
    column-gap: 70px;
  }
}

.lside {
  @apply ml-auto;
  grid-area: lside;
}

.main {
  grid-area: content;
  width: 80vw;
  @apply mx-auto pt-16;
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
