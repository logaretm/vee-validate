import 'purecss/build/pure.css';
import Vue from 'vue';
import VueValidation from './../dist/vue-validation';
import './css/errors.css';

Vue.use(VueValidation);

new Vue({
    el: '#app',

    ready() {
        console.log('Vue Ready'); // eslint-disable-line
    }
});
