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
    data: {
        content: 'home'
    },
    computed: {
        heading() {
            if (this.content === 'ex1') {
                return 'Example 1: Basic Validation';
            }

            if (this.content === 'ex2') {
                return 'Example 2: Delaying Validation';
            }

            return 'Vue Validations';
        },
        subtitle() {
            if (this.content === 'ex1') {
                return 'Basic Structure and Setup';
            }

            if (this.content === 'ex2') {
                return 'Debouncing the input validation';
            }

            return 'Easy Laravel-Like API to validate your inputs.';
        }
    },
    components: {
        FirstExample,
        SecondExample
    }
});
