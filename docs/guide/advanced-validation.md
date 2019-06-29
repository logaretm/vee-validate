# Advanced Validation

Previously you learned how to add validation rules to vee-validate, in this guide you will learn how to use the full API to create more powerful and complex rules.

## Cross-Field validation

Some rules validity are dependent on other fields values, a rule like `confirmed` will need access to another field's value and compare it with the current one to be able to determine validity.

Rules parameters can be marked as a **field target** by specifying a `isTarget` for that parameters. For example, this is how a basic password confirmation rule would look like:

```js
import { extend } from 'vee-validate';

extend('password', {
  validate: (value, { other }) => value === other,
  message: 'The password confirmation does not match.',
  params: [
    { name: 'other', isTarget: true }
  ]
});
```

```vue{2,10}
<ValidationProvider
  rules="required|password:confirmation"
  v-slot="{ errors }"
>
  <input v-model="password" type="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider
  vid="confirmation"
  rules="required"
  v-slot="{ errors }"
>
  <input v-model="confirm" type="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

You will notice in your validation function that the `other` parameter is not `'confirmation'` string, but rather the confirmation field value. When a parmeter is marked as `isTarget`, vee-validate replaces the parameter value with the target field value.

Here is a working snippet of the last example:

<ValidationProvider
  rules="required|password:confirmation"
  v-slot="{ errors }"
>
  <input v-model="values.pass" type="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider
  vid="confirmation"
  rules="required"
  v-slot="{ errors }"
>
  <input v-model="values.confirm" type="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

## Required Rules

You will notice that the `required` rule is special. The default behavior in vee-validate is that when a field is **not required** and has an empty value it skips validation for that field.

### Empty values

values that are considered **empty** are:

- Empty Strings.
- `null` or `undefined`.
- Empty arrays.

:::warning
Notice that `false` is missing from this list, as it is considered a valid non-empty value. For example radio button with a Yes/No choices is considered valid when user selects either of those options.
:::

### Creating required-like rules

When calling `extend` you need to set the `computesRequired` option on the extension options and the `validate` function should return an object with both `valid` and `required` booleans present.

Consider this rule, the input will be required if the `test` param is equal to `'yes'`.

```js{2,6}
extend('requiredIf', {
  computesRequired: true,
  message: 'This field is required.',
  params: ['test'],
  validate: (value, { test }) => {
    const isEmpty = !!(!value || value.length === 0);
    const isRequired = test === 'yes';

    return {
      valid: !isRequired ? true : !isEmpty,
      required: isRequired
    };
  }
});
```

```vue
<template>
  <div>
    <span>Test Value: {{ test }}</span>
    <button @click="toggle">Toggle</button>
    <ValidationProvider rules="requiredIf" v-slot="{ errors }">
      <input v-model="value" type="text">
      <span id="error">{{ errors[0] }}</span>
    </ValidationProvider>
  </div>
</template>

<script>
export default {
  data: () => ({
    values: {},
    test: 'yes'
  }),
  methods: {
    toggle () {
      this.test = this.test === 'yes' ? 'no' : 'yes';
    }
  }
};
</script>
```

<div>
  <span>Test Value: {{ test }}</span>
  <button @click="toggle">Toggle</button>
  <ValidationProvider :rules="{ requiredIf: { test } }" v-slot="{ errors }">
    <input v-model="values.require" type="text">
    <span id="error">{{ errors[0] }}</span>
  </ValidationProvider>
</div>

:::tip
  You can combine this with `isTarget` to create rules coupled with with cross-field validation. Check the `required_if` rule implementation.
:::

<script>
window.$extendVee('password', {
  validate: (value, { other }) => value === other,
  params: [
    { name: 'other', isTarget: true }
  ],
  message: 'The password confirmation does not match.',
});

window.$extendVee('requiredIf', {
  computesRequired: true,
  message: 'This field is required.',
  params: ['test'],
  validate: (value, { test }) => {
    const isEmpty = !!(!value || value.length === 0);
    const isRequired = test === 'yes';

    return {
      valid: !isRequired ? true : !isEmpty,
      required: isRequired
    };
  }
});

export default {
  data: () => ({
    values: {},
    test: 'yes'
  }),
  methods: {
    toggle () {
      this.test = this.test === 'yes' ? 'no' : 'yes';
    }
  }
};
</script>
