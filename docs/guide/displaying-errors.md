# Displaying Errors

The `errors` array exposed on the `ValidationProvider` is a simple array containing error messages for the field as strings, you can manipulate the displayed field name and how many errors should be displayed for that field.

## Single error message

Typically you would want to display one error at a time for your fields, which is the first item in the `errors` array.

```vue{3}
<ValidationProvider rules="required" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

## Multiple error messages

You will notice that only 1 error is generated. this is because vee-validate tries to be efficient by stopping validation on the first failure it encounters for any rule. to disable this behavior and force the validation to test against all rules you can provide `bails` prop set to `false` on the `ValidationProvider`.

```vue{4}
<ValidationProvider rules="required|min:3|alpha" v-slot="{ errors }" :bails="false">
  <input v-model="value" type="text">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

Additionally you can disable this behavior for all Providers by using the `bails` config:

```js
import { configure } from 'vee-validate';

// Disable fast-exit behavior for all providers in the app.
configure({ bails: false });
```

:::tip
The `bails` prop takes precedence over the global config, that means you can have fields with either behavior at the same time in your app by passing a `bails` prop explicitly to those fields.
:::

Now that we've setup multiple errors generation properly, you can iterate over the `errors` array to display them with `v-for`:

```vue{4}
<ValidationProvider rules="required|min:3|alpha" v-slot="{ errors }" :bails="false">
  <input v-model="value" type="text">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

You can check it out in this sample:

<StyledProvider
rules="required|min:3|alpha"
v-slot="{ errors }"
:bails="false">

  <input v-model="values.multiple" type="text" placeholder="type something">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</StyledProvider>

### Non-Required Fields

Non-required fields are fields that do not have the `required` rule or attribute. You will notice that vee-validate by default excludes those fields from validation if they have empty values, which are:

- Empty Array.
- Empty String.
- `null`
- `undefined`

Note that `false` is considered a valid non-empty value.

Consider this **optional field**:

```vue
<ValidationProvider rules="min:3|numeric" v-slot="{ errors }" :bails="false">
  <input v-model="value" type="text">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

Even though the field is configured with `bails` set to `false`, it will still skip the field (consider it valid) if it has empty value. You can test this in the previous sample, fill it with a value and clear it and it will still hold the errors.

<StyledProvider
rules="min:3|numeric"
v-slot="{ errors }"
:bails="false">
  <input v-model="values.multiple" type="text" placeholder="type something">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</StyledProvider>

Now this might not be what you want, you may need to run all rules regardless of the field requirement status. While this is rare, you could still disable this behavior by setting `skipIfEmpty` prop to false.

```vue{2,3}
<ValidationProvider rules="min:3|numeric" :skipIfEmpty="false" :bails="false" v-slot="{ errors }">
  <input v-model="value" type="text">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

You can test this in the following input, fill it with a value then clear it and it would still have the errors even when empty:

<StyledProvider
  rules="min:3|numeric"
  v-slot="{ errors }"
  :skipIfEmpty="false"
  :bails="false"
>
  <input v-model="values.bailsButForced" type="text" placeholder="Test me">
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</StyledProvider>

You can configure this behavior globally, by setting `skipOptional` config value.

## Customizing the field name

So far you only saw `{_field_}` placeholder used in the error messages to refer to the field, you can change that by specifying a `name` prop on the `ValidationProvider`.

```vue{2}
<ValidationProvider name="first name" rules="required|min:2" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

<StyledProvider
rules="required|min:2"
name="first name"
v-slot="{ errors }"
>
  <input v-model="values.name" type="text" placeholder="type something...">
  <span>{{ errors[0] }}</span>
</StyledProvider>

## Messages Format

Validation messages in vee-validate can either be a `string` or a function that returns a string for more complex messages.

### String Interpolation

String messages can be plain like:

```
This field is required.
```

Or it can be a **template string** like this:

```
The {_field_} is required.
```

Template messages are interpolated before display to replace the placeholders, placeholders are surrounded by `{placeholder}`. You can use the rule's parameter names as placeholders.

For example consider this rule:

```js
import { extend } from 'vee-validate';

extend('lengthBetween', {
  validate: (value, { min, max }) => {
    const length = value && value.length;

    return length >= min && length <= max;
  },
  params: ['min', 'max'],
  message: 'The {_field_} length must be between {min} and {max}'
});
```

```vue
<ValidationProvider name="code" rules="required|lengthBetween:3,6" v-slot="{ errors }">
  <input v-model="value" type="text">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

<StyledProvider
  name="code"
  rules="required|lengthBetween:3,6"
  v-slot="{ errors }"
>
  <input v-model="values.template" type="text" placeholder="Type something...">
  <span>{{ errors[0] }}</span>
</StyledProvider>

:::tip Parameter Names
You can use any names for your placeholders, except for:

- `{_field_}` which is the field name.
- `{_value_}` which is the field value.
- `{_rule_}` which is the rule name.

Which are provided internally.
:::

### Message Function

Messages can be a function as well, giving you more flexibility over your messages. The function signature looks like this:

```ts
interface ValidationMessageGenerator {
  (field: string, values?: Record<string, any>): string;
}
```

The `field` is the field name, the `values` argument is an object containing the placeholder values used in string interpolation. Meaning it will contain `_value_`, `_field_` and `_rule_` values as well as any other params previously declared.

You can use this feature to create dynamic messages for your rules which is helpful for [providing multiple reasons for failing a rule](./advanced-validation.md#dynamic-messages), or [localization](./localization.md).

---

Now that we have got grasp of the basics, we can learn more about the validation provider.

<script>
export default {
  data: () => ({ values: {} })
};
</script>
