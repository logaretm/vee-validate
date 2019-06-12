import en from '../locale/en';
import { extend } from './extend';
import * as Rules from './rules';
import { Validator } from './core/validator';
import { Dictionary } from './dictionary';

const version = '__VERSION__';
const dictionary = new Dictionary('en', { en });
const RulesAsList = Object.keys(Rules).map(key => ({ schema: (Rules as any)[key], name: key }));
RulesAsList.forEach(({ name, schema }) => {
  extend(name, {
    ...schema,
    message: (field, params, data) => {
      return dictionary.resolve(field, name, [field, params, data]);
    }
  });
});

// Merge the english messages.
export { Validator, Rules, version, extend, dictionary };
export * from './setters';
export { ValidationProvider, ValidationObserver, withValidation } from './components';
