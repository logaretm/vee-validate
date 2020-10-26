---
title: Field
description: API reference for the Field component
menuTitle: '<Field />'
order: 1
---

# Field

The `<Field />` component is an extremely flexible component that makes rendering input fields easy and intuitive, By default it renders an HTML `input` tag. So a simple text input can be rendered like this:

```vue
<template>
  <Field name="field" type="text" />
</template>

<script>
import { Field } from 'vee-validate';

export default {
  components: {
    Field,
  },
};
</script>
```

## Rendering Fields

The `Field` component allows you to render practically anything and gives you complete flexibility and control over how your fields are rendered. The `Field` component renders an HTML `input` tag if not specified otherwise. Which can be done in two ways.

### Rendering simple fields with 'as' prop

The `as` prop tells the Field component which tag to render in its place, you can pass any additional attributes like `type="text"` and it will be passed to the rendered `input` tag as well as any listeners and slots.

For example you could render a `select` input like this:

```vue
<Field name="field" as="select">
  <option>Coffee</option>
  <option>Tea</option>
  <option>Coke</option>
</Field>
```

You can also render any globally defined components:

```vue
<Field name="field" as="my-text-field" />
```

<doc-tip>

For validation to work, the rendered tag with `as` prop must conform to the events that the `Field` component listens for, you can view a list of these in the [Validation Behavior](/guide/validation#validation-behavior)

</doc-tip>

### Rendering Complex Fields with Scoped Slots

The `as` prop is very easy to use but also limited as you cannot render a group of markup. Fortunately the `Field` component makes use of the scoped-slots (v-slot) feature to allow you to render complex markup:

```vue
<Field name="password" v-slot="{ field }">
  <input v-bind="field" type="password">
  <p>Hint: Enter a secure password you can remember</p>
</Field>
```

The most crucial part of rendering fields with `v-slot` is that you **must bind the `field` object to your input element/input**, the `field` object contains all the attributes and listeners required for the field to be validated, this is done automatically if you are using the `as` prop.

When using `v-slot` on the `Field` component you no longer have to provide an `as` prop and then it will become a renderless component.

## API Reference

### Props

| Prop            | Type                           | Required/Default | Description                                                                                                          |
| :-------------- | :----------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------- |
| as              | `string`                       | `"span"`         | The element to render as a root node, defaults to `input`                                                            |
| name            | `string`                       | Required         | The field's name, must be inside `<Form />`                                                                          |
| rules           | `object \| string \| Function` | `null`           | The field's validation rules                                                                                         |
| validateOnMount | `boolean`                      | `false`          | If true, field will be validated when the component is mounted                                                       |
| bails           | `boolean`                      | `true`           | Stops validating as soon as a rule fails the validation                                                              |
| label           | `string`                       | `undefined`      | A different string to override the field `name` prop in error messages, useful for display better or formatted names |

### Slots

#### default

The default slot gives you access to the following props:

<code-title level="4">

`meta: FieldMeta`

</code-title>

Contains useful information/flags about the field status.

```typescript
interface FieldMeta {
  touched: boolean; // if the field has been blurred (via handleBlur)
  dirty: boolean; // if the field has been manipulated (via handleInput or handleChange)
  valid: boolean; // if the field has been validated and is valid
  pending: boolean; // if validation is in progress
  initialValue?: any; // the field's initial value
}
```

<doc-tip title="The valid flag">

The `valid` flag on the meta object can be tricky, because by default it stars off with `false` until the field has been validated, only then it is updated to its proper state.

You should check the `errorMessage` or `errors` to determine if a field is indeed invalid. Combining your `valid` flag checks with `dirty` or `errorMessage` may yield the experience you are trying to build.

</doc-tip>

<code-title level="4">

`errors: string[]`

</code-title>

An array containing all error messages for the field.

<code-title level="4">

`errorMessage: ComputedRef<string | undefined>`

</code-title>

The first error in the `errors` array if available, a handy shortcut to display error messages

<code-title level="4">

`reset: () => void`

</code-title>

Resets the field's validation state, reverts all `meta` object to their default values and clears out the error messages. Doesn't change the field's value.

```js
const { reset } = useField('field', value => !!value);

// reset the field validation state
reset();
```

<code-title level="4">

`validate: () => Promise<{ errors: string[] }>`

</code-title>

Validates the field's current value and returns a promise that resolves with an object containing the error messages emitted by the various rule(s).

```js
const { validate } = useField('field', value => !!value);

// trigger validation
await validate();
```

<code-title level="4">

`handleChange: (evt: Event | any) => void`

</code-title>

Updates the field value, and validates the field. Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the `dirty` meta flag to true

<code-title level="4">

`handleInput: (evt: Event | any) => void`

</code-title>

Updates the field value, **but does not validate the field**. Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the `dirty` meta flag to true

<code-title level="4">

`handleBlur: (evt: Event | any) => void`

</code-title>

Validates the field by default unless explicitly [specified by validation triggers](/guide/validation#customizing-validation-triggers). Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the `touched` meta flag to true

Because this handler doesn't set the field value, it might not report validation correctly if other events are unspecified or disabled.

<code-title level="4">

`setDirty: (isDirty: boolean) => void`

</code-title>

Sets the `dirty` meta flag for this field, useful to create your own `input` or other behaviors handlers

<code-title level="4">

`setTouched: (isTouched: boolean) => void`

</code-title>

Sets the `touched` meta flag for this field, useful to create your own `blur` handlers

#### `field`

Contains a few properties that you can use `v-bind` with to get all vee-validate features on that input. The following is a description of the properties

<code-title level="5">

`field.value: any`

</code-title>

The field's current value, you can bind it with `value` prop on your inputs to sync both values. Don't use it with `v-model` otherwise your input will freeze.

<code-title level="5">

`field.name: string`

</code-title>

The field name.

<code-title level="5">

`field.onBlur: Function[]`

</code-title>

An array containing a few listeners for the `blur` event, it involves updating some meta information and triggers validation by default.

<code-title level="5">

`field.onInput: Function[]`

</code-title>

An array containing a few listeners for the `input` event, it involves updating the field value and some meta information.

<code-title level="5">

`field.onChange: Function[]`

</code-title>

An array containing a few listeners for the `change` event, it involves updating the field value and triggering validation.
