import Validator from './validator';
import install from './install';
import Rules from './rules';
import use from './use';
import ErrorBag from './errorBag';
import mapFields from './helpers';

const version = '__VERSION__';

const rulesPlugin = ({ Validator }) => {
  Object.keys(Rules).forEach(rule => {
    Validator.extend(rule, Rules[rule]);
  });
};

use(rulesPlugin);

export {
  install,
  use,
  mapFields,
  Validator,
  ErrorBag,
  version
};

export default {
  install,
  use,
  mapFields,
  Validator,
  ErrorBag,
  version
};
