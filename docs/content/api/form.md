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
  <Field name="password" as="input" type="password">
</Form>
```

## Rendering Forms

Just like the `Field` component you can pass whatever you want to render in its place, for example a custom `v-form` component that is registered globally:

```vue
<Form as="v-form">
  <Field name="password" as="input" type="password">
</Form>
```

By default a `submit` and `reset` listeners are added to the rendered tag specified by the `as` prop.

For more complex form markup, you can render a `div` and inline your forms in the `Form` component's slots.

```vue
<Form as="div">
  <h2>Sign up form</h2>
  <form>
    <Field name="name" as="input"">
    <Field name="email" as="input" type="email">
    <Field name="password" as="input" type="password">
  </form>
</Form>
```

<doc-tip type="danger" title="HTML Case Insensitivity">

Notice the character-case difference between `Form` and `form`, the uppercased one is the component provided by vee-validate while the lowercased one is the native `form` element, you might run into issues when not using Vue compiler workflow like script tags. In these cases it is recommended to rename the `Form` component to something that will not conflict with native HTML.

```js
// Using named imports
import { From as ValidationForm } from 'vee-validate';

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
  <Field name="name" as="input"">
  <Field name="email" as="input" type="email">
  <Field name="password" as="input" type="password">

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
    <Field name="name" as="input"">
    <Field name="email" as="input" type="email">
    <Field name="password" as="input" type="password">

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
| validateOnMount  | `boolean`                            | `false`     | If true, the fields currently present in the form will be validated when the `<Form />` component is mounted |

### Slots

#### default

The default slot gives you access to the following props:

| Scoped Prop  | Type                         | Description                                                                                                               |
| :----------- | :--------------------------- | :------------------------------------------------------------------------------------------------------------------------ |
| errors       | `Record<string, string>`     | The first error message of each field, the object keys are the fields names                                               |
| meta         | `Record<string, boolean>`    | An aggregate of the [FieldMeta](./api/field#fieldmeta) for the fields within the form                                     |
| values       | `Record<string, any>`        | The current field values                                                                                                  |
| isSubmitting | `boolean`                    | True while the submission handler for the form is being executed                                                          |
| validate     | `Function`                   | Validates the form                                                                                                        |
| handleSubmit | `(cb: Function) => Function` | Creates a submission handler that disables the native form submissions and executes the callback if the validation passes |
| handleReset  | `Function`                   | Resets and form and executes any `onReset` listeners on the component                                                     |
| submitForm   | `Function`                   | Validates the form and triggers the `submit` event on the form, useful for non-SPA applications                           |

Check the sample above for rendering with scoped slots
