import { replaceRaf } from 'raf-stub';
import * as Rules from '@vee-validate/rules';
import { extend, localize } from '@/index';
import en from '@i18n/en';

Object.keys(Rules).forEach(rule => {
  extend(rule, {
    ...Rules[rule]
  });
});

localize('en', en);

replaceRaf();

expect.extend({
  toHaveElement(wrapper, selector) {
    const exists = wrapper.find(selector).exists();

    return {
      pass: exists,
      message: () => `The element ${!this.isNot ? 'does not' : 'does'} exist.`
    };
  }
});
