<template lang="html">
    <pre><code v-el:code :class="class"><slot></slot></code></pre>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/plugins/show-language/prism-show-language.js';

export default {
    props: ['class'],
    methods: {
        removeWhitespace() {
            const el = this.$els.code;
            const txt = el.textContent
                .replace(/^[\r\n]+/, "")
                .replace(/\s+$/g, "");

            if (/^\S/gm.test(txt)) {
                el.textContent = txt;
                return;
            }

            let mat;
            let str;
            const re = /^[\t ]+/gm;
            let len;
            let min = 1e3;

            while (mat = re.exec(txt)) {
                len = mat[0].length;

                if (len < min) {
                    min = len;
                    str = mat[0];
                }
            }

            if (min == 1e3) {
                return;
            }

            el.textContent = txt.replace(new RegExp("^" + str, 'gm'), "");
        }
    },
    ready() {
        this.removeWhitespace();
        Prism.highlightElement(this.$els.code);
    }
}
</script>

<style>
</style>
