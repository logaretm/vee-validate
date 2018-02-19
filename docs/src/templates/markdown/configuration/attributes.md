
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