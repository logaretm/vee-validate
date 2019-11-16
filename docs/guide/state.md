# Validation State

In the previous examples you used `errors` to display error messages, but the `errors` array is only a part of the validation state available to you. There are other state items that can be useful to you when building accessible and pleasant forms.

## Flags

The validation flags is a set of boolean values that gives you information about the field you are validating, for example you may want to know if the field is currently valid, or if it has been blurred by the user.

This is a table of all the flags available that you can access:

| Name      |   Type    | Default | Description                                       |
| :-------- | :-------: | :-----: | :------------------------------------------------ |
| valid     | `boolean` | `false` | If The field is valid.                            |
| invalid   | `boolean` | `false` | If the field is invalid.                          |
| changed   | `boolean` | `false` | If the field value has been changed.              |
| touched   | `boolean` | `false` | If the field has been blurred.                    |
| untouched | `boolean` | `true`  | If the field wasn't blurred.                      |
| pristine  | `boolean` | `true`  | If the field value was not manipulated.           |
| dirty     | `boolean` | `false` | If the field value has been manipulated.          |
| pending   | `boolean` | `false` | Indicates if the field validation is in progress. |
| required  | `boolean` | `false` | If the field is required.                         |
| validated | `boolean` | `false` | If the field has been validated at least once.    |
| passed    | `boolean` | `false` | If the field has been validated and is valid.     |
| failed    | `boolean` | `false` | If the field has been validated and is invalid.   |

These flags are supported for all types of HTML5 inputs as well as custom components that emit the proper events for these flags.

:::tip For Component Authors
  To support all the flags for your custom component you need to emit an `input` event and a `blur` event.
:::

These flags are exposed as slot props on the `ValidationProvider` component. This is a small demo for these flags:

@[example](validation-flags)

## Failed Rules

`ValidationProvider` provides a `failedRules` object is similar to `errors` but you can use it to find out which rules invalidated the field. This is useful if you are planning to have some SSR error messages that's injected by PHP or other backend technologies.

Like the `errors` array, it will only contain 1 key because of the **fast-exit** strategy by default, if you disable this behavior you can see the failed failed rules mapped to their messages:

@[example](failed-rules)

## CSS Classes

`ValidationProvider` provides a reactive `classes` object that you can use to bind to your input, the classes themselves are mapped from the validation flag state which isn't very useful but you can configure how flags map to class names using the global `configure` function:

```js
import { configure } from 'vee-validate';

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
    dirty: ['is-dirty', 'is-dirty'], // multiple classes per flag!
    // ...
  }
})
```

You don't have to configure all the classes, only configure what you need and once you are done you can directly use class binding to apply them to your input.

@[example](classes)

## Aria Attributes

`ValidationProvider` also exposes two more reactive objects that can be used to enhance the accessability of your forms, the `ariaInput` and `ariaMsg` objects contain `aria-*` attributes that you can directly bind to your inputs just like classes:

@[example](aria)

You can use your dev-tools to check which attributes were applied on each element.

---

Now that you understood the validation state available, you can move on to building actual forms!
