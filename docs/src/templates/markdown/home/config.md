Visit the [rules documentation](rules.html#available-rules) to learn more about how to use each rule, and how to [create your own](rules.html#custom-rules).

## [Configuration](#configuration)

You may need to configure some options to tweak some of the plugin internals, this is not required, but could cause conflicts. For example: if you are using a property called `errors` on your vue instance this may cause conflicts. Here is how you would set up the options along with the default values:

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

const config = {
  errorBagName: 'errors', // change if property conflicts.
  fieldsBagName: 'fields', 
  delay: 0, 
  locale: 'en', 
  dictionary: null, 
  strict: true, 
  enableAutoClasses: false, 
  classNames: {
    touched: 'touched', // the control has been blurred
    untouched: 'untouched', // the control hasn't been blurred
    valid: 'valid', // model is valid
    invalid: 'invalid', // model is invalid
    pristine: 'pristine', // control has not been interacted with
    dirty: 'dirty' // control has been interacted with
  }
};

Vue.use(VeeValidate, config);
```

- `errorBagName:` The name of the ErrorBag object that will be injected in each of Vue's instances' data.
- `fieldsBagName:` The name of the FieldBag object that will be injected All Vue instances.
- `delay:` The default debounce time for all inputs (only affects validations).
- `locale:` The default language for the validation messages.
- `dictionary:` A dictionary to be merged with the validators dictionary, check [custom messages](rules.html#custom-messages) and [localization](localization.html) sections.
- `strict:` Fields that have no rules will fail validation unless `strict` is set to false.
- `enableAutoClasses:`Applies automatic classes on inputs or components root elements being validated.
- `classNames:`The classes to be applied depending on the state of the input.