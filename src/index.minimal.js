import VeeValidate from './plugin';
import directive from './directive';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';

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
  mapValidationState,
  mapValidationActions
};

VeeValidate.version = version;
VeeValidate.ValidationProvider = ValidationProvider;
VeeValidate.ValidationObserver = ValidationObserver;
VeeValidate.withValidation = withValidation;
VeeValidate.mapValidationState = mapValidationState;
VeeValidate.mapValidationActions = mapValidationActions;

export default VeeValidate;
