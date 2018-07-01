# v-validate directive

The `v-validate` directive is the main way to validate your inputs, the directive accepts either a string or an object as a value.

If a string was passed, it must be a valid rules string, that is the validation rules separated by pipes '|'.

```vue
  <input v-validate="'required|email'" name="field" type="text">
```

If an object was passed, it must contains properties of the rules to be used and the value would be their params in an array or a single value if it accepts a single parameter.

```js
// String
const expression = 'required|regex:^[0-9]+';

const expression = {
  // parameter-less rules take a boolean value.
  required: true,
  // single parameter rules take a single value.
  regex: /.(js|ts)$/,
  // multiple parameter rules take a single array.
  in: [1, 2, 3]
};
```

## directive args

The directive also accepts an arg, that denotes the name of the vue model to validate, or a computed property.

```vue
  <input v-model="email" v-validate:email="'required|email'" name="field" type="text">
```

```js
export default {
  data: () => ({
    email: ''
  })
};
```

However the arg is entirely optional. Additionally, `v-validate` checks if the input/component has `v-model` assigned to it, and treats that expression as the arg. But keep in mind that the arg must be a simple dot notation string, and it must be present on the vue instance.

::: tip
  You might ask when to use arg at all? since `v-model` can be detected. A valid situation is when you need to validate a computed property.
:::

## directive modifiers

### immediate

You can use `.immediate` modifier to immediately validate the field as soon as the page loads.

```vue
<template>
  <input v-model="email" v-validate.immediate="'required|email'" name="field" type="text">
</template>

<script>
export default {
  data: () => ({
    email: ''
  })
};
</script>
```

### continues

By default vee-validate uses a `fastExit` strategy when testing the field rules, meaning when the first rule fails it will stop and will not test the rest of the rules. You can use the `.continues` modifier to force this behavior to test all rules regardless of their result.

This snippet uses the modifier to display all errors for a field which is a common UI practice.

```vue
<template>
  <div>
    <input v-model="email" v-validate.continues="'required|email'" name="field" type="text">
    <ul>
      <li v-for="error in errors.collect('field')">{{ error }}</li>
    </ul>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: ''
  })
};
</script>
```

You can [configure](/configuration.md) `fastExit` option to `false` to enable this behavior for all the fields.

::: tip
  `.continues` modifier has also another use, it disables the `required` rule check, meaning the fields that are not required but have an empty value will not be skipped. So make sure your custom rules are able to handle empty values as well.
:::

### bails

Inversely if you have configured `fastExit` to be `false` then you could make specific fields bail or stop testing the validation rules after the first failure.

```vue
<template>
  <div>
    <input v-model="email" v-validate.bails="'required|email'" name="field" type="text">
    <span>{{ errors.first('email') }}</span>
  </div>
</template>

<script>
export default {
  data: () => ({
    email: ''
  })
};
</script>
```