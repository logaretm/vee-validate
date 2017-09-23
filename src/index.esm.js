import install from './install';
import use from './use';
import Rules from './rules';
import mapFields from './core/helpers';
import Validator from './core/validator';
import ErrorBag from './core/errorBag';

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
  Rules,
  version
};

export default {
  install,
  use,
  mapFields,
  Validator,
  ErrorBag,
  Rules,
  version
};
