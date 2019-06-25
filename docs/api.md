# API Reference

## `validate`

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
  isInitial?: boolean;
}
```

| Property  | Type                      | Description                                                                               |
| --------- | ------------------------- | ----------------------------------------------------------------------------------------- |
| name      | `string | null`           | The name of the field to be validate (will be used for error messages).                   |
| values    | `{ [k: string]: any }`    | The values of other fields (used in cross-field validation).                              |
| names     | `{ [k: string]: string }` | The names of other fields (used in cross-field rules messages).                           |
| bails     | `boolean`                 | If true, the validation will stop at the first failing rule, otherwise trigger all rules. |
| isInitial | `boolean`                 | if true will skip all rules configured not to run at the first validation attempt.        |

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

## `localize`

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

## `configure`

Configures the default global options for vee-validate.

| Argument | Type            | Description                             |
| -------- | --------------- | --------------------------------------- |
| options  | `ConfigOptions` | An object of the configuration options. |

You can refer to the [configuration guide](./configuration.md) for more information.
