import 'purecss/build/pure.css';
import Vue from 'vue';
import VueValidation from './../dist/vue-validation';
import './css/errors.css';
import CodeExample from './components/CodeExample.vue';
import FirstExample from './examples/Example-1.vue';

Vue.component('code-example', CodeExample);
Vue.use(VueValidation);

new Vue({
    el: '#app',
    components: {
        FirstExample
    }
});
