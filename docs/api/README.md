# API Reference

## `validate()`

| Argument | Type                            | Description                                            |
| -------- | ------------------------------- | ------------------------------------------------------ |
| value    | `any`                           | The value to be validated.                             |
| rules    | `string | { [k: string]: any }` | The rules to be used for validation.                   |
| options  | `ValidationOptions`             | Options to control the validation output and behavior. |

Returns a `Promise<ValidationResult>`.

### ValidationOptions

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

### ValidationResult

```ts
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  failedRules: {
    [x: string]: string;
  };
}
```

The validate method can be used to validate arbitrary values based on the provided rules:

```js
import { validate } from 'vee-validate';

validate('someValue', 'rules|pipe|line').then(result => {
  if (!result.valid) {
    // Handle validation errors.
  }

  // handle validation passing.
});
```

## `localize()`

The localize method is used to enable the internal dictionary implementation and localization for vee-validate.

### Adding new messages

```js
import { localize } from 'vee-validate';

localize('en', {
  messages: {
    // your messages.
  }
});
```

### Setting the locale

```js
import { localize } from 'vee-validate';

// switch to Arabic locale, your Arabic messages must be merged beforehand.
localize('ar');
```

### Merging locales

You can merge locales without setting the current one like this:

```js
import { localize } from 'vee-validate';

// switch to Arabic locale, your Arabic messages must be merged beforehand.
localize({
  en: {
    // en dictionary
  },
  ar: {
    // ar dictionary
  }
});
```

## `configure()`

Configures the default global options for vee-validate.

| Argument | Type            | Description                             |
| -------- | --------------- | --------------------------------------- |
| options  | `ConfigOptions` | An object of the configuration options. |

You can refer to the [configuration guide](../configuration.md) for more information.

## `setInteractionMode()`

This function allows you to build complex UX related to when the field should be validated, here is the type definition:

```ts
interface ModeContext {
  errors: string[];
  value: any;
  flags: ValidationFlags;
}

interface InteractionSetting {
  on?: string[];
  debounce?: number;
}

type InteractionModeFactory = (ctx: ModeContext) => InteractionSetting;

type setInteractionMode = (name: string, implementation?: InteractionModeFactory) => void;
```

Passing the first argument only will make the function search through the defined modes that match it and set the current mode to it.

Passing both arguments will add/overwrite mode with the specified name.

```js
import { setInteractionMode } from 'vee-validate';

// eager is one of the pre-defined modes.
setInteractionMode('eager');

// implement a new mode.
setInteractionMode('eager', (flags) => {
  // aggressive validation when the field is invalid.
  if (flags.invalid) {
    return { on: 'input' };
  }

  // lazy validation when the field is valid.
  return { on: 'change' };
})
```

## `normalizeRules()`

You will rarely need this function, it transforms a validation rule expression like `required|email` or `{ required: true }` to a more diffable object format that's used by vee-validate internally. It is useful if you have large validation fieldset and you want to gain some performance by caching rule expressions.

```js
import { normalizeRules } from 'vee-validate';

normalizeRules('required|email');

// output
// {
//   required: { allowFalse: false },
//   email: { multiple: false }
// }
```

:::danger Internal Function
  This is an internal function and it's implementation detail may change without notice, but its available if you are a fellow library developer and want some deep level integration/optimization with vee-validate.
:::
