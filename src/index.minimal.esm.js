import VeeValidate from './plugin';
import directive from './directive';
import mixin from './mixin';
import Validator from './core/validator';
import ErrorBag from './core/errorBag';
import mapFields from './core/mapFields';
import { ErrorComponent } from './components';

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
  ErrorComponent
};

export default VeeValidate;
