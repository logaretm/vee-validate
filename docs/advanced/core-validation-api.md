# Core Validation API

vee-validate doesn't just offer you components to work with, those are just outlets for the core functionality. You can use the underlying core to validate arbitrary values or even build your own validation outlets.

## The Validate Function

You can import `validate` function from vee-validate and start validating arbitrary values in the same manner as with `ValidationProvider`.

```js
import { validate } from 'vee-validate';

validate('somval', 'required|min:3').then(result => {
  if (result.valid) {
    // Do something
  }
});
```

The `validate` method signature looks like this:

```ts
interface Result {
  valid: boolean;
  errors: string[];
  failedRules: {
    [x: string]: string;
  };
}

interface validate {
  (rules: string | Record<string, any>, value: any, options?: ValidationOptions): Result;
}
```

So you could build your own input field with validation without having to use the `ValidationProvider` component, but remember that components do pack a lot more than just validation of input fields.

Be careful of re-inventing wheel as you add more features to your input field, you might end up with a `ValidationProvider` minus the flexibility!

## Validation Options

The `validate` function has full support for your validation requirements, you can specify the field name, target fields, custom messages using the third argument which is has the `ValidationOptions` type:

```ts
interface ValidationOptions {
  name?: string;
  values?: { [k: string]: any };
  names?: { [k: string]: string };
  bails?: boolean;
  skipOptional:? boolean;
  isInitial?: boolean;
  customMessages?: { [k: string]: string };
}
```

| Property       | Type                      | Description                                                                                                                                    |
| -------------- | ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| name           | `string | null`           | The name of the field to be validate (will be used for error messages).                                                                        |
| values         | `{ [k: string]: any }`    | The values of other fields (used in cross-field validation).                                                                                   |
| names          | `{ [k: string]: string }` | The names of other fields (used in cross-field rules messages).                                                                                |
| bails          | `boolean`                 | If true, the validation will stop at the first failing rule, otherwise trigger all rules.                                                      |
| skipOptional   | `boolean`                 | If true, the validation will skip optional (non-required) fields if they have empty values (empty string, empty array, `null` or `undefined`). |
| isInitial      | `boolean`                 | If true will skip all rules configured not to run at the first validation attempt.                                                             |
| customMessages | `{ [k: string]: string }` | Custom error messages, keyed by rule name. These will override any default messages, as well as any messages set in `extend()`.                |

So you could provide a fully working form validation without components like this:

```js
let password = 'my password';
let confirmation = '????';

validate(password, 'required|confirmed:@confirmation', {
  name: 'Password',
  values: {
    confirmation
  }
}).then(result => {
  if (result.valid) {
    // Do something!
  }
});
```

And just like that you did a cross-field validation, of course the `ValidationObserver` and `ValidationProvider` do handle most of those options for you. But if you ever need to implement something "lower-level" you got the tools to do so and with a very convenient API as well.
