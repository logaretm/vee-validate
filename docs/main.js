import 'purecss/build/pure.css';
import Vue from 'vue';
import VueValidation from './../dist/vue-validation';
import './css/main.css';
import CodeExample from './components/CodeExample.vue';
import FirstExample from './examples/Example-1.vue';
import SecondExample from './examples/Example-2.vue';

Vue.use(VueValidation);
Vue.component('code-example', CodeExample);

new Vue({
    el: '#app',
    components: {
        FirstExample,
        SecondExample
    }
});
