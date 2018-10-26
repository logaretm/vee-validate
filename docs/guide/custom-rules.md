# Custom Rules

You can easily add custom rules to VeeValidate, but your custom rules must adhere to a contract or certain structure:

## Creating A Custom Rule

### Function Form

This is the most basic custom validator form. It consists of only a function that returns either a Boolean or a promise. However, it will have a default error message.

```js
const validator = (value, args) => {
  // Return a Boolean or a Promise that resolves to a boolean.
};
```

### Object Form

```js
const validator = {
  getMessage(field, args) {
    // will be added to default locale messages.
    // Returns a message.
  },
  validate(value, args) {
    // Returns a Boolean or a Promise that resolves to a boolean.
  }
};
```

This validator object must have a `validate` method and can contain a `getMessage` method which will be merged into the current dictionary locale. For multiple languages, you should use the [localization API](./localization.md).

::: tip
  Notice how the `getMessage` method receives the `field`, which is the name of the field under validation as a first parameter, and how the `validate` method receives the value as a first parameter. Both receive the `args` array which contains the arguments that were configured with the validation rule. Take a look at the [actual implementation of the min rule](https://github.com/baianat/vee-validate/blob/master/src/rules/min.js) as an example.
:::

::: warning
  As you can see, a validation rule must implement one of the two forms discussed above. Not doing so will throw an exception with a suitable error message detailing what you were missing.
:::

## Using The Custom Rule

After creating your custom rule, you can add it to the list of rules using `extend(name, validator)` method in the validator instance.

```js
import { Validator } from 'vee-validate';

Validator.extend('truthy', {
  getMessage: field => 'The ' + field + ' value is not truthy.',
  validate: value => !! value
});

let instance = new Validator({ trueField: 'truthy' });

// Also there is an instance 'extend' method for convenience.
instance.extend('falsy', (value) => ! value);

instance.attach({
  name: 'falseField',
  rules: 'falsy'
});
```

::: tip
  Using any of the `extend` either on the class or on an instance will extend all validators with the new validation rule. Extending a new rule that has the same name as an existing rule will silently overwrite it.
:::

Then you can use your rule like any other rule:

```html
<input type="text" name="field" v-validate="'falsy'">
```

::: warning
  When the field under validation is __not__ required, your rule may not be executed at all. This is because VeeValidate skips validation for empty fields if they are not required.
:::

## Args and Rule Configuration

Your rule may provide different results/behavior depending on some configuration, as mentioned before they are passed as an array of values to the validator function, which may not always be optimal, for example a rule with 3 optional parameters would need to recieve all 3 parameters each time just to specify the third parameter.

You can recieve an object instead of an array for your validation rule by providing a `paramNames` array in the extend options (third parameter). Which names the params in the array you would normally recieve.

For an example take a look at a basic __value between__ rule implementation:

```js
const isBetween = (value, { min, max } = {}) => {
  return Number(min) <= value && Number(max) >= value;
};

// The first param is called 'min', and the second is called 'max'.
const paramNames = ['min', 'max'];

Validator.extend('between', isBetween, {
  paramNames //  pass it in the extend options.
});
```

The paramNames isn't really required, but it allows your rule to work in both string/object formats. since there is no way in the string format to pass the named parameters:

```
between:10,20
```

The order is what controls the param names in that case. The validator will use the `paramNames` to convert the array of strings to an object containing the named parameters as keys with the correct param value. Make sure to order the `paramNames` in the same order that the params will be specified in the string format.

::: danger
Locale methods will still recieve the array of args, it will not convert it to an object at the time being due to the possible breaking changes in locale files.
:::

## Target Dependant Rules

Sometimes your rules may need to compare the field value against another field value, some built in rules like `confirmed`, `before` and `after` need a target field to compare against.

You can create custom rules that do this as well by setting the `hasTarget` property on the extend options object which is the third parameter.

```js{3}
validator.extend('isBigger', (value, [otherValue]) => {
  return value >= otherValue;
}, {
  hasTarget: true
});
```

Notice that the other field value will be injected as the first item in the parameter list.

These rules require at least one argument and the target field must have a matching `ref` value.

```html
<input v-validate="'confirmed:confirmation'" name="password" type="password" >
<input name="passwordConfirmation" ref="confirmation" type="password" placeholder="Confirm the password">
```

## Non-immediate Rules

VeeValidate triggers initial validation regardless if you used the [immediate modifier](/api/directive.md#immediate) or not, the difference being if the immediate modifier is set, the errors and flags will be updated.

Sometimes you don't want your rule to be executed, consider a rule that calls to a remote API. Unless the `immediate` modifier is set, you don't want the rule to be executed. This can be done by adding `immediate` boolean to your extend options.

```js
validator.extend('remote', (value, [otherValue]) => {
  // do something
}, {
  immediate: false
});
```

This will skip the rule on the initial validation when the `immediate` modifier is not set.

## Reasoning

Additionally, you may want to provide a reason for failing the validation that may change the error message. For example, you may be using an external API and the error message is generated there.

To achieve this, your validator function should return an `Object` instead of a `Boolean`. This object should always contain a `valid` property and an optional `data` property. The data property will be passed to the message generator function as the third parameter, then you should use the passed data property to modify the output message. The same thing applies to promises as you resolve the promise with an object containing these properties. Here is a custom rule that does just that:

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
