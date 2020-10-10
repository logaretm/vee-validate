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
  meta: FieldMeta; // aggregate of the field's meta information
  form: {
    // Private API
  };
  values: Record<string, any>; // current form values
  validate: () => Promise<boolean>; // validates the form fields and returns the overall result
  isSubmitting: boolean; // if the form submission function is being run
  handleReset: (e: Event) => void; // Resets all fields' errors and meta
  handleSubmit: (cb: Function) => () => void; // Creates a submission handler that calls the cb only after successful validation with the form values
  submitForm: (e: Event) => void; // Forces submission of a form after successful validation (calls e.target.submit())
  setErrors: (fields: Record<string, string>) => void; // Sets error messages for fields
  setFieldError: (field: string, errorMessage: string) => void; // Sets an error message for a field
  setFieldValue: (field: string, value: any) => void; // Sets a field value
  setValues: (fields: Record<string, any>) => void; // Sets multiple fields values
};
```
