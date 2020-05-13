/* eslint-disable @typescript-eslint/ban-ts-ignore */
// @ts-ignore
import { replaceRaf } from 'raf-stub';
import * as Rules from '@vee-validate/rules';
import { extend, localize } from '@vee-validate/core';
// @ts-ignore
import en from '@vee-validate/rules/i18n/en.json';

Object.keys(Rules).forEach(rule => {
  extend(rule, {
    // @ts-ignore
    ...Rules[rule],
  });
});

localize('en', en);

replaceRaf();
