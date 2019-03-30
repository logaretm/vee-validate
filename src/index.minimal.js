import VeeValidate from './plugin';
import directive from './directive';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import { mapValidationState } from './mapValidationState';

const version = '__VERSION__';
const install = VeeValidate.install;
const use = VeeValidate.use;

export {
  install,
  use,
  directive,
  Validator,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState
};

VeeValidate.version = version;
VeeValidate.ValidationProvider = ValidationProvider;
VeeValidate.ValidationObserver = ValidationObserver;
VeeValidate.withValidation = withValidation;
VeeValidate.mapValidationState = mapValidationState;

export default VeeValidate;
