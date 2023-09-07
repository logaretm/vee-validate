# @vee-validate/joi

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/integrations/joi-schema-validation/" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

  <a href="https://github.com/hapijs/joi/" target="_blank">
    <img width="150" src="https://joi.dev/img/joiTransparent.png">
  </a>
</p>

> Official vee-validate integration with Joi schema validation

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

## Guide

[Joi](https://github.com/hapijs/joi/) is a feature rich validation library for the browser and nodejs

In their own words it is a:

> The most powerful schema description language and data validator for JavaScript.

You can use joi as a typed schema with the `@vee-validate/joi` package:

```sh
# npm
npm install @vee-validate/joi
# yarn
yarn add @vee-validate/joi
# pnpm
pnpm add @vee-validate/joi
```

The `@vee-valdiate/joi` package exposes a `toTypedSchema` function that accepts any joi schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'joi';
import { toTypedSchema } from '@vee-validate/joi';

interface FormData {
  email: string;
  password: string;
  name?: string;
}

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object<FormData>({
      email: string().min(1).required().message('required'),
      password: string().min(1).message('required'),
      name: string().optional(),
    }),
  ),
});

// ❌ Type error, which means `values` is type-safe
values.email.endsWith('@gmail.com');

handleSubmit(submitted => {
  // No errors, because email is required!
  submitted.email.endsWith('@gmail.com');

  // ❌ Type error, because `name` is not required so it could be undefined
  // Means that your fields are now type safe!
  submitted.name.length;
});
```

### Joi default values

You can also define default values on your joi schema directly and it will be picked up by the form:

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'joi';
import { toTypedSchema } from '@vee-validate/joi';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().default('something@email.com'),
      password: string().default(''),
    }),
  ),
});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.
