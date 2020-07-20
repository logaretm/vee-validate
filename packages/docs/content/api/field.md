---
title: <Field />
description: API reference for the Field component
---

# Field

The `<Field />` component is an extremely flexible component that makes rendering input fields easy and intuitive, a simple text input looks like this:

```vue
<template>
  <Field name="field" as="input" type="text">
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

The `Field` component allows you to render practically anything and gives you complete flexibility and control over how your fields are rendered.

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

For validation to work, the rendered tag with `as` prop must conform to the events that the `Field` component listens for, you can view a list of these in the [Validation Behavior](../guide/validation#validation-behavior)

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

| Prop      | Type                     | Required/Default | Description                                                                           |
| :-------- | :----------------------- | :--------------- | :------------------------------------------------------------------------------------ |
| as        | `string`                 | `"span"`         | The element to render as a root node                                                  |
| name      | `string`                 | Required         | The field's name, must be inside `<Form />`                                           |
| rules     | `object|string|Function` | `null`           | The field's validation rules                                                          |
| immediate | `boolean`                | `false`          | If true, field will be validated on mounted                                           |
| bails     | `boolean`                | `true`           | Stops validating as soon as a rule fails the validation                               |
| disabled  | `disabled`               | `false`          | Disables validation and the field will no longer participate in the parent form state |

### Slots

#### default

The default slot gives you access to the following props:

| Scoped Prop  | Type                     | Description                                                                                                                  |
| :----------- | :----------------------- | :--------------------------------------------------------------------------------------------------------------------------- |
| field        | `FieldBindingObject`     | A collection of listeners and attributes that handles the validation cycle, check the [type reference](#fieldbindingobject). |
| aria         | `Record<string, string>` | Aria-attributes that improves a11y for the field                                                                             |
| meta         | `FieldMeta`              | A collection of boolean values to help manage field UI across different states, check the [FieldMeta reference](#fieldmeta)  |
| errors       | `string[]`               | The field's error messages                                                                                                   |
| errorMessage | `string`                 | The first error message in `errors` messages                                                                                 |
| validate     | `Function`               | Validates the field's current value and updates its validation state messages                                                |
| reset        | `Function`               | Resets the validation state of the field                                                                                     |
| handleChange | `Function`               | Updates the field current value and associated field meta                                                                    |

Check the sample above for rendering with scoped slots

### Types

#### FieldBindingObject

The `field` prop on the scoped slot has the following typescript type:

```typescript
interface FieldBindingObject {
  name: string; // matches the name prop on the field component
  disabled: boolean; // matches the disabled prop on the field component
  onInput: Function; // updates the current value on `input` events
  onChange: Function; // updates the current value on `change` event
  ['onUpdate:modelValue']: Function; // updates the current value if the field uses a v-model
  onBlur: Function; // Updates field meta state on blur
  value: any; // the current field value
}
```

#### FieldMeta

the `meta` prop on the scoped slot has the following typescript type:

```typescript
interface FieldMeta {
  untouched: boolean; // if the field wasn't blurred
  touched: boolean; // if the field is blurred
  dirty: boolean; // if the field was manipulated
  pristine: boolean; // if the field wasn't manipulated
  valid: boolean; // if the field is valid
  invalid: boolean; // if the field isn't valid
  passed: boolean; // if the field is valid and has been validated explicitly or by user manipulation
  failed: boolean; // if the field is invalid and has been validated explicitly or by user manipulation
  validated: boolean; // if the field was validated either explicitly or by user manipulation
  pending: boolean; // if the field is pending async validation
  changed: boolean; // if the field value was changed since it's initial value
}
```
