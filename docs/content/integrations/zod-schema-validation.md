---
title: Zod Schema Validation
description: VeeValidate Official Zod Schema Integration
order: 1
---

# Zod Schema Validation

<div class="mb-10 w-full flex items-center justify-center">
  <a href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img class="h-40" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

  <a class="ml-4" href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img class="h-40" src="https://github.com/colinhacks/zod/raw/master/logo.svg">
  </a>
</div>

If you prefer to use [zod](https://github.com/colinhacks/zod) for schema validation instead of [yup](https://github.com/jquense/yup), you can do so with the `@vee-validate/zod` package.

With `@vee-validate/zod` you can use `Zod` typed schemas as drop-in replacements for `yup` schemas.

## Install

To use this plugin, make sure to install these packages `vee-validate`, `zod`, and `@vee-validate/zod`.

```sh
yarn add vee-validate@next zod@beta @vee-validate/zod

# or with NPM

npm install vee-validate@next zod@beta @vee-validate/zod
```

## Validating with Zod

You can create validation schemas for either field-level validation or form-level validation, the `@vee-validate/zod` exposes two functions that transform Zod's schemas into something that can be understood by `vee-validate` main core and use them to perform validation.

## Field-level Validation

The first function is `toFieldValidator`, which accepts a Zod schema. You can use the converted schema by passing it to the `rules` prop present on the `<Field />` component:

```vue
<template>
  <Form>
    <Field name="email" type="email" :rules="fieldSchema" />
    <ErrorMessage name="email" />
  </Form>
</template>

<script>
import { Field, Form, ErrorMessage } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';

export default {
  components: {
    Form,
    Field,
  },
  setup() {
    const fieldSchema = toFieldValidator(zod.string().nonempty('Field is required').email('Must be a valid email'));

    return {
      rules,
    };
  },
};
</script>
```

If you prefer to use the Composition API, then you can pass the converted schema to the `useField` function:

```vue
<template>
  <input name="email" v-model="value" type="email" />
  <span>{{ errorMessage }}</span>
</template>

<script>
import { useField } from 'vee-validate';
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';

export default {
  setup() {
    const fieldSchema = toFieldValidator(
      zod.string().nonempty('Field is required').email({ message: 'Must be a valid email' })
    );
    const { value, errorMessage } = useField('email', fieldSchema);

    return {
      rules,
    };
  },
};
</script>
```

## Form-Level Validation

You can also use Zod's `zod.object` to create validation schemas for your forms instead of individually passing it for each field, this is covered in general in the [form-level validation section](/guide/components/validation).

To be able to use `zod.object` to define form schemas, you need to use another function with is appropriately named `toFormValidator`.

The `toFormValidator` function accepts a Zod object schema and prepares it to be consumed by the vee-validate validation logic.

You can pass the converted schema to the `validation-schema` prop present on the `<Form />` component:

```vue
<template>
  <Form :validation-schema="validationSchema" @submit="onSubmit">
    <Field name="email" type="email" />
    <ErrorMessage name="email" />

    <Field name="password" type="password" />
    <ErrorMessage name="password" />

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  setup() {
    const validationSchema = toFormValidator(
      zod.object({
        email: zod.string().nonempty('This is required').email({ message: 'Must be a valid email' }),
        password: zod.string().nonempty('This is required').min(8, { message: 'Too short' }),
      })
    );

    function onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    }

    return {
      validationSchema,
      onSubmit,
    };
  },
};
</script>
```

Alternatively, if you prefer to use the composition API, you can pass the converted schema as the `validationSchema` option accepted by the `useForm` function:

```vue
<template>
  <form @submit="onSubmit">
    <input name="email" v-model="email" type="email" />
    <span>{{ errors.email }}</span>

    <input name="password" v-model="password" type="password" />
    <span>{{ errors.password }}</span>

    <button>Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';
import { toFormValidator } from '@vee-validate/zod';

export default {
  setup() {
    const validationSchema = toFormValidator(
      zod.object({
        email: zod.string().nonempty('This is required').email({ message: 'Must be a valid email' }),
        password: zod.string().nonempty('This is required').min(8, { message: 'Too short' }),
      })
    );

    const { handleSubmit, errors } = useForm({
      validationSchema,
    });

    const { value: email } = useField('email');
    const { value: password } = useField('password');

    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    return {
      validationSchema,
      email,
      password,
      errors,
    };
  },
};
</script>
```

<doc-tip title="TypeScript Form Values Inference">

vee-validate will try to do its best to infer the types of the form values if you are using the composition API, vee-validate can infer the types of the form values when you provide either a `yup` or a converted `zod` validation schema.

```ts
const validationSchema = toFormValidator(
  zod.object({
    email: zod.string().nonempty('This is required').email({ message: 'Must be a valid email' }),
    age: zod.number().min(8, { message: 'Too smol' }),
  })
);

const { handleSubmit, errors } = useForm({
  validationSchema,
  initialValues: {
    // You get auto-completion and type check for `email` and `age` properties
  },
});

// You will get auto-completion for possible errors for `email` and `age`
errors.email;

const onSubmit = handleSubmit(values => {
  // Values will be typed as { email: string; age: number; }
});
```

</doc-tip>
