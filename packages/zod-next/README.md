# @vee-validate/zod

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/integrations/zod-schema-validation/" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

  <a href="https://github.com/colinhacks/zod/" target="_blank">
    <img width="150" src="https://github.com/colinhacks/zod/raw/master/logo.svg">
  </a>
</p>

> Official vee-validate integration with Zod schema validation

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

## Guide

[Zod](https://github.com/colinhacks/zod/) is an excellent library for value validation which mirrors static typing APIs.

In their own words it is a:

> TypeScript-first schema validation with static type inference

You can use zod as a typed schema with the `@vee-validate/zod` package:

```sh
# npm
npm install @vee-validate/zod
# yarn
yarn add @vee-validate/zod
# pnpm
pnpm add @vee-validate/zod
```

The `@vee-valdiate/zod` package exposes a `toTypedSchema` function that accepts any zod schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().min(1, 'required'),
      password: string().min(1, 'required'),
      name: string().optional(),
    })
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

### Zod default values

You can also define default values on your zod schema directly and it will be picked up by the form:

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().default('something@email.com'),
      password: string().default(''),
    })
  ),
});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.

### Zod preprocess

You can also define preprocessors to cast your fields before submission:

```ts
import { useForm } from 'vee-validate';
import { object, number, preprocess } from 'zod';
import { toTypedSchema } from '@vee-validate/zod';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      age: preprocess(val => Number(val), number()),
    })
  ),
});

// typed as `unknown` since the source value can be anything
values.age;

handleSubmit(submitted => {
  // will be typed as number because zod made sure it is!
  values.age;
});
```
