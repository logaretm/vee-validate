<template>
    <pre><code ref="code"><slot></slot></code></pre>
</template>

<script>
import hljs from 'highlight.js';

export default {
  name: 'code-block',
  methods: {
    removeWhitespace() {
      const el = this.$refs.code;
      const txt = el.textContent.replace(/^[\r\n]+/, '').replace(/\s+$/g, '');

      if (/^\S/gm.test(txt)) {
        el.textContent = txt;
        return;
      }

      let str;
      const re = /^[\t ]+/gm;
      let len;
      let min = 1e3;
      let mat;
      // eslint-disable-next-line
      while (mat = re.exec(txt)) {
        len = mat[0].length;

        if (len < min) {
          min = len;
          str = mat[0];
        }
      }

      if (min === 1e3) {
        return;
      }

      el.textContent = txt.replace(new RegExp(`^${str}`, 'gm'), '');
    }
  },
  mounted() {
    this.removeWhitespace();
    hljs.highlightBlock(this.$refs.code);
  }
};
</script>
