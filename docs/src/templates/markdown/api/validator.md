## [Validator](#validator)

### [Adding Fields](#validator-fields)

The validator is injected to the Vue instance as `$validator` automatically. However, it is also a standalone class and can be used separately for programmatically validating values. The constructor can optionally take an object to map each field name to a set of validations.

```js
import { Validator } from 'vee-validate';
const validator = new Validator({
  email: 'required|email',
  name: 'required|alpha|min:3'
});

// Or
Validator.create();
```

But you can construct the object without passing anything and add the validation rules later, using the `attach` method which takes [FieldOptions](https://github.com/baianat/vee-validate/blob/master/flow/validator.js#L17) as its first parameter.

```js
import { Validator } from 'vee-validate';
const validator = new Validator();

validator.attach({ name: 'email', rules: 'required|email' }); // attach field.
 // attach field with display name for errors generation.
validator.attach({ name: 'name', rules: 'required|alpha', alias: 'Full Name' });

validator.detach('email'); // you can also detach fields.
```

### [Validation](#validator-validate)

After that, you can validate values with `validate(field, value)` which returns a promise that resolves to a boolean.

```js
validator.validate('email', 'foo@bar.com').then(result => {
  console.log(result);  // true
});

validator.validate('email', 'foo@bar').then(result => {
  console.log(result); // false
});
```

You can validate multiple values at the same time using `validateAll(obj)`:

```js
validator.validateAll({ email: 'foo@bar.com', name: 'John Snow' }).then(result => {
  if (!result) {
    // validation failed.
  }
  // success stuff.
}).catch(() => {
  // something went wrong (non-validation related).
});
```

Returns a `Promise` The ErrorBag will be populated with any errors encountered, throws if any error has been encountered. You can access the `errors` property directly which is an instance of the `ErrorBag`.

```js
const errorBag = validator.errors;
```

The more options you provide to `attach` method, the greater the field capabilities increase. For example, providing a `getter` function option will allow the validator the find the field value whenever it needs to. So you will be able to call `validateAll` and `validate` without having to provide any values.

```js
this.$validator.validate('field');
this.$validator.validateAll();
```

> Most of these options are being handled by the `v-validate` directive and are provided for you automatically.

### [Localization](#validator-localization)

The validator instance can only generate messages for one locale at a time. But you need to use `localize` method or set the `locale` property to switch the validator locale. 

```js
validator.localize('ar');
validator.locale = 'ar';
```
> All validators share the same locale configuration. So any locale changes will update all validator instances across your app. For more information about how to overwrite messages and add new ones, please refer to the [custom messages](rules.html#custom-messages) section.

```js
import { Validator } from 'vee-validate'; 

// Also exposed on the class.
Validator.localize('ar'); // Set all validator locales to 'ar'.

Validator.create().locale; // 'ar';
```

Checkout the full API at [GitHub](https://github.com/logaretm/vee-validate/blob/master/src/core/validator.js)

## [Validator Example](#validator-example)

Here is an example of using the validator without the directive, which means you will be responsible for monitoring input changes on your own, and calling the API methods as you see fit. This example uses a Vue instance to simplify things, but it can be used in plain JavaScript as well.
