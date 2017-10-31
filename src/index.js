//baianat//
import Rules from './rules';
import { messages } from '../locale/en';
import minimal from './index.minimal';

// rules plugin definition.
const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule]);
  });

 
  Validator.localize('en', {
    messages
  });
};

// install the rules via plugin API.
minimal.use(rulesPlugin);

minimal.Rules = Rules;

export default minimal;
