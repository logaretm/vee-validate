import * as Rules from './rules';
import en from '../locale/en';
import minimal from './index.minimal';
import { assign } from './utils';

// rules plugin definition.
const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule].validate, assign({}, Rules[rule].options, { paramNames: Rules[rule].paramNames }));
  });

  // Merge the english messages.
  Validator.localize('en', en);
};

// install the rules via the plugin API.
minimal.use(rulesPlugin);

minimal.Rules = Rules;

export default minimal;
