---
title: useField
description: API reference for the useField composition API function
menuTitle: useField()
order: 5
---

# useField

`useField` is a custom composition API function that allows you to create data models that's automatically validated that you can then use to build your own custom input components with validation capabilities. It is very useful if you plan to build a UI component library that needs to have validation capabilities. In other words it acts as a primitive to allow you to compose validation logic into your components.

The most basic usage looks like this:

```vue
<template>
  <div>
    <input v-model="value" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';

export default {
  setup() {
    // a simple `name` field with basic required validator
    const { value, errorMessage } = useField('name', inputValue => !!inputValue);

    return {
      value,
      errorMessage,
    };
  },
};
</script>
```

Whenever the `value` ref is updated it will be validated and the `errorMessage` ref will be automatically filled with the first error message. Usually you would bind the `value` ref to your inputs using `v-model` or any other means and whenever you want to validate your field you update the `value` binding with the new value.

Additionally you can use `yup` as a validator:

```js
import { useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const { value, errorMessage } = useField('email', yup.string().email().required());

    return {
      value,
      errorMessage,
    };
  },
};
```

You are responsible for when the field validates, blurs or when its value changes. This gives you greater control over the `Field` component which may include or implement sensible defaults for most common use cases.

## Usage with TypeScript

You can use `useField` with typescript and type the field's value type to ensure safety when manipulating it's value. The `useField` function is a generic function that receives the value type and applies it on the various interactions you have with its API.

```ts
const { value, resetField } = useField<string>('email', yup.string().email());

value.value = 1; // ⛔️  Error
value.value = 'test@example.com'; // ✅

resetField({
  value: 1, // ⛔️  Error
});
resetField({
  value: 'test@example.com', // ✅
});
```

## API Reference

The full signature of the `useField` function looks like this:

```ts
interface FieldOptions {
  initialValue?: any; // the initial value, cannot be a ref
  validateOnMount?: boolean; // if the field should be validated when the component is mounted
  validateOnValueUpdate?: boolean; // if the field should be validated when the value changes (default is true)
  bails?: boolean; // if the field validation should run all validations
  label?: string; // A friendly name to be used in `generateMessage` config instead of the field name
  type?: string; // The input type, can be any string. Toggles specific toggle mode for `checkbox`
  checkedValue?: string; // Used the input type is `checkbox` or `radio` otherwise ignored
  uncheckedValue?: string; // Used the input type is `checkbox` otherwise ignored
  standalone?: boolean; // Excludes the field from participating in any `Form` or `useForm` contexts, useful for creating inputs that do contribute to the `values`, In other words, the form won't pick up or validate fields marked as standalone
}

interface ValidationResult {
  errors: string[];
  valid: boolean;
}

interface FieldState {
  value: any;
  dirty: boolean;
  touched: boolean;
  errors: string[];
}

type useField = (
  fieldName: MaybeRef<string>,
  rules: RuleExpression,
  opts?: FieldOptions
) => {
  name: string; // The field name
  value: Ref<any>; // the field's current value
  meta: FieldMeta;
  errors: Ref<string[]>; // all error messages
  errorMessage: Ref<string | undefined>; // the first error message
  resetField: (state?: Partial<FieldState>) => void; // resets errors and field meta, updates the current value to its initial value
  validate: () => Promise<ValidationResult>; // validates and updates the errors and field meta
  handleChange: (e: Event, shouldValidate?: boolean) => void; // updates the value and triggers validation
  handleBlur: (e: Event) => void; // updates the field meta associated with blur event
  setValidationState: (v: ValidationResult) => ValidationResult; // updates the field state
  checked: ComputedRef<boolean> | undefined; // Present if input type is checkbox
};
```

The validation rules can be either a string, object, function or a yup schema:

```js
// Globally defined rules with `defineRule`, Laravel-like syntax
useField('password', 'required|min:8');

// Globally defined rules object
useField('password', { required: true, min: 8 });

// Simple validation function
useField('password', value => {
  if (!value) {
    return 'password is required';
  }

  if (value.length < 8) {
    return 'password must be at least 8 characters long';
  }

  return true;
});

// Yup validation
useField('password', yup.string().required().min(8));
```

### Composable API

The following sections documents each available property on the `useField` composable.

<code-title level="4">

