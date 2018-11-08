# Localization

This plugin only comes with English messages to keep things small, but it was built with flexible message generation in mind.
The [English messages file](https://github.com/baianat/vee-validate/blob/master/locale/en.js) is an example on how you would structure those messages. Then, you may want to update the validator dictionary, which should happen once in your app startup. Still, you may update them whenever you want at any point of your app. Check the [dictionary](#using-the-dictionary-api) section below.

## Aliases

Not only can you create and overwrite messages but you can also provide an alias for a field that to be used in the message instead of it's original name. Seeing 'first_name' in your error messages can't be very good for your users experience. There is a couple of solutions.

### Using data-vv-as

You can use the `data-vv-as` attribute on your field, like this:

```html
  <input v-validate="'alpha'" data-vv-as="First Name" name="first_name" type="text">
```

Now when any error message is generated for this input, it will use the `data-vv-as` value instead of the actual field name. While this is very useful for simple setups and displaying localized names, it is only ideal for a single-locale page. For multi-localized pages and more advanced usages you might want to check the dictionary API.

### Using the dictionary API

All validators have access to a simple dictionary that is shared between all of them. This dictionary contains localized error messages and attributes. If the validator finds a localized attribute name for that field, it will be used instead of the field name, pretty much like `data-vv-as` but `data-vv-as` takes priority if both are found.

Here is a little code example on how you would add support for your localized messages and attributes.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';
import messagesAr from './strings/validator/messages/ar.js';
import attributesAr from './strings/validator/attributes/ar.js';
import attributesEn from './strings/validator/attributes/en.js';

// Pass options to make all validators use the arabic language, also merge the english and arabic attributes with the internal dictionary.
Vue.use(VeeValidate, {
  locale: 'ar',
  dictionary: {
    en: { attributes: attributesEn },
    ar: { messages: messagesAr, attributes: attributesAr }
  }
});

new Vue({
  el: '#app',
  data: {
    // Some Data ...
  },
  methods {
    // Cool methods ...
  }
});
```

::: warning
Your localization logic should happen at the entry point of your application as it should be only executed once.
:::

## Localization API

The validator class offers a static `localize` method which is also available on the instances, which have three overloads:

```js
const dictionary = {
  en: {
    // attributes and messages
  },
  ar: {
    // attributes and messages
  }
};

Validator.localize('en'); // changes the locale

// Merges the English dictionary and sets the current locale to English.
Validator.localize('en', dictionary.en);

// Merges all defined languages in the dictionary but does not set the current locale.
Validator.localize(dictionary);
```

All validators' locales are shared. Calling `localize` on any instance available within any component will change the locale for all validators.

```js
// Inside a component.
this.$validator.localize('ar');

import { Validator } from 'vee-validate';

// Also available on the prototype.
Validator.localize('ar');
```

You will get a warning if you set the locale to one that has not been merged in the dictionary yet. Any messages generated will fallback to English.

A working example can be found [here](/examples/locale.md).

## Localized Files

In the [`locale`](https://github.com/baianat/vee-validate/tree/master/locale) directory of this plugin, is a collection of localized files. If you can't find your locale, you could help this plugin by contributing a localized version to the [repository](https://github.com/baianat/vee-validate). It will be happily accepted.

You can import those locales like this:

```js
import ar from 'vee-validate/dist/locale/ar';
import VeeValidate, { Validator } from 'vee-validate';

// Install the Plugin.
Vue.use(VeeValidate);

// Localize takes the locale object as the second argument (optional) and merges it.
Validator.localize('ar', ar);
```

You must note that the locale files exports the following object structure:

```js
export default {
  name: '{locale}',
  messages: {
    // ...
  }
};
```

Also note that if imported via script tags, they will be automatically installed if `VeeValidate` is available globally.

## Async Localization

Loading every locale in your app bundle is not very friendly for your user's bandwidth, especially since only one locale will be used. With a little bit of [Webpack import() magic](https://webpack.js.org/guides/code-splitting/#dynamic-imports) we can get an async localization setup easily:

```js
import Vue from 'vue';
import { Validator } from 'vee-validate';

Vue.mixin({
  localize (localeName) {
    // localize your app here, like i18n plugin.
    // asynchronously load the locale file then localize the validator with it.
    import(`./path/to/vee-validate-locales/${localeName}`).then(locale => {
      Validator.localize(localeName, locale);
    });
  }
});

```

## VueI18n Integration

VeeValidate ships with support for [vue-i18n plugin](https://github.com/kazupon/vue-i18n/) considering it is the most popular among the localization solutions for Vue.js You can integrate vee-validate with VueI18n by passing the i18n instance to vee-validate config:

```js
import VeeValidate from 'vee-validate';
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import validationMessages from 'vee-validate/dist/locale/en';

Vue.use(VueI18n);

const i18n = new VueI18n();

Vue.use(VeeValidate, {
   i18nRootKey: 'validations', // customize the root path for validation messages.
   i18n,
   dictionary: {
    en: validationMessages
   }
});
```

When you pass a dictionary to config it gets merged with your i18n locale messages. After installing the plugin you should only set the locale using the `i18n` instance, meaning:

```js
// fails and will log a warning.
this.$validator.locale = 'ar';

// works and will regenerate the error messages.
this.$i18n.locale = 'ar';
```

::: warning
  You might encounter warnings when using vee-validate with i18n, this happens because vee-validate leaverages the fallback mechanism for the I18n plugin you can safely ignore the warnings. You can instead silence them by setting [i18n's silentTranslationWarn config](https://kazupon.github.io/vue-i18n/api/#silenttranslationwarn).
:::

## Custom i18n Driver

You might have a different i18n system for your app, vee-validate internally uses drivers to generate its messages. To avoid having to maintain two different localization drivers you can easily integrate your custom driver into vee-validate.

You will need to create an object that implements the [IDictionary interface](https://github.com/baianat/vee-validate/blob/master/flow/dictionary.js#L12). And after installing the plugin you can apply the new driver to vee-validate.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);

const dictionary = {
  // your implementation.
};

VeeValidate.setI18nDriver('custom', dictionary);
```

Checkout this example on codesandbox.io that partially implements a [LingUI](https://github.com/lingui/js-lingui) driver.

[![Edit VeeValidate - LingUI](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/q84p09y7p6)
