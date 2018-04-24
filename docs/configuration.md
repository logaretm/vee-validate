# Configuration

## Installation Config

You may need to configure some options to tweak some of the plugin internals. This is not required, but could cause conflicts. For example, using a property called `errors` on your vue instance may cause conflicts. Here is how you would set up the options, along with the default values:

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

const config = {
  aria: true,
  classNames: {},
  classes: false,
  delay: 0,
  dictionary: null,
  errorBagName: 'errors', // change if property conflicts
  events: 'input|blur',
  fieldsBagName: 'fields',
  i18n: null, // the vue-i18n plugin instance
  i18nRootKey: 'validations' // the nested key under which the validation messsages will be located
  inject: true,
  locale: 'en',
  strict: true,
  validity: false,
};

Vue.use(VeeValidate, config);
```

|Property       | Type      | Default   | Description  |
|:--------------|:---------:|:---------:|:---------|
| aria          | `boolean` | `true`    | Allows setting `aria-invalid` and `aria-required` attributes on HTML inputs. |
| classNames    | `object`  |           | The classes to be applied depending on the state of the input. |
| classes       | `boolean` | `false`   | Applies automatic classes on HTML inputs being validated. |
| delay         | `number`  | `0`       | The default debounce time for all inputs (only affects validations). |
| dictionary    | `object|null` |      `null`    | A dictionary to be merged with the internal dictionary. (Check the [custom messages](customization.md) and [localization](localization.md) sections.)      |
| errorBagName  | `string`  | `'errors'` | The name of the `ErrorBag` object that will be injected in each of Vue's instances' data. Used to avoid conflicts with other plugins. |
| events        | `string` | `'input|blur'` | Pipe separated list of the default event names that will be listened to, to trigger validation. If an empty string is provided, it will disable all listeners. |
| fieldsBagName | `string` |  `'fields'` | The name of the Fields (flags) object that will be injected in each of Vue's instances' data. |
| i18n          | `VueI18n | null` | `null` | The `vue-i18n` instance, if provided will integrate vee-validate with the i18n plugin and will use it to produce the error messages instead of the built in dictionary. |
| i18nRootKey   | `string` | `'validations'` | The key name of the validation messages for each locale. |
| inject        | `boolean` | `true` | Specifies if a validator instance should be injected automatically for all components. (See [Component Injections](advanced.md#injections) for more information.) |
| locale        | `string` | `'en'` | The default language for the validation messages. |
| strict        | `boolean` | `true`    | Validation attempt on non-existant fields will result in an invalid state |
| validity      | `boolean` | `false` | Set custom validity [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) on native HTML inputs. |
