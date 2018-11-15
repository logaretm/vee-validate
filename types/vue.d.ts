/**
 * Augment the typings of Vue.js
 */

import Vue, { ComponentOptions } from 'vue';
import { ErrorBag, FieldFlagsBag, Validator, VeeValidateComponentOptions } from './vee-validate.d';

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    $_veeValidate?: VeeValidateComponentOptions;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    /**
     * A `Validator` instance, injected via a mixin by VeeValidate.
     *
     * Note that this property is not available in the component if you are using `inject: false`.
     */
    $validator: Validator;
    /**
     * An `ErrorBag` instance, injected via a mixin by VeeValidate.
     *
     * Note that this property is not available in the component if you are using `inject: false`.
     */
    errors: ErrorBag;
    /**
     * An object containing state flags for the validated fields, injected via a mixin by VeeValidate.
     *
     * Note that this property is not available in the component if you are using `inject: false`.
     */
    fields: FieldFlagsBag;
  }
}
