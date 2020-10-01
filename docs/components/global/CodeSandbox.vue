<template>
  <iframe
    :src="src"
    style="width: 100%; height: 500px; border: 0; border-radius: 4px; overflow: hidden; margin-top: 40px"
    :title="title"
    allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
    sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
  ></iframe>
</template>

<script>
export default {
  name: 'CodeSandbox',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    view: {
      type: String,
      default: undefined,
    },
  },
  computed: {
    src() {
      return `https://codesandbox.io/embed/${this.id}?fontsize=14&hidenavigation=1&theme=${this.$store.state.theme}${
        this.view ? '&view=' + this.view : ''
      }`;
    },
  },
};
</script>
