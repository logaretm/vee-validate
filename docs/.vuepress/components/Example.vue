<template>
  <div class="Example">
    <ul class="Example__Header">
      <li class="Example__Header--item">
        <button @click="showSource = !showSource" :class="{ 'is-active': showSource }">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z" />
          </svg>
          <span>Source</span>
        </button>
      </li>
      <!-- <li class="Example__Header--item">
        <form ref="codepen" style="display: none;" action="https://codepen.io/pen/define" method="POST" target="_blank">
          <input type="hidden" name="data" :value="codepen">
        </form>
        <button title="Open in Codepen" @click="$refs.codepen.submit()">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path d="M15.09,12L12,14.08V14.09L8.91,12L12,9.92V9.92L15.09,12M12,2C11.84,2 11.68,2.06 11.53,2.15L2.5,8.11C2.27,8.22 2.09,8.43 2,8.67V14.92C2,15.33 2,15.33 2.15,15.53L11.53,21.86C11.67,21.96 11.84,22 12,22C12.16,22 12.33,21.95 12.47,21.85L21.85,15.5C22,15.33 22,15.33 22,14.92V8.67C21.91,8.42 21.73,8.22 21.5,8.1L12.47,2.15C12.32,2.05 12.16,2 12,2M16.58,13L19.59,15.04L12.83,19.6V15.53L16.58,13M19.69,8.9L16.58,11L12.83,8.47V4.38L19.69,8.9M20.33,10.47V13.53L18.07,12L20.33,10.47M7.42,13L11.17,15.54V19.6L4.41,15.04L7.42,13M4.31,8.9L11.17,4.39V8.5L7.42,11L4.31,8.9M3.67,10.5L5.93,12L3.67,13.54V10.5Z" />
          </svg>
        </button>
      </li> -->
    </ul>

    <Transition name="slide">
      <div class="Example__Source" v-if="showSource">
        <slot name="source"></slot>
      </div>
    </Transition>

    <div class="Example__Content">
      <Component :is="loadedComponent" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Example',
  props: {
    name: {
      type: String,
      required: true
    },
  },
  data: () => ({
    showSource: false
  }),
  computed: {
    loadedComponent () {
      return () => import(`../examples/${this.name}.vue`);
    },
    codepen() {
      // const html = `<div id="app">${this.html}</div>`;
      // const js_external = 'https://unpkg.com/vue@2.6.10/dist/vue.js;https://unpkg.com/vee-validate@3.0.11/dist/vee-validate.full.js';
      // let js = this.script.replace('export default', '');

      // js = `
      //   const Example = Vue.extend(${js});

      //   new Example({
      //     el: '#app'
      //   });
      // `;

      // return JSON.stringify({ "title": this.name, html, js, js_external });
    }
  },
}
</script>


<style lang="stylus">
.Example
  border: 1px solid #3eaf7c;
  padding: 0;
  border-radius: 6px;
  overflow hidden;

  &__Header
    list-style: none
    display: flex
    padding: 0
    margin: 0
    justify-content: flex-end
    width: 100%
    background: #3eaf7c

    &--item
      button
        padding: 1rem
        height: 100%
        display: flex
        align-items: center
        border: none
        background: #3eaf7c
        color: #fff
        svg
          fill: currentColor

        &:hover,
        &.is-active
          background: darken(#3eaf7c, 20%)



  &__Content
    padding: 2rem

  &__Source
    overflow: auto
    max-height: 70vh

    .extra-class
      border-radius: 0 !important
    pre
      margin: 0 !important

.slide-enter-active, .slide-leave-active
  transition: max-height .5s

.slide-enter, .slide-leave-to
  max-height: 0

</style>