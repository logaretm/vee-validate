/**
 * Augment the typings of Vue.js
 */

import Vue = require("vue");
import { Validator } from './vee-validate.d';

declare module "vue/types/vue" {
  interface Vue {
    $validator: Validator;
  }
}