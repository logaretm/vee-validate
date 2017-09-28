import Rules from './rules';
import minimal from './index.minimal';

// rules plugin definition.
const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule]);
  });
};

// install the rules via the plugin API.
minimal.use(rulesPlugin);

minimal.Rules = Rules;

export default minimal;
