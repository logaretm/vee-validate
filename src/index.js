import * as Rules from './rules';
import VeeValidate from './plugin';
import { assign } from './utils';
import en from '../locale/en';

// rules plugin definition.

Object.keys(Rules).forEach(rule => {
  VeeValidate.Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }));
});

// Merge the english messages.
VeeValidate.Validator.localize({
  en
});

VeeValidate.Rules = Rules;

export default VeeValidate;
