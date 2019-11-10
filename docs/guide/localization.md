# Localization

VeeValidate has built-in localization support for validation messages which is opt-in and is not configured by default.

:::warning
In `2.x`, vee-validate used to ship with localization enabled and pre-configured, this has been changed in `3.x` to allow for a more flexible i18n system.
:::

## Using the default i18n

vee-validate ships with a tiny i18n dictionary for basic i18n needs.

### Adding messages

The default language for vee-validate is `en` and you can add messages like this:

```js
import { localize } from 'vee-validate';

localize({
  en: {
    messages: {
      required: 'this field is required',
      min: 'this field must have no less than {length} characters'
    }
  }
});
```

Where messages is an object whose keys are the rule name and the value is a string or a template string or a message generator function. Which is shown in the sample.

### Installing locales

vee-validate has over 40+ locales available for the shipped validations, but they are not installed by default as they have a large overhead so you need to import the locales you need. The exposed `localize` helper allows you to add new locales to your validation messages:

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

:::tip TypeScript and JSON

By default you cannot import JSON files in TypeScript, so be sure to add those options to the `compilerOptions`:

```json
{
  "compilerOptions": {
    // ...
    "resolveJsonModule": true,
    "esModuleInterop": true
    // ...
  }
}
```

And then you should be able to import localization files in your TypeScript projects.

:::

### Setting the locale

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

### Localized field names

Instead of having to provide a field name for each locale in your template, you can use it as an id instead and have vee-validate handle the message generation for you. The field id will be swapped for the field name provided in the dictionary.

To do that, add `names` property to your locale's object:

```js
import { localize } from 'vee-validate';

localize({
  en: {
    names: {
      email: "E-mail Address",
      password: "Password"
    }
  },
  ar: {
    names: {
      email: "البريد الاليكتروني",
      password: "كلمة السر"
    }
  }
});
```

This will allow you to use `email` and `password` names for your inputs and vee-validate will swap it with the localized one.

### Custom messages per field

You can provide a custom message for each rule for a specific field by adding a `fields` property to your locale's object:

```js
import { localize } from 'vee-validate';

localize({
  en: {
    messages: {
      // generic rule messages...
    },
    fields: {
      password: {
        required: 'Password cannot be empty!',
        max: 'Are you really going to remember that?',
        min: 'Too few, you want to get doxed?'
      }
    }
  }
});
```

### Demo

This is a demo showcasing the previous features

<iframe
  src="https://codesandbox.io/embed/veevalidate-30-basic-i18n-bszvu?fontsize=14"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="VeeValidate 3.0 - Basic i18n"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

### Lazily importing locales

If you have multiple locales in your app, loading all the validation messages for those locales is not optimal. We can load a locale at time with dynamic `import()` that you can use if you are using a bundler like **webpack**.

```js
import { localize } from 'vee-validate';

function loadLocale(code) {
  return import(`vee-validate/dist/locale/${code}.json`).then(locale => {
    localize(code, locale);
  });
}
```

## Using other i18n libraries

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
  defaultMessage: (_, values) => i18n.t(`validations.${values._rule_}`, values)
});
```

## vue-i18n

This is an example showcasing the vue-i18n integration:

<iframe
  src="https://codesandbox.io/embed/veevalidate-30-vuei18n-integration-9vs4l?fontsize=14"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="VeeValidate 3.0 - VueI18n Integration"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>

## 3rd Party Integration Example - LingUI

The i18n in vee-validate is library-agnostic, you can even implement one from other ecosystems like LingUI and it would work just as fine.

<iframe
  src="https://codesandbox.io/embed/veevalidate-30-lingui-integration-uc2ug?fontsize=14"
  style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
  title="VeeValidate 3.0 - Lingui Integration"
  allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media; usb"
  sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"
></iframe>
