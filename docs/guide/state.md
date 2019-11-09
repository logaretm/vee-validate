# Validation State

In our previous example we used `errors` to display the field errors, but the `errors` array is only a part of the validation state available to you. There are other state items that can prove useful to you when building accessible and pleasant forms.

## Flags

The validation flags is a set of boolean values that gives you information about the field you are validating, for example you may want to know if the field is currently valid, or if it is blurred by the user.

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

:::tip
To support all the flags for your custom component you need to emit an `input` event and a `blur` event.
:::

These flags are exposed as a slot prop on the `ValidationProvider` component, this is a small demo for these flags:

@[example](validation-flags)

## Failed Rules

Failed rules is similar to `errors` but you can use it to find out which rules invalidated the field, useful if you are planning to have some SSR error messages that's injected by PHP or other backend technologies.

Just like the `errors` array, by default it will only contain 1 key because of the **fast-exit** strategy, if we disable this behavior we can see our failed rules mapped to their message:

@[example](failed-rules)

## CSS Classes

VeeValidate also provides a reactive `classes` state that you can use to bind to your input, the classes themselves are mapped from the validation flag state which isn't very useful but you can configure how flags map to class names using the global `configure` function:

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

You don't have to configure all the classes, just configure what you need and once you are done you can directly use class binding to apply them to your input.

@[example](classes)

## Aria Attributes

`ValidationProvider` also exposes two more state items that can be used to enhance the accessability of your forms, the `ariaInput` and `ariaMsg` objects contain `aria-*` attributes that you can directly bind to your inputs just like classes:

@[example](aria)

You can use your devtools to check which attributes where applied on each element.

---

Now that you got the validation state under your belt we can move on to building actual forms!
