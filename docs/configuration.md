# Configuration

## Config

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
  i18nRootKey: 'validations', // the nested key under which the validation messages will be located
  inject: true,
  locale: 'en',
  validity: false,
  useConstraintAttrs: true
};

Vue.use(VeeValidate, config);
```

|Property       | Type      | Default   | Description  |
|:--------------|:---------:|:---------:|:---------|
| aria          | `boolean` | `true`    | Allows setting `aria-invalid` and `aria-required` attributes on HTML inputs. |
| classNames    | `object`  |           | The classes to be applied depending on the state of the input. |
| classes       | `boolean` | `false`   | Applies automatic classes on HTML inputs being validated. |
| delay         | `number`  | `0`       | The default debounce time for all inputs (only affects validations). |
| dictionary    | `object|null` |      `null`    | A dictionary to be merged with the internal dictionary. (Check the [Error Messages](guide/messages.md) and [Localization](guide/localization.md) sections.)      |
| errorBagName  | `string`  | `'errors'` | The name of the `ErrorBag` object that will be injected in each of Vue's instances' data. Used to avoid conflicts with other plugins. |
| events        | `string` | `'input'` | Pipe separated list of the default event names that will be listened to, to trigger validation. If an empty string is provided, it will disable all listeners. |
| fieldsBagName | `string` |  `'fields'` | The name of the Fields (flags) object that will be injected in each of Vue's instances' data. |
| fastExit      | `boolean`|  `true`     | Whether the validation should stop after the first failure for each field, you can opt in or out from either settings by using the [continues](/api/directive.md#continues) and the [bails](/api/directive.md#bails) modifiers. |
| i18n          | `VueI18n | null` | `null` | The `vue-i18n` instance, if provided will integrate vee-validate with the i18n plugin and will use it to produce the error messages instead of the built in dictionary. [More about that here](/guide/localization.md#vuei18n-integration). |
| i18nRootKey   | `string` | `'validations'` | The key name of the validation messages for each locale. |
| inject        | `boolean` | `true` | Specifies if a validator instance should be injected automatically for all components. (See [Component Injections](/concepts/injections.md) for more information.) |
| locale        | `string` | `'en'` | The default language for the validation messages. |
| validity      | `boolean` | `false` | Set custom validity [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) on native HTML inputs. |
| useConstraintAttrs | `boolean` | true | Enables [rule inference](/guide/inferred-rules.md) on native HTML inputs. |

## Installation

### Vue Plugin API

You can install vee-validate using Vue's plugin API.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, config);
```

### Manual Installation

You might be interested in using VeeValidate exposed components as you see fit without having to install the plugin, you can do this by creating an instance of the VeeValidate plugin.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

const vee = new VeeValidate(config, Vue);
```

Using this method __will not__ add any directives, mixins, or components to your app, instead it passes everything vee-validate needs to set itself up and you will be responsible for using the plugin manually which is helpful if you are only planning to use standalone features like the [Validator.verify API](/api/validator.md#verify).

### Runtime Configuration

You also could modify the plugin config after installation by importing the default module and using the `configure` method:

```js
import VeeValidate from 'vee-validate';

VeeValidate.configure({
  // config properties
});
```
