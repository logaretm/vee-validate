import VeeValidate from './plugin';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';

const version = '__VERSION__';
const install = VeeValidate.install;

export { ValidationObserverInstance, ValidationProviderInstance } from './types';
export { install, Validator, version, ValidationProvider, ValidationObserver, withValidation };

export default {
  ...VeeValidate,
  Validator,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation
};
