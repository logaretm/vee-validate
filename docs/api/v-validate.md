## [v-validate Directive](#directive)

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
  // parameterless rules take a boolean value.
  required: true,
  // single parameter rules take a single value.
  regex: /.(js|ts)$/,
  // multiple paramter rules take a single array.
  in: [1, 2, 3]
};
```

## [args](#directive-args)

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

However the arg is entirely optional. Additionaly, `v-validate` checks if the input/component has `v-model` assigned to it, and treats that expression as the arg. But keep in mind that the arg must be a simple dot notation string, and it must be present on the vue instance.

> You might ask when to use arg at all? since `v-model` can be detected. A valid situation is when you need to validate a computed property.

## [modifiers](#directive-modifiers)

You can use `.initial` modifier to force the validation of the field initial value.

```vue
  <input v-model="email" v-validate.initial="'required|email'" name="field" type="text">
```

```js
export default {
  data: () => ({
    email: ''
  })
};
```