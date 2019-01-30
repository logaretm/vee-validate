import * as Rules from './rules';
import VeeValidate from './plugin';
import mapFields from './core/mapFields';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
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

VeeValidate.version = '__VERSION__';
VeeValidate.Rules = Rules;
VeeValidate.mapFields = mapFields;
VeeValidate.ValidationProvider = ValidationProvider;
VeeValidate.ValidationObserver = ValidationObserver;
VeeValidate.withValidation = withValidation;

export default VeeValidate;
