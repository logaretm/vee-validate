---
title: Global Validations
description: Defining global rules to be used throughout your web app
---

# Global Validations

Sometimes you are building an application that is form-heavy and needs to validate forms frequently, like an admin dashboard or a form based application. importing validation rules every time you need them can be quite tedious.

VeeValidate allows you to define validation rules globally on the app-level which in turn can allow you express your rules in a minimal syntax that is inspired by the [Laravel framework's validation syntax](https://laravel.com/docs/validation).

## Defining a Global Validator

You can define a global validator using the `defineRule` function exported by vee-validate:

```js
import { defineRule } from 'vee-validate';
```

The `defineRule` function accepts a rule name which acts as an identifier for that validation rule, the second argument is the validator function that will verify the field value. Here is an example of a simple `required` and an `email` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('required', value => {
  if (!value || !value.length) {
    return 'This field is required';
  }

  return true;
});

defineRule('email', value => {
  // Field is empty, should pass
  if (!value || !value.length) {
    return true;
  }

  // Check if email
  if (!/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}/.test(value)) {
    return 'This field must be a valid email';
  }

  return true;
});
```

The validator function is a simple function that receives the current field value as the first argument, and it should return:

- `true` If the validation passed
- `string` If the validation failed and there is an error message to display
- `Promise` if you have an asynchronous rule, the promise must either resolve to `string` or `true`

<doc-tip title="Rules Placement">

You should make the `defineRule` calls in your application entry-point file to make sure your forms have access to them, otherwise you may risk a form not being able to use some global rules because they weren't defined then. Here is some common entry points:

- In vue-cli applications that would be the `src/main.js` file
- In a Nuxt application, you need to create a `plugins/vee-validate.js` file and register it in `nuxt.config.js`

</doc-tip>

Now that you've defined your validators, for example the `email` and `required` rules. You can pass them directly to `<Field />` component's `rules` prop like this:

```vue
<Field name="name" as="input" rules="required" />

<Field name="email" as="input" rules="required|email" />
```

Notice that to define multiple rules you have to place a `|` (pipe) character between your rules as a separator.

## Defining Configurable Validators

Sometimes you rules require more information to work properly, for example if we want to define a `minLength` rule it won't be very useful to hard code the character limit, instead it should receive it per field.

VeeValidate passes rules arguments or (configuration) as the second argument to the validator function which is often an array containing the arguments in the same order they were passed in. Here is an example defining a `minLength` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('minLength', (value, [limit]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }

  if (value.length < limit) {
    return `This field must be at least ${limit} characters`;
  }

  return true;
});
```

And then you can use it on the `Field` component like this:

```vue
<Field name="password" as="input" type="password" rules="required|min:8" />
```

Note that to pass arguments to rules, you need to place a colon `:` character to signify the beginning of rules. You can pass multiple arguments as a comma separated list. Here is an example for a `minMax` rule:

```js
import { defineRule } from 'vee-validate';

defineRule('minLength', (value, [min, max]) => {
  // The field is empty so it should pass
  if (!value || !value.length) {
    return true;
  }
  const numericValue = Number(value);
  if (numericValue < min) {
    return `This field must be greater than ${min}`;
  }

  if (numericValue > max) {
    return `This field must be less than ${max}`;
  }

  return true;
});
```

Then you can use it like this:

```vue
<Field name="longitude" as="input" type="number" rules="required|minMax:-180,180" />
```

## Form-level validation with Global Rules

The [Form-level validation](./guide/validation#form-level-validation) feature isn't limited to `yup` validators, you can define your global validators and define them in the exact same way as the previous examples in the `Form` component `validation-schema` prop.

Here is an example that uses all the rules we've defined prior in this page in a form validation schema:

```vue
<template>
  <Form @submit="submit" :validation-schema="schema" v-slot="{ errors }">
    <Field name="email" as="input" />
    <span>{{ errors.email }}</span>

    <Field name="password" as="input" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
  },
  setup() {
    const schema = {
      email: 'required|email',
      password: 'required|min:8',
    };

    return {
      schema,
    };
  },
};
</script>
```

This makes vee-validate extremely compatible with Laravel's Request validation and potentially opens the door to make your forms completely API-driven, eliminating the maintenance burden of syncing validation rules between frontend and backend.

## Cross-Field Validation

Assuming you want to create a rule that verifies that a field matches another, like a password confirmation scenario. Because globally defined rules do not have scope access to other values you may have in the component, vee-validate sends a third argument to your global validators which is a `ValidationContext` that carries useful information about the form and field being validated.

So assuming you want to build a `confirmed` rule, you would make it configurable by accepting the `target` field name and you can use the `ValidationContext.form` object to access its value:

```js
import { defineRule } from 'vee-validate';

defineRule('confirmed', (value, [target], ctx) => {
  if (value === ctx.form[target]) {
    return true;
  }

  return 'Passwords must match';
});
```

Here is an example of the two fields using that rule:

```vue
<Field name="password" as="input" rules="required" />

<Field name="confirmation" as="input" rules="required|confirmed:password" />
```

There is a shorthand for this using `@` prefix before specifying arguments, this tells vee-validate to automatically swap the specified field value in the arguments array:

```js
import { defineRule } from 'vee-validate';

defineRule('confirmed', (value, [target]) => {
  if (value === target) {
    return true;
  }

  return 'Passwords must match';
});
```

```vue
<Field name="password" as="input" rules="required" />

<Field name="confirmation" as="input" rules="required|confirmed:@password" />
```

This allows you to create more concise rules, you can reference any number of fields using this way.

## Caveats
