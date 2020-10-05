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

## Recipes

These are some of the common scenarios that you will encounter with `useField`.

### Controlling Validation Events

You will use the `handleChange` function and bind it to the event you want to validate on:

```vue
<template>
  <div>
    <input :value="value" @change="handleChange" />
    <span>{{ errorMessage }}</span>
  </div>
</template>

<script>
import { useField } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const { value, errorMessage, handleChange } = useField('name', yup.string().required().email());

    return {
      value,
      errorMessage,
      handleChange,
    };
  },
};
</script>
```

## API Reference

The full signature of the `useField` function looks like this:

```typescript
interface FieldOptions {
  initialValue: any; // the initial value, cannot be a ref
  disabled: MaybeReactive<boolean>; // if the input is disabled, can be a ref
  immediate?: boolean; // if the field should be validated on mounted
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
  value: any; // the field's current value
  meta: FieldMeta;
  errors: string[]; // all error messages
  errorMessage: string | undefined; // the first error message
  aria: {
    'aria-invalid': 'true' | 'false';
    'aria-describedBy': string;
  };
  reset: () => void; // resets errors and field meta
  validate: () => Promise<ValidationResult>; // validates and updates the errors and field meta
  handleChange: (e: Event) => void; // updates the value
  onBlur: (e: Event) => void; // updates the field meta associated with blur event
  disabled: boolean; // if the field is currently disabled
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
