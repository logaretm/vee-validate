<template>
    <div class="pure-g">
        <div class="pure-u-1">
            <div class="pure-menu pure-menu-horizontal">
                <ul class="pure-menu-list">
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'demo'}">
                        <a @click="content = 'demo'" class="pure-menu-link">
                            <i class="icon-play"></i>
                            Demo
                        </a>
                    </li>
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'html' }">
                        <a @click="content = 'html'" class="pure-menu-link">
                            <i class="icon-html5"></i>
                            HTML
                        </a>
                    </li>
                    <li :class="{'pure-menu-item': true, 'pure-menu-selected': content === 'js' }">
                        <a @click="content = 'js'" class="pure-menu-link">
                            <i class="icon-code"></i>
                            JavaScript
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div v-show="content === 'demo'" class="pure-u-1">
            <slot name="example"></slot>
        </div>
        <div v-show="content === 'html'" class="pure-u-1">
            <code-block class="language-html"><slot name="code-html"></slot></code-block>
        </div>
        <div v-show="content === 'js'" class="pure-u-1">
            <code-block class="language-javascript"><slot name="code-js"></slot></code-block>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            content: 'demo'
        }
    }
}
</script>

<style lang="sass">
    div.prism-show-language > div.prism-show-language-label {
        top: 8px !important;
    }
</style>
