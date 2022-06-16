---
title: useForm
description: API reference for the useForm composition API function
menuTitle: useForm()
order: 6
---

# useForm

`useForm` is a custom composition API function that allows you to group fields created by `useField` and aggregates their state. It should be used to create logical forms or custom form components similar to the `<Form/>` component which is just a consumer of `useForm`.

The most basic usage is where you have both `useField` and `useForm` at the same setup function:

```js
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    useForm();
    const { value: email, errors } = useField('email', yup.string().email().required());

    return {
      email,
      errors,
    };
  },
};
```

## Field Types

The `useForm` function has field typing capabilities if you need it, getting type information for your fields and their values can be very powerful when building complex forms.

By unlocking the field type you automatically get more strict information for the various properties/methods exposed by `useForm` like `setErrors` and `setTouched`. There are two ways you can get the advanced typing information for your fields, the first is to provide a generic type to `useForm`.

```ts
import { useForm } from 'vee-validate';

interface LoginForm {
  email: string;
  password: string;
}

// in your setup
const { errors } = useForm<LoginForm>();
```

Or simply provide initial values to `useForm` and it will automatically pick up the type of `initialValues` and use it for the field types.

```ts
import { useForm } from 'vee-validate';

const { errors, setErrors, setFieldValue } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
});
```

Whichever approach you prefer, you get full type information for your fields for all the functions exposed by `useForm`, here are a few examples.

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

## API Reference

### TypeScript Definition

The full signature of the `useForm` function looks like this:

```ts
interface FormOptions<TValues extends Record<string, any>> {
  validationSchema?: any; // A yup schema, or a Record<string, any> containing valid rules as `useField`
  initialValues?: MaybeRef<TValues>;
  initialErrors?: Record<keyof TValues, string | undefined>; // a map of the form's initial error messages
  initialTouched?: Record<keyof TValues, boolean>; // a map of the form's initial touched fields
  validateOnMount?: boolean;
}

/**
 * validated-only: only mutate the previously validated fields
 * silent: do not mutate any field
 * force: validate all fields and mutate their state
 */
type SchemaValidationMode = 'validated-only' | 'silent' | 'force';

interface ValidationOptions {
  mode: SchemaValidationMode;
}

type MapValues<T, TValues extends Record<string, any>> = {
  [K in keyof T]: T[K] extends MaybeRef<infer TKey>
    ? TKey extends keyof TValues
      ? Ref<TValues[TKey]>
      : Ref<unknown>
    : Ref<unknown>;
};

interface FormActions<TValues = Record<string, any>> {
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T], opts?: Partial<SetFieldValueOptions>): void;
  setFieldError: (field: keyof TValues, message: string | string[] | undefined) => void;
  setErrors: (fields: FormErrors<TValues>) => void;
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void;
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void;
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void;
  resetForm: (state?: Partial<FormState<TValues>>) => void;
}

interface SubmissionContext<TValues extends Record<string, any>> extends FormActions<TValues> {
  evt?: Event;
}

type SubmissionHandler<TValues extends Record<string, any>, TReturn = unknown> = (
  values: TValues,
  ctx: SubmissionContext<TValues>
) => TReturn;

interface InvalidSubmissionContext<TValues extends Record<string, any>> {
  values: TValues;
  evt?: Event;
  errors: Partial<Record<keyof TValues, string>>;
  results: Partial<Record<keyof TValues, ValidationResult>>;
}

interface FormValidationResult<TValues> {
  valid: boolean;
  results: Partial<Record<keyof TValues, ValidationResult>>;
  errors: Partial<Record<keyof TValues, string>>;
}

interface FormMeta<TValues extends Record<string, any>> {
  touched: boolean;
  dirty: boolean;
  valid: boolean;
  validated: boolean;
  pending: boolean;
  initialValues?: TValues;
}

type useForm = (opts?: FormOptions) => {
  values: TValues; // current form values
  submitCount: Ref<number>; // the number of submission attempts
  errors: ComputedRef<FormErrors<TValues>>; // first error message for each field
  meta: ComputedRef<FormMeta<TValues>>; // aggregate of the field's meta information
  isSubmitting: Ref<boolean>; // if the form submission function is being run
  setFieldValue<T extends keyof TValues>(field: T, value: TValues[T]): void; // Sets a field value
  setFieldError: (field: keyof TValues, message: string | string[] | undefined) => void; // Sets an error message for a field
  setErrors: (fields: FormErrors<TValues>) => void; // Sets error messages for fields
  setValues<T extends keyof TValues>(fields: Partial<Record<T, TValues[T]>>): void; // Sets multiple fields values
  setFieldTouched: (field: keyof TValues, isTouched: boolean) => void; // Sets a field's touched state
  setTouched: (fields: Partial<Record<keyof TValues, boolean>>) => void; // Sets multiple fields touched state
  resetForm: (state?: Partial<FormState<TValues>>) => void; // resets form state to the initial state or the given one
  handleReset: () => void; // Resets all fields' errors and meta and their values to their initial state
  submitForm: (e: Event) => void; // Forces submission of a form after successful validation (calls e.target.submit())
  validate(opts?: Partial<ValidationOptions>): Promise<FormValidationResult<TValues>>;
  validateField(field: keyof TValues): Promise<ValidationResult>;
  useFieldModel<TPath extends keyof TValues>(path: MaybeRef<TPath>): Ref<TValues[TPath]>;
  useFieldModel<TPath extends keyof TValues>(paths: [...MaybeRef<TPath>[]]): MapValues<typeof paths, TValues>;
  handleSubmit<TReturn = unknown>(
    cb: SubmissionHandler<TValues, TReturn>,
    onSubmitValidationErrorCb?: InvalidSubmissionHandler<TValues>
  ): (e?: Event) => Promise<TReturn | undefined>;
};
```

