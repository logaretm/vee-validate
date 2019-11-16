<template>
  <div class="Example">
    <ul class="Example__Header">
      <li class="Example__Header--item">
        <button
          @click="showSource = !showSource"
          :class="{ 'is-active': showSource }"
          :title="showSource ? 'Hide Source' : 'Show Source'"
        >
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M12.89,3L14.85,3.4L11.11,21L9.15,20.6L12.89,3M19.59,12L16,8.41V5.58L22.42,12L16,18.41V15.58L19.59,12M1.58,12L8,5.58V8.41L4.41,12L8,15.58V18.41L1.58,12Z"
            />
          </svg>
        </button>
      </li>
      <li class="Example__Header--item">
        <form
          ref="codepen"
          style="display: none;"
          action="https://codepen.io/pen/define"
          method="POST"
          target="_blank"
        >
          <input type="hidden" name="data" ref="codepenData" />
        </form>
        <button title="Open in Codepen" @click="codepen">
          <svg style="width:24px;height:24px" viewBox="0 0 24 24">
            <path
              fill="#fff"
              d="M15.09,12L12,14.08V14.09L8.91,12L12,9.92V9.92L15.09,12M12,2C11.84,2 11.68,2.06 11.53,2.15L2.5,8.11C2.27,8.22 2.09,8.43 2,8.67V14.92C2,15.33 2,15.33 2.15,15.53L11.53,21.86C11.67,21.96 11.84,22 12,22C12.16,22 12.33,21.95 12.47,21.85L21.85,15.5C22,15.33 22,15.33 22,14.92V8.67C21.91,8.42 21.73,8.22 21.5,8.1L12.47,2.15C12.32,2.05 12.16,2 12,2M16.58,13L19.59,15.04L12.83,19.6V15.53L16.58,13M19.69,8.9L16.58,11L12.83,8.47V4.38L19.69,8.9M20.33,10.47V13.53L18.07,12L20.33,10.47M7.42,13L11.17,15.54V19.6L4.41,15.04L7.42,13M4.31,8.9L11.17,4.39V8.5L7.42,11L4.31,8.9M3.67,10.5L5.93,12L3.67,13.54V10.5Z"
            />
          </svg>
        </button>
      </li>
      <li class="Example__Header--item">
        <form
          ref="codesandbox"
          action="https://codesandbox.io/api/v1/sandboxes/define"
          method="POST"
          style="display: none;"
          target="_blank"
        >
          <input type="hidden" name="parameters" />
        </form>
        <button title="Open in Codesandbox" @click="codesandbox">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="feather feather-codesandbox"
          >
            <path
              d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"
            />
            <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
            <polyline points="7.5 19.79 7.5 14.6 3 12" />
            <polyline points="21 12 16.5 14.6 16.5 19.79" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </button>
      </li>
    </ul>

    <div class="Example__Source">
      <Transition name="slide">
        <div class="Example__Source--content" v-show="showSource" ref="content">
          <slot name="source"></slot>
        </div>
      </Transition>
      <button
        class="Example__Source--copy-btn"
        v-if="showSource"
        title="Copy Snippet"
        @click="copy"
      >
        <svg style="width:24px;height:24px" viewBox="0 0 24 24">
          <path
            d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"
          />
        </svg>
      </button>
    </div>

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
    }
  },
  data: () => ({
    showSource: false
  }),
  computed: {
    loadedComponent() {
      return () => import(`../examples/${this.name}.vue`);
    }
  },
  methods: {
    codepen() {
      // const source = this.$refs.content.innerText;
      // let js = source.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]
      // const html = `<div id="app">${source.match(/<template[^>]*>([\s\S]*?)<\/template>/)[1]}</div>`;
      // const js_external = 'https://unpkg.com/vue@2.6.10/dist/vue.js;https://unpkg.com/vee-validate@3.0.11/dist/vee-validate.full.js';
      // js = js.replace('export default', '');
      // js = `
      //   const Example = Vue.extend(${js});
      //   new Example({
      //     el: '#app'
      //   });
      // `;
      // this.$refs.codepenData.value = JSON.stringify({ "title": this.name, html, js, js_external });
      // this.$refs.codepen.submit();
    },
    codesandbox() {},
    copy() {
      const el = document.createElement('textarea');
      el.value = this.$refs.content.innerText;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      const selected = document.getSelection().rangeCount > 0 ? document.getSelection().getRangeAt(0) : false;
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      if (!selected) return;

      document.getSelection().removeAllRanges();
      document.getSelection().addRange(selected);
    }
  }
};
</script>

<style lang="stylus">
.Example
  border: 1px solid #3eaf7c
  padding: 0
  border-radius: 6px
  overflow: hidden

  &__Header
    list-style: none
    display: flex
    padding: 0
    margin: 0
    justify-content: flex-end
    width: 100%
    background: #3eaf7c

    &--item
      min-height: 48px
      min-width: 48px

      button
        padding: 1rem
        height: 100%
        width: 100%
        display: flex
        align-items: center
        border: none
        background: #3eaf7c
        color: #fff
        border: 2px dashed transparent

        &:hover, &.is-active
          background: darken(#3eaf7c, 20%)

        &:focus
          outline: none
          border-color: #fff

  &__Content
    padding: 2rem

  &__Source
    position: relative

    &--content
      max-height: 70vh
      overflow: auto

      .extra-class
        border-radius: 0 !important

      pre
        margin: 0 !important

    &--copy-btn
      position: absolute
      right: 2rem
      top: 2rem
      border: none
      opacity: 0.6
      z-index: 999999
      background: transparent
      transition: opacity 0.3s ease-in-out

      svg
        fill: #fff

      &:hover
        opacity: 1

      &:focus
        outline: none

.slide-enter-active, .slide-leave-active
  transition: max-height 0.5s

.slide-enter, .slide-leave-to
  max-height: 0
</style>