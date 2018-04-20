# Localization

This plugin only comes with English messages to keep things small, but it was built with flexible message generation in mind.
The [English messages file](https://github.com/baianat/vee-validate/blob/master/dist/locale/en.js) is an example on how you would structure those messages. Then you may want to update the validator dictionary, which should happen once in your app startup. Still, you may update them whenever you want at any point of your app, check the [dictionary](#attributes-dictionary) description below.

> The messages shown in the provided locale files contain mostly functions. However, your messages can also be strings depending on your needs, the included locales make use of field names and parameters provided, so they had to be functions.

## [Attributes (data-vv-as)](#attributes-data-vv-as)

Seeing 'first_name' in your error messages can't be very good for your user experience, this plugin offers a couple of solutions: You can use the `data-vv-as` attribute on your field and give it a better name for your users, it would look like this:

```html
  <input v-validate data-vv-rules="alpha|min:3" data-vv-as="First Name" name="first_name" type="text">
```

Now when any error message is generated for this input, it will use the `data-vv-as` value instead of the actual field name. This is also the same for binding expressions. While this is very useful for simple setups and displaying localized names, it is only ideal for a single-locale page. For multi-localized pages and more advanced usages you might want to check the approach below.

## [Attributes (Dictionary)](#attributes-dictionary)

All validators have access to a simple dictionary that is shared between all of them, this dictionary contains localized error messages and attributes. If the validator finds a localized attribute name for that field, it will be used instead of the field name. Pretty much like `data-vv-as` but `data-vv-as` takes priority if both are found.

Here is a little code example on how you would add support for your localized messages and attributes. Note that this is the entry point of your application.

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

## [Localization API](#api)

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

All validators' locales are shared, calling `localize` on any instance available within any component will change the locale for all validators.

```js
// Inside a component.
this.$validator.localize('ar');

import { Validator } from 'vee-validate';

// Also available on the prototype.
Validator.localize('ar');
```

You will get a warning if you set the locale to one that has not been merged in the dictionary yet, any messages generated will fallback to English.

A working example can be found [here](examples#locale-example)

## [Localized Files](#localized-files)

In the [`locale`](https://github.com/logaretm/vee-validate/tree/master/locale) directory of this plugin, is a collection of localized files. If you can't find your locale, you could help this plugin by contributing a localized version to the [repository](https://github.com/logaretm/vee-validate). It will be happily accepted.

You can import those locales like this:

```js
import ar from 'vee-validate/dist/locale/ar';
import VeeValidate, { Validator } from 'vee-validate';

// Localize takes the locale object as the second argument (optional) and merges it.
Validator.localize('ar', ar);

// Install the Plugin.
Vue.use(VeeValidate);
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

## [Custom Attributes](#custom-attributes)

Like the custom messages, the validators share a dictionary containing the attribute names, for example if you want to use "Email Address" instead of "email" in your error messages, this can be easily achieved by including an `attributes` object in the dictionary.

Unlike messages, no attributes are included in the default dictionary.

```js
import { Validator } from 'vee-validate';
const dictionary = {
  en: {
    attributes: {
      email: 'Email Address'
    }
  },
  ar: {
    attributes: {
      email: 'البريد الاليكتروني'
    }
  }
};

Validator.localize(dictionary);
```

 > If the attribute is not found for the current locale, it will fallback to the binding expression or the field name. If you use the [data-vv-as](localization.html#attributes-data-vv-as) attribute, it will take precedence over the internal dictionary.

## [Field-specific Custom Messages](#field-sepecific-messages)

 You might need to provide different messages for different fields, for example you might want to display an error message for the email field when it's required, but a different messsage when the name is required. This allows you to give your users a flexible experience and context aware messages.

 To do this you would need to add an object to the dictionary called `custom` like this:

```js
const dict = {
  custom: {
    email: {
      required: 'Your email is empty' // messages can be strings as well.
    },
    name: {
      required: () => 'Your name is empty'
    }
  }
};
```

> Notice that the `custom` object contains properties that represent the field names, those field names objects contain properties that represent the validation rule that its value will be used instead of the default one.

Then you would need to add the dictionary we just constructed to the current validators dictionary like this:

```js
Validator.localize('en', dict);
// or use the instance method
this.$validator.localize('en', dict);
```

That's it. One thing to keep in mind is to place any dictionary related operations in your code before it actually needs it to avoid uneccessary merges. For example, a good common place is in your app entry point or setup script, conversly, a poor choice would be a component lifecycle hook like `mounted` since the validator dictionary is kept globally for all instances.

By default, any unspecified rules for the specific field messages will fallback to the already included ones, so you only need to define the custom messages you only need.

## Custom Messages

You might need to overwrite the error messages, or add new ones. The Validator class and its instances provide a `localize` method, which will merge the messages with the internal dictionary, overwriting any duplicates.

::: tip
  Any merges will have an effect on all validator instances as the messages dictionary is shared.
:::

```js
import { Validator } from 'vee-validate';
const dictionary = {
  en: {
    messages:{
      alpha: () => 'Some English Message'
    }
  },
  ar: {
    messages: {
      alpha: () => 'Some Arabic Message'
    }
  }
};

// Override and merge the dictionaries
Validator.localize(dictionary);

const validator = new Validator({ first_name: 'alpha' });

validator.localize('ar'); // now this validator will generate messages in Arabic.
```

::: tip
  You must provide the messages in an object path like: `dictionary.locale.messages`.
:::

Usually, you would structure your language files for your app rather than adding hardcoded strings like the example above, check the [localization guide](localization.md) for more info.