### Arguments

<code-title level="4">

`validationSchema?: any`

</code-title>

Enables form-level validation, uses the specified schema to validate the fields. The schema can be either valid vee-validate global validators or functions or a yup object schema.

<code-title level="4">

`initialValues?: MaybeRef<Record<string, any>>`

</code-title>

The initial values for the form, can be a reactive object or reference.

```js
const { ... } = useForm({
  initialValues: {
    email: 'example@gmail.com',
    password: 'p@$$w0rd',
  }
});
```

<code-title level="4">

`initialErrors?: Record<string, string>`

</code-title>

The initial errors for the fields, useful for non hydrated SSR applications like Laravel, errors are applied on mounted.

```js
const { ... } = useForm({
  initialErrors: {
    email: 'This email is invalid',
    password: 'Password too short',
  }
});
```

<code-title level="4">

`initialTouched?: Record<string, any>`

</code-title>

The initial touched status for the form fields, applied on mounted.

```js
const { ... } = useForm({
  initialTouched: {
    email: true, // touched
    password: false, // non-touched
  }
});
```

<code-title level="4">

`validateOnMount?: boolean`

</code-title>

If true, it will trigger validation for all fields once the form component is mounted.

### Composable API

The following sections documents each available property on the `useForm` composable.

<code-title level="4">

`errors: Ref<Record<string, string>>`

</code-title>

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

<code-title level="4">

`isSubmitting: Ref<boolean>`

</code-title>

Indicates if the submission handler is still running, once it resolves/rejects it will be automatically set to false again.

```js
const { isSubmitting } = useForm();

isSubmitting.value; // true or false
```

<code-title level="4">

`meta: ComputedRef<FormMeta>`

</code-title>

A computed property that contains an aggregated meta information/flags reflecting the state of all the fields inside the form.

```ts
interface FormMeta {
  touched: boolean; // if at least one field is touched (was blurred)
  dirty: boolean; // if at least one field is dirty (manipulated)
  valid: boolean; // if the form doesn't have any error messages
  pending: boolean; // if at least one field is pending validation
  initialValues?: Record<string, any>; // a map of the form's initial values
}
```

