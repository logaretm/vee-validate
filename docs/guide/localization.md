# Localization

VeeValidate has built-in localization support for validation messages which is opt-in and is not configured by default.

:::warning
In `2.x`, vee-validate used to ship with localization enabled and pre-configured, this has been changed in `3.x` to allow for a more flexible i18n system.
:::

## Messages Format

Validation messages in vee-validate can either be a `string` or a function that returns a string for more complex messages.

### String Interpolation

String messages can be plain like:

```
This field is required.
```

Or it can be a **template string** like this:

```
The {_field_} is required.
```

Template messages are interpolated before display to replace the placeholders, placeholders are surrounded by `{placeholder}`. You can use the rule's parameter names as placeholders as well as props you return in `data` prop in the validation response.

For example consider this rule:

```js
import { extend } from 'vee-validate';

extend('lengthBetween', {
  validate: (value, { min, max }) => {
    const length = value && value.length;

    return length >= min && length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} length must be between {min} and {max}'
});
```

```vue
<ValidationProvider name="code" rules="required|lengthBetween:3,6" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

<StyledProvider
  name="code"
  rules="required|lengthBetween:3,6"
  v-slot="{ errors }"
>
  <input v-model="values.template" type="text" placeholder="Type something...">
  <span>{{ errors[0] }}</span>
</StyledProvider>

:::tip Parameter Names
You can use any names for your placeholders, except for:

- `{_field_}` which is the field name.
- `{_value_}` which is the field value.
- `{_rule_}` which is the rule name.

Which are provided internally.
:::

### Message Function

Messages can be a function as well, giving you more flexibility over your messages. The function signature looks like this:

```ts
interface ValidationMessageGenerator {
  (field: string, values?: Record<string, any>): string;
}
```

The `field` is the field name, the `values` argument is an object containing the placeholder values used in string interpolation. Meaning it will contain `_value_`, `_field_` and `_rule_` values as well as any other params previously declared.

## i18n

vee-validate has over 40+ locales available for the shipped validations, but they are not install by default as they have a large overhead so you need to import the locales you need.

### Using the default i18n

vee-validate ships with a tiny i18n dictionary for basic i18n needs.

#### Installing locales

The exposed `localize` helper allows you to add new locales to your validation messages:

```js
import { localize } from 'vee-validate';
import en from 'vee-validate/dist/locale/en.json';
import ar from 'vee-validate/dist/locale/ar.json';

// Install English and Arabic locales.
localize({
  en,
  ar
});
```

This will make all your previously installed messages use the new messages added by those locales.

#### Setting the locale

To set the locale you pass the locale key/code to the `localize` method:

```js
import { localize } from 'vee-validate';

// Activate the Arabic locale.
localize('ar');
```

You can also activate and add new messages at the same time:

```js
import { localize } from 'vee-validate';
import ar from 'vee-validate/dist/locale/ar.json';

// Install and Activate the Arabic locale.
localize('ar', ar);
```

#### Lazily importing locales

If you have multiple locales in your app, loading all the validation messages for those locales is not optimal. We can load a locale at time with dynamic `import()` that you can use if you are using a bundler like **webpack**.

```js
import { localize } from 'vee-validate';

function loadLocale(code) {
  return import(`vee-validate/dist/locale/${code}.json`).then(locale => {
    localize(code, locale);
  });
}
```

### Using other i18n libraries

You don't have to use the `localize` helper with `vee-validate`, if you don't it will not be included in your final bundle. It is optional for those who don't use Vue-SSR framework/solution like Nuxt.

Other plugins dedicated for localization would be much better to use than the built in one, you can use them by using a function for the message instead of a string.

For example we can use `vue-i18n` with vee-validate like this:

```js{19}
import VueI18n from 'vue-i18n';
import { extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';
import validationMessages from 'vee-validate/dist/locale/en';

// Since vee-validate default messages are
// compatible with I18n format
// we can merge them if needed.
const i18n = new VueI18n({
  locale: 'en',
  en: {
    validations: validationMessages
  }
});

extend('required', {
  ...required,
  // the values param is the placeholders values
  message: (_, values) => i18n.$t('validations.required', values)
});
```

However this will be annoying for each rule, you could take advantage of `defaultMessage` config:

```js
import { configure } from 'vee-validate';

configure({
  // this will be used to generate messages.
  defaultMessage: (_, values) => i18n.t(`validation.${values._rule_}`, values)
});
```

Check out the [live samples](../examples/i18n.md).

<script>
export default {
  data: () => ({ values: {} }),
  mounted () {
    this.extendRule('lengthBetween', {
      validate: (value, { min, max }) => {
        const length = value && value.length;

        return length >= min && length <= max;
      },
      params: [
        { name: 'min' },
        { name: 'max' }
      ],
      message: 'The {_field_} length must be between {min} and {max}. You wrote "{_value_}".',
    });
  }
};
</script>
