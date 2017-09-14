import 'bulma/css/bulma.css';
import 'font-awesome/css/font-awesome.css';
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import hljs from 'highlight.js';
import Components from './components';
import '../stylus/app.styl';

if (! window.fetch) {
  // eslint-disable-next-line
  import('whatwg-fetch');
}

hljs.initHighlightingOnLoad();

Vue.use(VeeValidate);
Vue.use(Components);

new Vue({
  el: '#app',
  data: {
    sidebarToggle: false,
    stars: 0
  },
  created() {
    fetch('https://api.github.com/repos/logaretm/vee-validate').then(response => response.json()).then((body) => {
      this.stars = body.stargazers_count;
    });
  }
});
