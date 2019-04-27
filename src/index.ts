import VeeValidate from './plugin';
import directive from './directive';
import en from '../locale/en';
import * as Rules from './rules';
import Validator from './core/validator';
import { mapValidationState } from './mapValidationState';
import { mapValidationActions } from './mapValidationActions';
import { ValidationProvider, ValidationObserver, withValidation } from './components';
import { ValidationState, ValidationAction } from './decorators';

const version = '__VERSION__';

const RulesAsList = Object.keys(Rules).map(key => ({ schema: (Rules as any)[key], name: key }));

RulesAsList.forEach(({ name, schema }) => {
  Validator.extend(name, schema);
});

// Merge the english messages.
Validator.localize({ en });

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
  Rules,
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
  Rules,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation,
  mapValidationState,
  mapValidationActions,
  ValidationState,
  ValidationAction
};
