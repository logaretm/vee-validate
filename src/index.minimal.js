import install from './install';
import use from './use';
import Validator from './core/validator';
import mapFields from './core/helpers';
import ErrorBag from './core/errorBag';

export default {
  install,
  use,
  mapFields,
  Validator,
  ErrorBag,
  version: '__VERSION__'
};
