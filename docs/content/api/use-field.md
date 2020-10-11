---
title: useField
description: API reference for the useField composition API function
menuTitle: useField()
order: 4
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

## API Reference

The full signature of the `useField` function looks like this:

```typescript
interface FieldOptions {
  initialValue: any; // the initial value, cannot be a ref
  disabled: MaybeReactive<boolean>; // if the input is disabled, can be a ref
  validateOnMount?: boolean; // if the field should be validated when the component is mounted
  bails?: boolean; // if the field validation should run all validations
  form?: FormController; // the Form object returned from `useForm` to associate this field with
  label?: string; // A friendly name to be used in `generateMessage` config instead of the field name
}

interface ValidationResult {
  errors: string[];
}

type useField = (
  fieldName: MaybeReactive<string>,
  rules: RuleExpression,
  opts?: Partial<FieldOptions>
) => {
  name: string; // The field name
  value: Ref<any>; // the field's current value
  meta: FieldMeta;
  errors: Ref<string[]>; // all error messages
  errorMessage: Ref<string | undefined>; // the first error message
  disabled: Ref<boolean>; // if the field is currently disabled
  reset: () => void; // resets errors and field meta
  validate: () => Promise<ValidationResult>; // validates and updates the errors and field meta
  handleChange: (e: Event) => void; // updates the value
  handleInput: (e: Event) => void; // updates the field meta associated with input event and syncs the field value
  handleBlur: (e: Event) => void; // updates the field meta associated with blur event
  setValidationState: (v: ValidationResult) => ValidationResult; // updates the field state
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

#### `name: string`

The field name, this is a static string and cannot be changed.

#### `value: Ref<any>`

A reactive reference to the field's current value, can be changed and will trigger validation by default unless disabled by the `validateOnValueUpdate` option.

```js
const { value } = useField('field', value => !!value);

value.value = 'hello world'; // sets the value and validates the field
```

You can also bind it with `v-model` to get two-way value binding with validation.

#### `meta: Record<string, boolean>`

Contains useful information/flags about the field status, should be treated as **read only**.

```js
const { meta } = useField('field', value => !!value);

meta; // { valid: true, invalid: false, dirty: true, .... }
```

#### `errors: Ref<string[]>`

A reactive reference containing all error messages for the field, should be treated as **read only**

```js
const { errors } = useField('field', value => !!value);

errors.value; // ['field is not valid']
```

#### `errorMessage: ComputedRef<string | undefined>`

A computed reference that returns the first error in the `errors` array, a handy shortcut to display error messages

```js
const { errorMessage } = useField('field', value => !!value);

errorMessage.value; // 'field is not valid' or undefined
```

#### `disabled: Ref<boolean>`

A reactive reference to the field's current disabled state, this allows/prevents the field from participating in it's owning form's validation state and doesn't block the submission handlers even if invalid.

```js
const { disabled } = useField('field', value => !!value);

disabled.value; // true or false
```

#### `reset: () => void`

Resets the field's validation state, reverts all `meta` object to their default values and clears out the error messages. Doesn't change the field's value.

```js
const { reset } = useField('field', value => !!value);

// reset the field validation state
reset();
```

#### `validate: () => Promise<{ errors: string[] }>`

Validates the field's current value and returns a promise that resolves with an object containing the error messages emitted by the various rule(s).

```js
const { validate } = useField('field', value => !!value);

// trigger validation
await validate();
```

#### `handleChange: (evt: Event | any) => void`

Updates the field value, and validates the field. Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the following meta flags: `dirty` and `pristine`

```vue
<template>
  <input @change="handleChange" type="text" />
</template>

<script>
export default {
  setup() {
    const { handleChange } = useField('field');

    handleChange('new value'); // update field value and validate it

    return {
      handleChange,
    };
  },
};
</script>
```

#### `handleInput: (evt: Event | any) => void`

Updates the field value, **but does not validate the field**. Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the following meta flags: `dirty` and `pristine`

```vue
<template>
  <input @input="handleInput" type="text" />
</template>

<script>
export default {
  setup() {
    const { handleInput } = useField('field');

    handleInput('new value'); // update field value

    return {
      handleInput,
    };
  },
};
</script>
```

#### `handleBlur: (evt: Event | any) => void`

Validates the field by default unless explicitly [specified by validation triggers](/guide/validation#customizing-validation-triggers). Can be used as an event handler to bind on the field. If the passed argument isn't an event object it will be used as the new value for that field.

It sets the following meta flags: `touched` and `untouched`

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

Because this event doesn't set the field value, it might not report validation correctly if other events are unspecified or disabled.

#### `setValidationState: (state: { errors: string[] }) => void`

Sets the errors array for the fields and updates all the assoicated meta tags like `valid` and `invalid`, if the array is empty it is considered as marking the field valid.

```js
const { setValidationState } = useField('field', value => !!value);

// set the field as invalid and update errors
setValidationState({ errors: ['something is not right'] });

// set the field as valid and clears errors
setValidationState({ errors: [] });
```
