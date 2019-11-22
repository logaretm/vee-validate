import { getParameters } from 'codesandbox/lib/api/define';

const PACKAGE_JSON = {
  "name": "codesandbox",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "serve": "vue-cli-service serve",
    "build": "vue-cli-service build",
    "lint": "vue-cli-service lint"
  },
  "dependencies": {
    "vee-validate": "^3.1.0",
    "vue": "2.6.10"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "3.6.0",
    "@vue/cli-plugin-eslint": "3.6.0",
    "@vue/cli-service": "3.6.0",
    "babel-eslint": "^10.0.1",
    "eslint": "^5.8.0",
    "eslint-plugin-vue": "^5.0.0",
    "vue-template-compiler": "^2.5.21"
  },
  "eslintConfig": {
    "root": true,
    "env": {
      "node": true
    },
    "extends": [
      "plugin:vue/essential",
      "eslint:recommended"
    ],
    "rules": {},
    "parserOptions": {
      "parser": "babel-eslint"
    }
  },
  "postcss": {
    "plugins": {
      "autoprefixer": {}
    }
  },
  "browserslist": [
    "> 1%",
    "last 2 versions",
    "not ie <= 8"
  ]
};


const SANDBOX_CONFIG_JSON = {
  template: 'vue-cli'
};

export function makeExample (source) {
  return getParameters({
    files: {
      "src/Demo.vue": {
        content: source
      },
      "src/App.vue": {
        content: `<template>
  <Demo />
</template>

<script>
  import Demo from './Demo';

  export default {
    components: {
      Demo
    }
  };
</script>
      `
      },
      "src/main.js": {
        content: `import Vue from "vue";
import { ValidationObserver, ValidationProvider, extend, localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import * as rules from 'vee-validate/dist/rules';
import App from "./App.vue";

// install rules and localization
Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

localize('en', en);

// Install components globally
Vue.component('ValidationObserver', ValidationObserver);
Vue.component('ValidationProvider', ValidationProvider);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
        `
      },
      "package.json": {
        content: PACKAGE_JSON
      },
      "sandbox.config.json": {
        content: JSON.stringify(SANDBOX_CONFIG_JSON, null, 2)
      }
    }
  });
}