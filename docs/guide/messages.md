# Error Messages

VeeValidate comes with generic error messages, which can be overwritten or assign specific messages for specific fields.

## Message Generators

Messages live inside the internal dictionary. They can be either strings or functions that return a string called _generators_. Those generators have the following signature:

```ts
function rule (fieldName: string, params: any[], data?: any): string {
  return `Some error message for the ${fieldName} field.`;
}
```

It receives the field name or an alias for it as the first parameter, as well as the params used to validate the field. The third optional parameter is any additional data returned by the validation rule which can [provide more info](./custom-rules.html#reasoning) for the generator to make it more flexible.

## Overwriting Messages

The Validator class and it's instances provide a `localize` method, which will merge the provided messages with the internal dictionary, overwriting any duplicates.

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
      alpha: 'حاجة عربي'
    }
  }
};

// Override and merge the dictionaries
Validator.localize(dictionary);

const validator = new Validator({ first_name: 'alpha' });

validator.localize('ar'); // now this validator will generate messages in Arabic.
```

::: warning
  You must provide the messages in an object path like: `dictionary.locale.messages`.
:::

Usually, you would structure your language files for your app rather than adding hardcoded strings like the example above. Check the [localization guide](./localization.md) for more info. By default, any unspecified rules for the specific field messages will fallback to the already included ones, so you only need to define the custom messages you only need.

## Field Names

Like the custom messages, the validators share a dictionary containing the attribute names. For example, if you want to use _"Email Address"_ instead of _"email"_ in your error messages, this can be easily achieved by including an `attributes` object in the dictionary.

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

::: tip
If the attribute is not found for the current locale, it will fallback to the binding expression or the field name. If you use the [data-vv-as](./localization.md#using-data-vv-as) attribute, it will take precedence over the internal dictionary.
:::

## Field-specific Custom Messages

 You might need to provide different messages for different fields. For example, you might want to display an error message for the email field when it's required, but a different message when the name is required. This allows you to give your users a flexible experience and context aware messages.

 To do this you would need to add an object to the dictionary called `custom` like this:

```js
const dict = {
  custom: {
    email: {
      required: 'Your email is empty'
    },
    name: {
      required: () => 'Your name is empty'
    }
  }
};

Validator.localize('en', dict);
// or use the instance method
this.$validator.localize('en', dict);
```

::: tip
  One thing to keep in mind is to place any dictionary related operations in your code before it actually needs it to avoid unnecessary merges. For example, a good common place is in your app entry point or setup script. Conversely, a poor choice would be a child component lifecycle hook like `mounted` since the validator dictionary is kept globally for all instances.
:::
