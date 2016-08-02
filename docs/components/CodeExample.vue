<template>
    <div class="pure-g">
        <div class="pure-u-1">
            <div class="pure-menu pure-menu-horizontal flex-center">
                <ul class="pure-menu-list">
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'demo'}">
                        <a @click="content = 'demo'" class="pure-menu-link">
                            <i class="demo-icon icon-play-outline"></i>
                            Demo
                        </a>
                    </li>
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'html' }">
                        <a @click="content = 'html'" class="pure-menu-link">
                            <i class="demo-icon icon-html"></i>
                            HTML
                        </a>
                    </li>
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'js' }">
                        <a @click="content = 'js'" class="pure-menu-link">
                            <i class="demo-icon icon-icon-code"></i>
                            JavaScript
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="content === 'demo'" v-el="example" class="pure-u-1">
            <slot name="example"></slot>
        </div>
        <div v-show="content === 'html'" class="pure-u-1">
            <pre><code v-el:html class="language-html"><slot name="code-html"></slot></code></pre>
        </div>
        <div v-show="content === 'js'" class="pure-u-1">
            <pre><code v-el:js class="language-javascript"><slot name="code-js"></slot></code></pre>
        </div>
    </div>
</template>

<script>
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/show-language/prism-show-language.css'
import 'prismjs/plugins/show-language/prism-show-language.js'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers.js'


export default {
    data() {
        return {
            content: 'demo'
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

<style lang="sass">
    div.prism-show-language > div.prism-show-language-label {
        top: 8px !important;
    }
</style>