**usage**

```js
const { meta } = useForm();

meta.value; // { valid: false, invalid: true, dirty: true, .... }
```

<code-title level="4">

`values: Record<string, any>`

</code-title>

A reactive property that contains the current form values, you should not try to mutate it directly.

```js
const { values } = useForm();

values; // { email: 'something@gmail.com', .... }
```

<code-title level="4">

`setFieldError: (field: string, message: string | undefined) => void`

</code-title>

Sets a field's error message, useful for setting messages form an API or that are not available as a validation rule. Setting the message to `undefined` or an empty string clears the errors and marks the field as valid.

```js
const { setFieldError } = useForm();

setFieldError('email', 'this email is already taken');

// Mark field as valid
setFieldError('email', undefined);
```

If you try to set an error for a field that doesn't exist, it will be added to the form's errors object and it will change the form's `valid` state

<code-title level="4">

`setErrors: (fields: Record<string, string | undefined>) => void`

</code-title>

Sets multiple fields error messages, uses `setFieldError` internally.

```js
const { setErrors } = useForm();

setErrors({
  email: 'this email is already taken',
  password: 'someone already has this password 🤪',
  firstName: undefined, // clears errors and marks the field as valid
});
```

<doc-tip>

Any missing fields you didn't pass to `setErrors` will be unaffected and their state will not change

</doc-tip>

<code-title level="4">

`setFieldValue: (field: string, value: any) => void`

</code-title>

Sets a field's value, if a field does not exist it will not be reflected in the `values` ref. This will trigger validation on the field whose value changed.

```js
const { setFieldValue } = useForm();

setFieldValue('email', 'example@gmail.com');
```

If ou try to set a value for a field that doesn't exist, it will be added to the form's values object and will stay there until the next `resetForm` is called.

<code-title level="4">

`setValues: (fields: Record<string, any>) => void`

</code-title>

Sets all fields values, will trigger validation for the changed fields.

```js
const { setValues } = useForm();

setValues({
  email: 'example@gmail.com',
  password: 'p@a$$W0rD',
});
```

<code-title level="4">

`setFieldTouched: (field: string, isTouched: boolean) => void`

</code-title>

Sets a field's `touched` meta flag, if you set it for a non-existing field it will have no effect.

```js
const { setFieldTouched } = useForm();

setFieldTouched('email', true);
```

<code-title level="4">

`setTouched: (fields: Record<string, boolean>) => void`

</code-title>

Sets multiple fields `touched` meta flag, does not validate.

```js
const { setTouched } = useForm();

setTouched({
  email: true,
  password: false,
});
```

<code-title level="4">

`validate: () => Promise<{ valid: boolean; errors: Record<string, string>}>`

</code-title>

Validates all the fields and populates the `errors` object, returns a promise that resolves to an object containing aggregated validation result of all fields.

```js
const { validate } = useForm();

const { valid, errors } = await validate();
```

<code-title level="4">

`validateField: (field: string) => Promise<{ valid: boolean; errors: string[] }>`

</code-title>

Validates a specific field inside the form, returns a promise that resolves to an object containing the validation result.

```js
const { validateField } = useForm();

const { valid, errors } = await validateField('email');
```

<code-title level="4">

`handleSubmit: (cb: SubmissionHandler) => (evt?: Event) => Promise<void>`

</code-title>

This is a higher order function used to create `submit` event handlers, You shouldn't use it as a handler for the events directly but rather use it to create those handlers.

The handlers created using this function will automatically prevent form submission and stop the propagation of the submit event.

It accepts a function which runs after validating the form and if all fields are valid. The callback you pass will receive the form values as the first argument, which is an object containing the fields' values.

```vue
<template>
  <form @submit="onSubmit"></form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleSubmit } = useForm();

// use `onSubmit` as an event handler for your forms
const onSubmit = handleSubmit(values => {
  // pretty print the values object
  alert(JSON.stringify(values, null, 2));
});
</script>
```

