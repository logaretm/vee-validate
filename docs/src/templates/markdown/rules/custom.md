## [Custom Rules](#custom-rules)

You can easily add custom rules to the validators, but your custom validation rules must adhere to a contract, or certain structure:  

**Function Form:** This is the most basic custom validator form, it consists of only a function that returns either a Boolean or a promise. However it will have a default error message.

```js
const validator = (value, args) => {
  // Return a Boolean or a Promise.
};
```
**Object Form:** 
```js
const validator = {
  getMessage(field, args) {
    // will be added to default English messages.
    // Returns a message.
  },
  validate(value, args) {
    // Returns a Boolean or a Promise.
  }
};
```

**Localized Object Form:** 

```js
const validator = {
  messages: {
    en: (field, args) => {
      // Returns a message.
    },
    cn: (field, args) => {
      // Returns a Chinese message.
    }
  },
  validate(value, args) {
    // Returns a Boolean or a Promise.
  }
};
```
This validator form must have a `validate` method, and either a `getMessage` method, or a `messages` object. The only difference that the latter will allow you to add localized messages, the former only adds it to the English dictionary.

> Notice how the `messages` methods gets passed the `field` which is the name of the field under validation as a first parameter. And how the `validate` method gets passed the value as a first parameter. And both receive the `args` which are the parameters (arguments) that were configured with the validation rule. for example look at the [actual implementation of the min rule](https://github.com/logaretm/vee-validate/blob/master/src/rules/min.js).

> As you can see a validation rule must implement one of the three forms discussed above. Not doing so will throw a `ValidatorException` with a suitable error message detailing what were you missing.

Additionally you may want to provide a reason for failing the validation that may change the error message. For example you may be using an external API and the error message is generated there.  

To acheive this, you need to return an `Object` instead of a `Boolean` this object should always contain a `valid` property and an optional `data` property, the data property will be passed to the message generator function as the third parameter, then you should use the passed data property to modify the output message. The same thing applies to promises as you resolve the promise with an object containg those properties. Here is a custom rule that does just that: 

```js
const myRule = {
  getMessage(field, params, data) {
      return (data && data.message) || 'Something went wrong';
  },
  validate(value) {
    return new Promise(resolve => {
      resolve({
        valid: value === 'trigger' ? false : !! value,
        data: value !== 'trigger' ? undefined : { message: 'Not this value' }
      });
    });
  }
};
```

After creating your custom rule, you can add it to the list of rules using `extend(name, validator)` method in the validator instance. 

```js
import { Validator } from 'vee-validate';

Validator.extend('truthy', {
  getMessage: field => 'The ' + field + ' value is not truthy.',
  validate: value => !! value
});

let instance = new Validator({ trueField: 'truthy' });

// Also there is an instance 'extend' method for convience.
instance.extend('falsy', (value) => ! value);

instance.attach('falseField', 'falsy');
```
> Using any of the `extend` either on the class or on an instance will extend all validators with the new validation rule. extending a new rule that have the same name as an existing rule will throw a `ValidatorException` with an error message.

## [Custom Messages](#custom-messages)

You might need to overwrite the error messages, or add new ones. The Validator class and its instances provide an `localize` method. which will merge the messages with the internal dictionary, overwriting any duplicates.

> Any merges will have an effect on all validator instances as the messages dictionary is shared.

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

validator.localize('ar'); // now this validator will generate messages in arabic.
```

> You must provide the messages in an object path like: `dictionary.locale.messages`.

Usually you would stucture your language files for your app rather than adding hardcoded strings like the example above, check the [localization guide](localization.html) for more info.

## [Custom Attributes](#custom-attributes)

Like the custom messages, the validators share a dictionary containing the attribute names, for example if you want to use "Email Address" instead of "email" in your error messages, this can be easily acheived by including an `attributes` object in the dictionary.  

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

 > If the attribute is not found for the current locale, it will fallback to the binding expression or the field name. If you use the [data-vv-as](localization.html#attributes-data-vv-as) attribute it will take precedence over the internal dictionary.


 ## [Field-specific Custom Messages](#field-sepecific-messages)

 You might need to provide different messages for different fields, for example you might want to display an error message for the email field when its required, but a different messsage when the name is required. This allows you to give your users a flexible experience and context aware messages.

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

Thats it. One thing to keep in mind is to place any dictionary releated operations in your code before it actually needs it to avoid uneccessary merges, for example a good common place is in your app entry point or setup script, conversly, a poor choice would be a component lifecycle hook like `mounted` since the validator dictionary is kept globally for all instances.

By default, any unspecified rules for the specific field messages will fallback to the already included ones, so you only need to define the custom messages you only need.