`name: string`

</code-title>

The field name, this is a static string and cannot be changed.

<code-title level="4">

`value: Ref<any>`

</code-title>

A reactive reference to the field's current value, can be changed and will trigger validation by default unless disabled by the `validateOnValueUpdate` option.

```js
const { value } = useField('field', value => !!value);

value.value = 'hello world'; // sets the value and validates the field
```

You can also bind it with `v-model` to get two-way value binding with validation.

<code-title level="4">

`meta: FieldMeta`

</code-title>

Contains useful information/flags about the field status, should be treated as **read only**.

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

**usage**

```js
const { meta } = useField('field', value => !!value);

meta; // { valid: true, invalid: false, dirty: true, .... }
```

<code-title level="4">

`errors: Ref<string[]>`

</code-title>

A reactive reference containing all error messages for the field, should be treated as **read only**

```js
const { errors } = useField('field', value => !!value);

errors.value; // ['field is not valid']
```

<code-title level="4">

`errorMessage: ComputedRef<string | undefined>`

</code-title>

A computed reference that returns the first error in the `errors` array, a handy shortcut to display error messages

```js
const { errorMessage } = useField('field', value => !!value);

errorMessage.value; // 'field is not valid' or undefined
```

<code-title level="4">

`resetField: (state?: Partial<FieldState>) => void`

</code-title>

Resets the field's validation state, reverts all `meta` object to their default values and clears out the error messages. It also updates the field value to its initial value without validating them.

```js
const { resetField } = useField('field', value => !!value);

// reset the field validation state and its initial value
resetField();
// reset the field validation state and updates its value
resetField({
  value: 'new value',
});
```

Note that it is unsafe to use this function as an event handler directly, check the following snippet:

```vue
<!-- ⛔️ Unsafe -->
<button @click="resetField">Reset</button>

<!-- ✅  Safe -->
<button @click="resetField()">Reset</button>
```

You can also use `handleReset` which is a safe alternative for `resetField`.

<code-title level="4">

`handleReset: () => void`

</code-title>

Similar to `resetField` but it doesn't accept any arguments and can be safely used as an event handler. The values won't be validated after reset.

```js
const { handleReset } = useField('field', value => !!value);

// reset the field validation state and its initial value
handleReset();
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

It sets the `dirty` meta flag to `true`

```vue
<template>
  <input @change="handleChange" type="text" />
</template>

<script>
export default {
  setup() {
    const { handleChange } = useField('field');

    handleChange('new value'); // update field value and validate it
    handleChange('new value 2', false); // update field value without validating it (you have to turn off validateOnValueUpdate)

    return {
      handleChange,
    };
  },
};
</script>
```

<code-title level="4">

`handleBlur: (evt: Event | any) => void`

</code-title>

Sets the `touched` meta flag to `true`

```vue
<template>
  <input @blur="handleBlur" type="text" />
</template>

<script>
export default {
  setup() {
    const { handleBlur } = useField('field');

    return {
      handleBlur,
    };
  },
};
</script>
```

<code-title level="4">

`setValidationState: (state: { errors: string[] }) => void`

</code-title>

Sets the errors array for the fields and updates all the associated meta tags like `valid` and `invalid`, if the array is empty it is considered as marking the field valid.

```js
const { setValidationState } = useField('field', value => !!value);

// set the field as invalid and update errors
setValidationState({ errors: ['something is not right'] });

// set the field as valid and clears errors
setValidationState({ errors: [] });
```

<code-title level="4">

`setTouched: (isTouched: boolean) => void`

</code-title>

Sets the `touched` meta flag for this field, useful to create your own `blur` handlers

```js
const { setTouched } = useField('field', value => !!value);

// mark the field as touched
setTouched(true);
```

<code-title level="4">

`checked: ComputedRef<boolean> | undefined`

</code-title>

A computed property that indicates if the field should be checked or unchecked, only available if `type=checkbox` or `type=radio` in field options. Useful if you are creating [custom checkboxes](/examples/custom-checkboxes).

```js
const { checked } = useField('field', ..., {
  type: 'checkbox',
  valueProp: 'Checkbox value'
});

checked.value; // true or false
```

For more information on how you might use the `checked` property, check the [custom checkboxes example](/examples/custom-checkboxes).
