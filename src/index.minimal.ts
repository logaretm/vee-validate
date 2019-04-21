import VeeValidate from './plugin';
import directive from './directive';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';
import { ValidationState, ValidationAction } from './decorators';

const version = '__VERSION__';
const install = VeeValidate.install;

export {
  MappedValidationState,
  MappedFieldState,
  ValidationObserverInstance,
  ValidationProviderInstance
} from './types';

export {
  install,
  directive,
  Validator,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions,
  ValidationState,
  ValidationAction
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
  mapValidationActions,
  ValidationState,
  ValidationAction
};
