import * as Rules from './rules';
import VeeValidate from './plugin';
import { assign } from './utils';
import en from '../locale/en';

// rules plugin definition.
const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }));
  });

  // Merge the english messages.
  Validator.localize('en', en);
};

VeeValidate.use(rulesPlugin);
VeeValidate.Rules = Rules;

export default VeeValidate;
