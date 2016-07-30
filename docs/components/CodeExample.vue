<template>
    <div class="pure-g">
        <div v-el="example" class="pure-u-1">
            <slot name="example"></slot>
        </div>
        <div class="pure-u-1">
            <div class="pure-menu pure-menu-horizontal">
                <ul class="pure-menu-list">
                    <li class="pure-menu-item"><a @click="activeMenu = 'html'" class="pure-menu-link">HTML</a></li>
                    <li class="pure-menu-item"><a @click="activeMenu = 'js'" class="pure-menu-link">JavaScript</a></li>
                </ul>
            </div>
            <pre v-show="activeMenu === 'html'"><code v-el:html class="language-html"><slot name="code-html"></slot></code></pre>
            <pre v-show="activeMenu === 'js'"><code v-el:js class="language-javascript"><slot name="code-js"></slot></code></pre>
        </div>
    </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/themes/prism-okaidia.css';

export default {
    data() {
        return {
            activeMenu: ''
        }
    },
    methods: {
        removeWhitespaceForEl(el) {
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
        },

        removeWhitespace() {
            this.removeWhitespaceForEl(this.$els.js);
            this.removeWhitespaceForEl(this.$els.html);
        },

        unwrapMarkup() {
            const el = this.$els.html.firstChild;
            const parent = this.$els.html;
            while (el.firstChild) {
                parent.insertBefore(el.firstChild, el);
            }

            parent.removeChild(el);
        }
    },

    ready() {
        this.unwrapMarkup();
        this.removeWhitespace();

        Prism.highlightElement(this.$els.js);
        Prism.highlightElement(this.$els.html);
    }
}
</script>
