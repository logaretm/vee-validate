import 'purecss/build/pure.css';
import 'animate.css/animate.css';
import Vue from 'vue';
import Collection from 'collectionsjs';
import VueValidation from './../dist/vue-validation';
import Validator from './../src/validator';
import Examples from './components/examples';
import CodeExample from './components/CodeExample.vue';
import App from './components/App.vue';
import './sass/main.scss';

Vue.use(VueValidation);
Vue.use(Examples);
Vue.component('code-example', CodeExample);

new Vue({
    el: '#app',
    data: {
        rules: new Collection(Object.keys(Validator.create().rules)).chunk(10).all()
    },
    components: {
        App
    }
});
