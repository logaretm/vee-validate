import en from '../locale/en';
import { extend } from './extend';
import * as Rules from './rules';
import { Validator } from './core/validator';

const version = '__VERSION__';

const RulesAsList = Object.keys(Rules).map(key => ({ schema: (Rules as any)[key], name: key }));

RulesAsList.forEach(({ name, schema }) => {
  extend(name, schema);
});

// Merge the english messages.
Validator.localize({ en });

export { Validator, Rules, version, extend };
export * from './setters';
export { ValidationProvider, ValidationObserver, withValidation } from './components';
