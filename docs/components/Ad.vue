<template>
  <div id="ad"></div>
</template>

<script>
export default {
  name: 'SidebarAd',
  watch: {
    $route(to, from) {
      if (
        to.path !== from.path &&
        // Fix duplicated ads.
        this.$el.querySelector('#carbonads')
      ) {
        this.$el.innerHTML = '';
        this.load();
      }
    },
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      const script = document.createElement('script');
      script.src = '//cdn.carbonads.com/carbon.js?serve=CE7DKKQ7&placement=logaretmgithubio';
      script.id = '_carbonads_js';
      this.$el.appendChild(script);
    },
  },
};
</script>

<style lang="postcss">
#ad {
  @apply static text-gray-400 mb-8;
  z-index: 1;

  #carbonads {
    display: block;
    overflow: hidden;
    box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.05);
    border-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue',
      Helvetica, Arial, sans-serif;
    line-height: 1.5;
    max-width: 300px;
    font-size: 12px;
    background-color: #fff;
  }

  #carbonads a {
    text-decoration: none;
  }

  #carbonads span {
    position: relative;
    display: flex;
    overflow: hidden;
  }

  .carbon-img img {
    display: block;
    @apply mx-auto;
  }

  .carbon-text {
    @apply p-2 block float-left text-left;
    max-width: calc(100% - 130px - 1em);
    color: currentColor;
  }

  .carbon-poweredby {
    @apply p-2 absolute bottom-0 block uppercase;
    left: 142px;
    bottom: 0;
    font-size: 10px;
    color: currentColor;
    font-weight: 500;
    line-height: 1;
    letter-spacing: 1px;
  }
}
@screen lg {
  #ad {
    @apply fixed rounded ml-0;
    width: 160px;
    z-index: 19;
    bottom: 2rem;
    left: calc((100% - 45rem - 100px) / 2 - 140px);
    background-color: #fff;
    font-size: 13px;
    #carbonads {
      padding-top: 15px;
      max-width: 100%;
    }

    #carbonads span {
      @apply flex-col;
    }

    .carbon-img {
      margin: 0;
    }

    #carbonads,
    .carbon-wrap {
      display: flex;
      flex-direction: column;
    }

    .carbon-text {
      margin-top: 10px;
      max-width: 100%;
    }

    .carbon-poweredby {
      position: static;
      margin-top: 10px;
    }
  }
}

@screen xl {
  #ad {
    margin-left: 0;
    left: unset;
    float: unset;
    right: calc((100% - 45rem) / 2 - 230px);
  }
}

.dark {
  #ad {
    #carbonads {
      @apply bg-black;
    }
  }
}
</style>
