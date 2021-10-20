---
title: Form
description: API reference for the Form component
menuTitle: '<Form />'
order: 2
---

# Form

## Form Component

The `<Form />` component is like its name, a simple HTML form but with a few adjustments and DX improvements, By default it will render a native HTML `form` element.

```vue
<Form>
  <Field name="password" type="password" />
</Form>
```

## Rendering Forms

Just like the `Field` component you can pass whatever you want to render in its place, for example a custom `v-form` component that is registered globally:

```vue
<Form as="v-form">
  <Field name="password" type="password" />
</Form>
```

By default a `submit` and `reset` listeners are added to the rendered tag specified by the `as` prop.

For more complex form markup, you can render a `div` and inline your forms in the `Form` component's slots.

```vue
<Form as="div">
  <h2>Sign up form</h2>
  <form>
    <Field name="name" />
    <Field name="email" type="email" />
    <Field name="password" type="password" />
  </form>
</Form>
```

<doc-tip type="danger" title="HTML Case Insensitivity">

Notice the character-case difference between `Form` and `form`, the uppercased one is the component provided by vee-validate while the lowercased one is the native `form` element, you might run into issues when not using Vue compiler workflow like script tags. In these cases it is recommended to rename the `Form` component to something that will not conflict with native HTML.

```js
// Using named imports
import { Form as ValidationForm } from 'vee-validate';

const component = {
  components: {
    // If you have VeeValidate globally via a CDN script
    ValidationForm: VeeValidate.Form,
  },
};
```

</doc-tip>

Lastly, you can use the `Form` component slot props to access various aspects of the form state:

```vue
<Form v-slot="{ values }">
  <Field name="name" />
  <Field name="email" type="email" />
  <Field name="password" type="password" />

  <!-- prints current form values -->
  <pre>
    {{ values }}
  </pre>
</Form>
```

## Renderless Forms

While not recommended, you can make the `Form` component a renderless component by passing an empty string to the as prop, this is useful if you already need to add a form inside the scoped slot:

```vue
<Form as="" v-slot="{ values, submitForm }">
  <h2>Sign up form</h2>
  <form @submit="submitForm">
    <Field name="name" />
    <Field name="email" type="email" />
    <Field name="password" type="password" />

    <!-- prints current form values -->
    <pre>
      {{ values }}
    </pre>
  </form>
</Form>
```

## API Reference

### Props

| Prop             | Type                                 | Default     | Description                                                                                                  |
| :--------------- | :----------------------------------- | :---------- | :----------------------------------------------------------------------------------------------------------- |
| as               | `string`                             | `"form"`    | The element to render as a root node                                                                         |
| validationSchema | `Record<string, string \| Function>` | `undefined` | An object describing a schema to validate fields with, can be a plain object or a `yup` object schema        |
| initialValues    | `Record<string, any>`                | `undefined` | Initial values to fill the fields with, when provided the fields will be validated on mounted                |
| initialErrors    | `Record<string, string>`             | `undefined` | Initial form errors to fill the fields with, the errors will be added when the form component is mounted     |
| initialDirty     | `Record<string, boolean>`            | `undefined` | Initial dirty fields, the status will be applied when the form component is mounted                          |
| initialTouched   | `Record<string, boolean>`            | `undefined` | Initial touched fields, the status will be applied when the form component is mounted                        |
| validateOnMount  | `boolean`                            | `false`     | If true, the fields currently present in the form will be validated when the `<Form />` component is mounted |

### Slots

#### default

The default slot gives you access to the following props:

<code-title level="4">

`errors: Record<string, string>`

</code-title>

An object that maps field names to their error messages, it only takes the first error message of each field if multiple exists.

Here is an example of its shape:

```js
{
  email: "this field must be a valid email",
  password: "too short"
}
```

Any fields without error messages will not be included in the object. So you can safety iterate over it with `Object.keys()` knowing all the included fields are invalid.

<code-title level="4">

`isSubmitting: boolean`

</code-title>

Indicates if the submission handler is still running, once it resolves/rejects it will be automatically set to `false` again.

<code-title level="4">

`meta: FormMeta`

</code-title>

Contains an aggregated meta information/flags reflecting the state of all the fields inside the form.

