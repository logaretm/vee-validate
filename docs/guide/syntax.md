# Syntax

The validation rules have a simple syntax similar to [Laravel validation syntax](https://laravel.com/docs/5.4/validation).

A validation expression is a string of a series of validators separated by a pipe `|`:

```js
const single = 'required'; // single rule.
const multiple = 'required|numeric' // multiple rules.
```

Rules expression can also be an object for complex and more readable rules:

```js
const single = { required: true }; // required field.

const multiple = {
  required: true,
  numeric: true,
  email: true
};
```

## Rules Parameters

Some rules can have parameters, which can be specified in multiple ways for convience:

- As a comma seperated list which is suitable for the string format.
- An array containing the params values (Suitable for the object format).
- An object (Provides more complex configuration for the rules in object format), but with a [caveat](/guide/custom-rules.md#args-and-rule-configuration).

```js
// Params as a string
const someRule = 'included:1,2,3,4';

// Params as an array.
const someRuleObj = { included: [1, 2, 3, 4] };

// Params as an object.
const someCplxObj = {
  email: {
    allow_utf8_local_part: true
  }
};
```

::: tip
  In object form, rules accept a single value if the rule accepts a single argument. If multiple arguments are passed, you should pass them as an array in the same order.
:::

## Rules in practice

Putting what we've learned to practice, let's create our fields in both expression forms with the following specifications:

- A required `email` field.

```html
<input v-validate="'required|email'" type="email" name="email">

<input v-validate="{ required: true, email: true }" type="email" name="email">
```

- A non-required `username` field.

```html
<input v-validate="'alpha'" type="text" name="username">

<input v-validate="{ alpha: true }" type="text" name="username">
```

- A required `password` field with a minimum length of 6 characters.

```html
<input v-validate="'required|min:6'" type="password" name="password">

<input v-validate="{ required: true, min: 6 }" type="password" name="password">
```

::: tip
  Note that the string expression has single quotes around it. This is because directives in Vue evaluate the given expression and, since we want it to be evaluated as a string, we surround it with single quotes, which means this `v-validate="required"` will fail because it will try to evaluate a `required` prop or method on the Vue instance which probably doesn't exist.
:::
