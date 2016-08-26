import 'purecss/build/pure.css';
import 'prismjs/themes/prism.css';
import 'prismjs/plugins/show-language/prism-show-language.css';
import 'prismjs/plugins/line-numbers/prism-line-numbers.css';
import Vue from 'vue/dist/vue.js';
import moment from 'moment';
import Collection from 'collectionsjs';
import VeeValidate, { Validator } from './../../dist/vee-validate';
import Examples from './components/examples';
import CodeExample from './components/CodeExample.vue';
import CodeBlock from './components/CodeBlock.vue';
import App from './App.vue';
import './sass/main.scss';
import Rules from './../../src/rules';
import date from './../../src/plugins/date';

const dateRules = date.make(moment);
const rules = new Collection(Object.keys(Rules))
                .concat(Object.keys(dateRules))
                .sort()
                .chunk(10)
                .all();

Validator.installDateTimeValidators(moment);
Vue.use(VeeValidate);
Vue.use(Examples);
Vue.component('code-example', CodeExample);
Vue.component('code-block', CodeBlock);

new Vue({
    el: '#app',
    data: {
        rules
    },
    components: {
        App
    }
});
