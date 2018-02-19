## [Custom Rules](#custom-rules)

You can easily add custom rules to the validators, but your custom validation rules must adhere to a contract, or certain structure:  

**Function Form:** This is the most basic custom validator form, it consists of only a function that returns either a Boolean or a promise. However, it will have a default error message.

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


This validator object must have a `validate` method, and can contain a `getMessage` method which will be merged into the current dictionary locale. For multiple languages, you should use the [localization API](localization.html).

> Notice how the `getMessage` method receives the `field` which is the name of the field under validation as a first parameter. And how the `validate` method receives the value as a first parameter. And both receive the `args` array which contains the arguments that were configured with the validation rule. take a look at the [actual implementation of the min rule](https://github.com/logaretm/vee-validate/blob/master/src/rules/min.js) as an example.

> As you can see, a validation rule must implement one of the three forms discussed above. Not doing so will throw an exception with a suitable error message detailing what you were missing.

Additionally, you may want to provide a reason for failing the validation that may change the error message. For example, you may be using an external API and the error message is generated there.

To achieve this, you need to return an `Object` instead of a `Boolean` this object should always contain a `valid` property and an optional `data` property, the data property will be passed to the message generator function as the third parameter, then you should use the passed data property to modify the output message. The same thing applies to promises as you resolve the promise with an object containing those properties. Here is a custom rule that does just that:

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

instance.attach({
  name: 'falseField',
  rules: 'falsy'
});
```
> Using any of the `extend` either on the class or on an instance will extend all validators with the new validation rule. Extending a new rule that has the same name as an existing rule will throw a `ValidatorException` with an error message.