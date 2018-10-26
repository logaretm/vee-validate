import VeeValidate from './plugin';
import directive from './directive';
import mixin from './mixin';
import Validator from './core/validator';
import ErrorBag from './core/errorBag';
import mapFields from './core/mapFields';
import { ValidationProvider } from './components';

const version = '__VERSION__';
const install = VeeValidate.install;
const use = VeeValidate.use;

export {
  install,
  use,
  directive,
  mixin,
  mapFields,
  Validator,
  ErrorBag,
  version,
  ValidationProvider
};

export default VeeValidate;
