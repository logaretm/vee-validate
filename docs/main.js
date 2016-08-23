import 'purecss/build/pure.css';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/show-language/prism-show-language.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import Vue from 'vue';
import Collection from 'collectionsjs';
import VeeValidate from './../dist/vee-validate';
import Examples from './components/examples';
import CodeExample from './components/CodeExample.vue';
import CodeBlock from './components/CodeBlock.vue';
import App from './App.vue';
import './sass/main.scss';
import Rules from './../src/rules';

Vue.use(VeeValidate);
Vue.use(Examples);
Vue.component('code-example', CodeExample);
Vue.component('code-block', CodeBlock);

new Vue({
    el: '#app',
    data: {
        rules: new Collection(Object.keys(Rules)).sort().chunk(10).all()
    },
    render: h => h(App)
});
