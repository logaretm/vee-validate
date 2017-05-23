<template>
    <div class="columns is-multiline code-example">
        <div class="column is-12">
            <div class="tabs is-left">
                <ul>
                    <li :class="{ 'is-active': content === 'demo'}">
                        <a @click="content = 'demo'" class="pure-menu-link">
                            <span class="icon is-small"><i class="fa fa-play"></i></span>
                            Demo
                        </a>
                    </li>
                    <li :class="{ 'is-active': content === 'html' }">
                        <a @click="content = 'html'" class="pure-menu-link">
                            <span class="icon is-small"><i class="fa fa-html5"></i></span>
                            HTML
                        </a>
                    </li>
                    <li :class="{ 'is-active': content === 'js' }">
                        <a @click="content = 'js'" class="pure-menu-link">
                            <span class="icon is-small"><i class="fa fa-code"></i></span>
                            JavaScript
                        </a>
                    </li>
              </ul>
            </div>
        </div>
        <div v-show="content === 'demo'" class="column is-12">
            <slot name="example"></slot>
        </div>
        <div v-show="content === 'html'" class="column is-12">
            <code-block ref="htmlCode" class="language-html"><slot name="html"></slot></code-block>
        </div>
        <div v-show="content === 'js'" class="column is-12">
            <code-block ref="jsCode" class="language-javascript"><slot name="js"></slot></code-block>
        </div>
    </div>
</template>

<script>

export default {
  name: 'code-example',
  data: () => ({
    content: 'demo'
  })
};
</script>
