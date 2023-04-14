# @vee-validate/yup

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/guide/composition-api/typed-schema/" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

</p>

> Official vee-validate integration with Yup schema validation

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

## Getting started

You can use [yup](https://github.com/jquense/yup) as a typed schema with the `@vee-validate/yup` package:

```sh
# npm
npm install @vee-validate/yup
# yarn
yarn add @vee-validate/yup
# pnpm
pnpm add @vee-validate/yup
```

The `@vee-valdiate/yup` package exposes a `toTypedSchema` function that accepts any yup schema. Which then you can pass along to `validationSchema` option on `useForm`.

This makes the form values and submitted values typed automatically and caters for both input and output types of that schema.

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().required(),
      password: string().required(),
      name: string(),
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

### Yup default values

You can also define default values on your schema directly and it will be picked up by the form:

```ts
import { useForm } from 'vee-validate';
import { object, string } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      email: string().required().default('something@email.com'),
      password: string().required().default(''),
      name: string().default(''),
    })
  ),
});
```

Your initial values will be using the schema defaults, and also the defaults will be used if the values submitted is missing these fields.

### Yup transforms

You can also define transforms to cast your fields before submission:

```ts
import { useForm } from 'vee-validate';
import { object, number } from 'yup';
import { toTypedSchema } from '@vee-validate/yup';

const { values, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    object({
      age: number()
        .transform(val => Number(val))
        .required(),
    })
  ),
});
```

But note that this does not change the input or output types of the casted fields. The cast will only occur when setting the initial value and when the values are submitted.
