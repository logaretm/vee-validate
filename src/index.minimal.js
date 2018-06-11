import install from './install';
import directive from './directive';
import mixin from './mixin';
import use from './use';
import Validator from './core/scopedValidator';
import mapFields from './core/mapFields';
import ErrorBag from './core/errorBag';
import { ErrorComponent } from './components';

export default {
  install,
  use,
  directive,
  mixin,
  mapFields,
  Validator,
  ErrorBag,
  ErrorComponent,
  version: '__VERSION__'
};
