import VeeValidate from './plugin';
import en from '../locale/en';
import * as Rules from './rules';
import Validator from './core/validator';
import { ValidationProvider, ValidationObserver, withValidation } from './components';

const version = '__VERSION__';

const RulesAsList = Object.keys(Rules).map(key => ({ schema: (Rules as any)[key], name: key }));

RulesAsList.forEach(({ name, schema }) => {
  Validator.extend(name, schema);
});

// Merge the english messages.
Validator.localize({ en });

const install = VeeValidate.install;

export { ValidationObserverInstance, ValidationProviderInstance } from './types';

export { install, Validator, Rules, version, ValidationProvider, ValidationObserver, withValidation };

export default {
  ...VeeValidate,
  Validator,
  Rules,
  version,
  ValidationProvider,
  ValidationObserver,
  withValidation
};
