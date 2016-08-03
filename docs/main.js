import 'purecss/build/pure.css';
import 'animate.css/animate.css';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/show-language/prism-show-language.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import Vue from 'vue';
import Collection from 'collectionsjs';
import VueValidation from './../dist/vue-validation';
import Validator from './../src/validator';
import Examples from './components/examples';
import CodeExample from './components/CodeExample.vue';
import CodeBlock from './components/CodeBlock.vue';
import App from './components/App.vue';
import './sass/main.scss';

Vue.use(VueValidation);
Vue.use(Examples);
Vue.component('code-example', CodeExample);
Vue.component('code-block', CodeBlock);

new Vue({
    el: '#app',
    data: {
        rules: new Collection(Object.keys(Validator.create().rules)).chunk(10).all()
    },
    components: {
        App
    }
});
