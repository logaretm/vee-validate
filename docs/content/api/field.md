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

<doc-tip>

The `Field` component has partial support for native `select[multiple]` element, while it picks up the multiple values correctly, it doesn't set the initial values UI state on the element itself. You may use `v-model` here or bind the `selected` attributes on the options which is straightforward with the `value` prop exposed on the slot props.

```vue
<Field v-slot="{ value }" name="drink" as="select" multiple>
  <option value="" disabled>Select a drink</option>
  <option v-for="drink in drinks" :key="drink" :value="drink" :selected="value && value.includes(drink)">{{ drink }}</option>
</Field>
```

</doc-tip>

You can also render any globally defined components:

```vue
<Field name="field" as="my-text-field" />
```

<doc-tip>

For validation to work, the rendered tag with `as` prop must conform to the events that the `Field` component listens for, you can view a list of these in the [Validation Behavior](/guide/components/validation#validation-behavior)

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

<doc-tip title="Passing Props and Attrs">

Whichever element/component you chose to render with `<Field />` you can pass also any props or attributes the element/component would normally reieve for example if you render `input` elements you can pass any of it's attributes like `type` or `disabled` to just name a few.

</doc-tip>

### Using v-model

The `<Field />` component uses a different way to apply input values to your rendered inputs using the `v-bind="field"` syntax which adds various listeners and attributes to your rendered inputs.

Because of this, using `v-model` will conflict with `v-bind="field"` because both will attempt to update the input value.

For simple inputs this is not an issue:

```vue
<!-- ✅  Simple Field -->
<Field type="text" name="name" v-model="name" />
```

But for complex inputs rendered with scoped slots (v-slot), you need to place it on the `Field` component tag itself, not the rendered input.

```vue
<!-- DONT: ⛔️  v-model on input tag -->
<Field type="text" name="name" v-slot="{ field }">
  <!-- Conflict between v-model and `v-bind=field` -->
  <input v-bind="field" v-model="name">
</Field>

<!-- DO: ✅  v-model on field tag -->
<Field v-model="name" type="text" name="name" v-slot="{ field }">
  <input v-bind="field">
</Field>
```

Note that you no longer should use `v-model` on your input as `v-bind="field"` will take care of the rest.

## API Reference

### Props

| Prop                  | Type                           | Required/Default | Description                                                                                                                                                                                                                     |
| :-------------------- | :----------------------------- | :--------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| as                    | `string`                       | `"span"`         | The element to render as a root node, defaults to `input`                                                                                                                                                                       |
| name                  | `string`                       | Required         | The field's name, must be inside `<Form />`                                                                                                                                                                                     |
| rules                 | `object \| string \| Function` | `null`           | The field's validation rules                                                                                                                                                                                                    |
| validateOnMount       | `boolean`                      | `false`          | If true, field will be validated when the component is mounted                                                                                                                                                                  |
| validateOnInput       | `boolean`                      | `false`          | If true, field will be validated when `input` event is dispatched/emitted                                                                                                                                                       |
| validateOnChange      | `boolean`                      | `true`           | If true, field will be validated when `change` event is dispatched/emitted                                                                                                                                                      |
| validateOnBlur        | `boolean`                      | `true`           | If true, field will be validated when `blur` event is dispatched/emitted                                                                                                                                                        |
| validateOnModelUpdate | `boolean`                      | `true`           | If true, field will be validated when `update:modelValue` event is emitted                                                                                                                                                      |
| bails                 | `boolean`                      | `true`           | Stops validating as soon as a rule fails the validation                                                                                                                                                                         |
| label                 | `string`                       | `undefined`      | A different string to override the field `name` prop in error messages, useful for display better or formatted names. The generated message won't be updated if this prop changes, you will need to re-validate the input.      |
| value                 | `any`                          | `undefined`      | The field's initial value, optional as long as the field type is not `checkbox` or `radio`.                                                                                                                                     |
| type                  | `string`                       | `undefined`      | The field type, must be provided if you want your field to behave as a `checkbox` or a `radio` input.                                                                                                                           |
| unchecked-value       | `any`                          | `undefined`      | Only useful when the `type="checkbox"` and the field is a single checkbox field (not bound to an array value). Controls the input's value when it's unchecked.                                                                  |
| standalone            | `boolean`                      | `false`          | Excludes the field from participating in any `Form` or `useForm` contexts, useful for creating inputs that do contribute to the `values` object. In other words, the form won't pick up or validate fields marked as standalone |

### Slots

#### default

The default slot gives you access to the following props:

<code-title level="4">

`meta: FieldMeta`

</code-title>

Contains useful information/flags about the field status.

```ts
interface FieldMeta {
  touched: boolean; // if the field has been blurred (via handleBlur)
  dirty: boolean; // if the field has been manipulated (via handleChange)
  valid: boolean; // if the field doesn't have any errors
  pending: boolean; // if validation is in progress
  initialValue?: any; // the field's initial value
}
```

<doc-tip title="The valid flag">

The `valid` flag on the meta object can be tricky, because by default it stars off with `true` for a few moments, only then it is updated to its proper state.

Combining your `valid` flag checks with `dirty` will yield the expected result based on user interaction.

</doc-tip>

<code-title level="4">

`errors: string[]`

</code-title>

An array containing all error messages for the field.

<code-title level="4">

`value: unknown`

</code-title>

The current value of the field, useful to compare and do conditional rendering based on the field value. **You should not use it as a target of `v-model` or `:value` binding**. Instead use the `field` prop.

<code-title level="4">

`errorMessage: ComputedRef<string | undefined>`

</code-title>

The first error in the `errors` array if available, a handy shortcut to display error messages

<code-title level="4">

`resetField: (state?: Partial<FieldState>) => void`

</code-title>

Resets the field's validation state, reverts all `meta` object to their default values and clears out the error messages, it will also reset the field value to it's initial value. Note that no error messages will be generated if the initial value is invalid after reset, the `valid` flag will be then set to `true` in that case.

Note that it is unsafe to use this function as an event handler directly, check the following snippet:

```vue
<!-- ⛔️ Unsafe -->
<button @click="resetField">Reset</button>

<!-- ✅  Safe -->
<button @click="resetField()">Reset</button>
```

You can use `resetField` to update the fields' current value to something other than its initial value,

```vue
<button @click="resetField({ value: 'new value' })">Reset</button>
```

<code-title level="4">

`handleReset: () => void`

</code-title>

Similar to `resetField` but it doesn't accept any arguments and can be safely used as an event handler. The values won't be validated after reset.

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

`handleChange: (evt: Event | any, shouldValidate?: boolean) => void`

</code-title>

Updates the field value, and validates the field vt default. Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

You can update the field value without validation by passing `false` as a second argument.

<code-title level="4">

`handleBlur: (evt: Event | any) => void`

</code-title>

Validates the field by default unless explicitly [specified by validation triggers](/guide/components/validation#customizing-validation-triggers). Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the `touched` meta flag to true

Because this handler doesn't set the field value, it might not report validation correctly if other events are unspecified or disabled.

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
