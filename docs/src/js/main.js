import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';
import axios from 'axios';
import moment from 'moment';
import VeeValidate, { Validator } from 'vee-validate';
import Components from './components';
import '../stylus/app.styl';

Validator.installDateTimeValidators(moment);
Vue.use(VeeValidate);
Vue.use(Components);

new Vue({
  el: '#app',
  data: {
    sidebarToggle: false,
    stars: 0
  },
  created() {
    axios.get('https://api.github.com/repos/logaretm/vee-validate').then(response => {
      this.stars = response.data.stargazers_count;
    });
  }
});
