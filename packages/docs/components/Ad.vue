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
  @apply static text-gray;
  margin-top: 3.6rem;
  z-index: 1;
  float: right;

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
    display: block;
    overflow: hidden;
  }

  .carbon-img img {
    display: block;
  }

  .carbon-text {
    @apply p-2;
    display: block;
    float: left;
    max-width: calc(100% - 130px - 1em);
    text-align: left;
    color: currentColor;
  }

  .carbon-poweredby {
    @apply p-2;
    position: absolute;
    left: 142px;
    bottom: 0;
    display: block;
    font-size: 10px;
    color: currentColor;
    font-weight: 500;
    text-transform: uppercase;
    line-height: 1;
    letter-spacing: 1px;
  }
}
@screen lg {
  #ad {
    @apply fixed rounded;
    width: 130px;
    z-index: 19;
    bottom: 2rem;
    left: calc((100% - 45rem - 100px) / 2 - 80px);
    background-color: #fff;
    font-size: 13px;
    #carbonads {
      max-width: 100%;
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
    width: 220px;
    margin-left: 0;
    left: unset;
    float: unset;
    right: calc((100% - 45rem) / 2 - 290px);
  }
}

.is-dark {
  #ad {
    #carbonads {
      @apply bg-black;
    }
  }
}
</style>