For advanced forms, you may need to trigger various actions on the form in the `submit` handler. Your callback receives a `FormActions` object as part of the second argument along with the event object that triggered the submission if available.

```js
const { handleSubmit } = useForm();

const onSubmit = handleSubmit((values, actions) => {
  // Send data to API
  alert(JSON.stringify(values, null, 2));

  // the form object contains useful methods
  // set a single field value
  actions.setFieldValue('field', 'hello');
  // set multiple fields values
  actions.setValues({ email: 'value', password: 'hi' });
  // set a single field error
  actions.setFieldError('field', 'this field is bad');
  // set multiple fields errors
  actions.setErrors({ email: 'bad email', password: 'bad password' });
  // reset the form
  actions.resetForm();
});
```

<doc-tip title="Virtual Forms">

You can use `handleSubmit` to submit **virtual forms** that may use `form` elements or not. As you may have noticed the snippet above doesn't really care if you are using forms or not.

</doc-tip>

<code-title level="4">

`submitForm: (evt: Event) => void`

</code-title>

Unlike `handleSubmit` this function can be used as an event handler for form `submit` event, it will prevent the propagation and submission of the forms using it as long as they are invalid. Once all the fields are valid it will submit the form with the native HTML behavior following the `form` element's `action` and `method` attributes.

This is useful if you plan to handle form submissions using a backend API like Laravel or whatever.

```vue
<template>
  <form @submit="submitForm" action="/api/login" method="post">
    <!-- ... -->
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { submitForm } = useForm();
</script>
```

<code-title level="4">

`submitCount: number`

</code-title>

The number of submission attempts by the user, it increments whenever `submitForm` or `handleSubmit` callback are called.

<code-title level="4">

`resetForm: (state?: Partial<FormState>) => void`

</code-title>

Clears error messages, resets the meta state for all fields and reverts their values to their initial state as well as the `submitCount` state. Accepts an optional object containing the new form state, useful if you need to reset the form values to different values other than their initial state.

This is the `FormState` interface:

```ts
type TouchedFlags = { [k: string]: boolean };

interface FormState {
  // any error messages
  errors: Record<string, string>;
  // touched meta flags
  touched: TouchedFlags;
  // Form Values
  values: Record<string, any>;
  // The form submit attempts count
  submitCount: number;
}
```

In this example, the `resetForm` function is updating the fields current values to the ones provided, these values will be used as the new initial values for future `resetForm` or `handleReset` calls. This also applies if the `Field` component or `useField` used their individual `resetField` function.

```js
const { resetForm } = useForm();

// ...
function onSubmit(values) {
  // send values to the API
  // ...

  // Reset the form values
  resetForm({
    values: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });
}
```

<code-title level="4">

`handleReset: () => void`

</code-title>

Clears error messages, resets the meta state for all fields and reverts their values to their initial state as well as the `submitCount` state. you can use this function as handler for the `reset` events on native form elements.

```vue
<template>
  <form @reset="handleReset">
    <!-- ... -->
  </form>
</template>

<script setup>
import { useForm } from 'vee-validate';

const { handleReset } = useForm();

// you can use it in your code
handleReset();
</script>
```

<code-title level="4">

`useFieldModel` <DocBadge title="v4.6" />

</code-title>

This creates a bindable two-way model value for the specified fields, there are a couple of signatures for `useFieldModel`. Must be called in the `setup` function.

`useFieldModel` accepts either a single field path or multiple via an array. You can use either root field paths or nested paths like `some.user.path` with dot notation.

```vue
<template>
  <input name="email" v-model="email" />
  <span>{{ errors.email }}</span>

  <input name="password" v-model="password" type="password" />
  <span>{{ errors.password }}</span>
</template>

<script setup>
import { useForm } from 'vee-validate';
import MyTextInput from '@/components/MyTextInput.vue';

const { errors, useFieldModel } = useForm();

const email = useFieldModel('email');
const password = useFieldModel('password');

// or multiple models at once
const [email, password] = useFieldModel(['email', 'password']);
</script>
```