```ts
interface FormMeta {
  touched: boolean; // if at least one field is touched (was blurred)
  dirty: boolean; // if at least one field is dirty (manipulated)
  valid: boolean; // if all fields are valid
  pending: boolean; // if at least one field is pending validation
  initialValues?: Record<string, any>; // a map of the form's initial values
}
```

<code-title level="4">

`values: Record<string, any>`

</code-title>

Contains the current form values

<code-title level="4">

`setFieldError: (field: string, message: string) => void`

</code-title>

Sets a field's error message, useful for setting messages form an API or that are not available as a validation rule.

If you try to set an error for a field that doesn't exist, it will be added to the form's errors object and it will change the form's `valid` state

<code-title level="4">

`setErrors: (fields: Record<string, string>) => void`

</code-title>

Sets multiple fields error messages, uses `setFieldError` internally.

<code-title level="4">

`setFieldValue: (field: string, value: any) => void`

</code-title>

Sets a field's value, if a field does not exist it will not be reflected in the `values` ref. This will trigger validation on the field whose value changed.

If ou try to set a value for a field that doesn't exist, it will be added to the form's values object and will stay there until the next `resetForm` is called.

<code-title level="4">

`setValues: (fields: Record<string, any>) => void`

</code-title>

Sets all fields values, will trigger validation for the changed fields.

<code-title level="4">

`setFieldTouched: (field: string, isTouched: boolean) => void`

</code-title>

Sets a field's `touched` meta flag, if you set it for a non-existing field it will have no effect.

<code-title level="4">

`setTouched: (fields: Record<string, boolean>) => void`

</code-title>

Sets multiple fields `touched` meta flag, does not validate.

<code-title level="4">

`validate: () => Promise<{ valid: boolean; errors: Record<string, string>}>`

</code-title>

Validates all the fields and populates the `errors` object, returns a promise that resolves to an object containing aggregated validation result of all fields.

<code-title level="4">

`validateField: (field: string) => Promise<{ valid: boolean; errors: string[] }>`

</code-title>

Validates a specific field inside the form, returns a promise that resolves to an object containing the validation result.

<code-title level="4">

`handleSubmit: (evt: Event, cb: (values: Record<string, any>, ctx: SubmissionContext) => any) => Promise<void>`

</code-title>

This can be used as an event handler for `submit` events, it accepts the event object and a callback function that will run if the form is valid. If an event object is provided, `preventDefault` and `stopPropagation` will be automatically called on it.

Note that this is only useful if you are not rendering a form tag on the `<Form />` component. By default the `Form` component uses this handler to handle any `submit` events.

<code-title level="4">

`submitForm: (evt: Event) => void`

</code-title>

This function can also be used as an event handler for form `submit` event, the different that it will prevent the propagation and submission of the form as long as they are invalid. Once all the fields are valid it will submit the form with the native HTML behavior following the `form` element's `action` and `method` attributes.

This is useful if you plan to handle form submissions using a backend API like Laravel.

<code-title level="4">

`submitCount: number`

</code-title>

The number of submission attempts by the user, it increments whenever `submitForm` or `handleSubmit` callback are called.

<code-title level="4">

`handleReset: () => void`

</code-title>

Clears error messages, resets the meta state for all fields and reverts their values to their initial state and resets the `submitCount` to `0`. You can use this function as handler for the `reset` events on native form elements.

<code-title level="4">

`resetForm: (state?: Partial<FormState>) => void`

</code-title>

Clears error messages, resets the meta state for all fields and reverts their values to their initial state and resets the `submitCount`.

Accepts an optional object containing the new form state, useful if you need to reset the form values to different values other than their initial state.

This is the shape of the `state` object:

```ts
interface FormState {
  // any error messages
  errors: Record<string, string>;
  // touched meta flags
  touched: Record<string, boolean>;
  // Form Values
  values: Record<string, any>;
  // The form submit attempts count
  submitCount: number;
}
```

In the following example the form is resetting the `email` field value to another value, this will change the field current value as well as it's initial value. Meaning any future calls of `resetForm` without arguments or `handleReset` will use `example@example.com` as their value. This also applies if fields are reset individually using `resetField` on either `useField` return value or `<Field />` component's slot props.

```vue
<Form v-slot="{ resetForm }">
  ...

  <button @click="resetForm({ values: { email: 'example@example.com' } })" type="button">Reset</button>
</Form>
```
