---
title: useForm() Field Types
description: Using field types with useForm
order: 7
---

# useForm() Field Types

The `useForm` function exposed by vee-validate has field typing capabilities if you need it, getting type information for your fields and their values can be very powerful when building complex forms.

By unlocking the field type you automatically get more strict information for the various properties/methods exposed by `useForm` like `setErrors` and `setTouched`. For more information about these properties/methods go to the [`useForm()` API reference](/api/use-form).

## Unlocking Field Types

There are two ways you can get the advanced typing information for your fields, the first is to provide a generic type to `useForm`.

```ts
import { useForm } from 'vee-validate';

interface LoginForm {
  email: string;
  password: string;
}

// in your setup
const { errors } = useForm<LoginForm>();
```

```ts
import { useForm } from 'vee-validate';

interface LoginForm {
  email: string;
  password: string;
}

// in your setup
const { errors, setErrors, setFieldValue } = useForm<LoginForm>();

errors.value; // typed as { email?: string; password?: string }

setErrors({
  email: 'This field is invalid', // auto-complete for `email` and `password`
});

setFieldValue('email', 'example@gmail.com'); // auto-complete for the field name and its value type
```

For example if you were to do this in the previous example:

```ts
setFieldValue('age', 5); // ⛔️ TypeScript error
setFieldValue('email', 5); // ⛔️ TypeScript error
```

It will error out because `age` is not defined in the `LoginForm` type you defined. The second line errors out because the `email` field is typed as a `string`.

## With Initial Values

You can also unlock the same capabilities for simpler fields by providing an `initialValues` property to `useForm`:

```typescript
import { useForm } from 'vee-validate';

const { errors, setErrors, setFieldValue } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
});
```

`useForm` will automatically pick up the type of `initialValues` and use it for the field types.
