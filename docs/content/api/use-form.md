---
title: useForm
description: API reference for the useForm composition API function
menuTitle: useForm()
order: 5
---

# useForm

`useForm` is a custom composition API function that allows you to group fields created by `useField` and aggregates their state. It should be used to create logical forms or custom form components similar to the `<Form/>` component which is just a consumer of `useForm`.

The most basic usage is where you have both `useField` and `useForm` at the same setup function:

```js
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const { form } = useForm();
    const { value: email, errors } = useField('email', yup.string().email().required(), {
      form,
    });

    return {
      email,
      errors,
    };
  },
};
```

## API Reference

The full signature of the `useForm` function looks like this:

```typescript
interface FormOptions {
  validationSchema?: any; // A yup schema, or a Record<string, any> containing valid rules as `useField`
  initialValues?: Record<string, any>;
}

type useForm = (
  opts?: FormOptions
) => {
  errors: Record<string, string>; // first error message for each field
  isSubmitting: boolean; // if the form submission function is being run
  meta: FieldMeta; // aggregate of the field's meta information
  values: Record<string, any>; // current form values
  setFieldError: (field: string, errorMessage: string) => void; // Sets an error message for a field
  setErrors: (fields: Record<string, string>) => void; // Sets error messages for fields
  setFieldValue: (field: string, value: any) => void; // Sets a field value
  setValues: (fields: Record<string, any>) => void; // Sets multiple fields values
  validate: () => Promise<boolean>; // validates the form fields and returns the overall result
  handleSubmit: (cb: (values: Record<string, any>, ctx: SubmissionContext)) => () => void; // Creates a submission handler that calls the cb only after successful validation with the form values
  submitForm: (e: Event) => void; // Forces submission of a form after successful validation (calls e.target.submit())
  handleReset: () => void; // Resets all fields' errors and meta
};
```

### Composable API

The following sections documents each available property on the `useForm` composable.

#### `errors: Ref<Record<string, string>>`

An object that maps field names to their error messages, it only takes the first error message of each field if multiple exists.

```js
const { errors } = useForm();

errors.value; // access the errors value
```

Here is an example of its shape:

```js
{
  email: "this field must be a valid email",
  password: "too short"
}
```

Any fields without error messages will not be included in the object. So you can safety iterate over it with `Object.keys()` knowing all the included fields are invalid.

#### `isSubmitting: Ref<boolean>`

Indicates if the submission handler is still running, once it resolves/rejects it will be automatically set to false again.

```js
const { isSubmitting } = useForm();

isSubmitting.value; // true or false
```

#### `meta: ComputedRef<Record<string, boolean>>`

A computed property that contains an aggregated meta information/flags reflecting the state of all the fields inside the form.

```js
const { meta } = useForm();

meta.value; // { valid: false, invalid: true, dirty: true, .... }
```

#### `values: ComputedRef<Record<string, any>>`

A computed property that contains the current form values, it will only contain the active (non-disabled) fields.

```js
const { values } = useForm();

values.value; // { email: 'something@gmail.com', .... }
```

#### `setFieldError: (field: string, message: string) => void`

Sets a field's error message, useful for setting messages form an API or that are not available as a validation rule.

```js
const { setFieldError } = useForm();

setFieldError('email', 'this email is already taken');
```

If you try to set an error for field doesn't exist, it will not affect the form's overall validity and will be ignored.

#### `setErrors: (fields: Record<string, string>) => void`

Sets multiple fields error messages, uses `setFieldError` internally.

```js
const { setErrors } = useForm();

setErrors({
  email: 'this email is already taken',
  password: 'someone already has this password 🤪',
});
```

#### `setFieldValue: (field: string, value: any) => void`

Sets a field's value, if a field does not exist it will not be reflected in the `values` ref. This will trigger validation on the field whose value changed.

```js
const { setFieldValue } = useForm();

setFieldValue('email', 'example@gmail.com');
```

#### `setValues: (fields: Record<string, any>) => void`

Sets multiple fields values, will trigger validation for all the changed fields.

```js
const { setValues } = useForm();

setValues({
  email: 'example@gmail.com',
  password: 'p@a$$W0rD',
});
```

#### `validate: () => Promise<boolean>`

Validates all the fields and populates the `errors` object, returns a promise that resolves to a boolean indicating if the validation was successful or not

```js
const { validate } = useForm();

await validate(); // true or false
```

#### `handleSubmit: (cb: (values: Record<string, any>, ctx: SubmissionContext )) => (evt?: Event) => Promise<void>`

This is a higher order function used to create `submit` event handlers, You shouldn't use it as a handler for the events directly but rather use it to create those handlers.

The handlers created using this function will automatically prevent form submission and stop the propagation of the submit event.

It accepts a function which runs after validating the form and if all fields are valid. The callback you pass will receive the form values as the first argument, which is an object containing the active (non-disabled) fields' values.

```vue
<template>
  <form @submit="onSubmit"></form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();

    // use `onSubmit` as an event handler for your forms
    const onSubmit = handleSubmit(values => {
      // pretty print the values object
      alert(JSON.stringify(values, null, 2));
    });

    return {
      onSubmit,
    };
  },
};
</script>
```

For advanced forms, you may need to trigger various actions on the form in the `submit` handler. Your callback receives a `FormController` object as part of the second argument along with the event object that triggered the submission if available.

```js
const { handleSubmit } = useForm();

const onSubmit = handleSubmit((values, { evt, form }) => {
  evt; // the event object that triggered the submission if available, might be undefined

  // the form object contains useful methods
  // set a single field value
  form.setFieldValue('field', 'hello');
  // set multiple fields values
  form.setValues({ email: 'value', password: 'hi' });
  // set a single field error
  form.setFieldValue('field', 'this field is bad');
  // set multiple fields errors
  form.setValues({ email: 'bad email', password: 'bad password' });
});
```

#### `submitForm: (evt: Event) => void`

Unlike `handleSubmit` this function can be used as an event handler for form `submit` event, it will prevent the propagation and submission of the forms using it as long as they are invalid. Once all the fields are valid it will submit the form with the native HTML behavior following the `form` element's `action` and `method` attributes.

This is useful if you plan to handle form submissions using a backend API like Laravel or whatever.

```vue
<template>
  <form @submit="submitForm" action="/api/login" method="post">
    <!-- ... -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { submitForm } = useForm();

    return {
      submitForm,
    };
  },
};
</script>
```

#### `handleReset: () => void`

You can use this function as handler for the `reset` events on native form elements, it a

```vue
<template>
  <form @reset="handleReset">
    <!-- ... -->
  </form>
</template>

<script>
import { useForm } from 'vee-validate';

export default {
  setup() {
    const { handleReset } = useForm();

    // you can use it in your code
    handleReset();

    // or pass it to be used in the template
    return {
      handleReset,
    };
  },
};
</script>
```
