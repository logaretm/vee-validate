import VeeValidate from './plugin';
import directive from './directive';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';

const version = '__VERSION__';
const install = VeeValidate.install;

export {
  install,
  directive,
  Validator,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions
};

export default {
  ...VeeValidate,
  directive,
  Validator,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions
};
