# Cross Field Validation

There are a lot of terms to describe this use case, cross-field validation is when a validation rule needs to use another field's value to validate the current field.

Consider a `password` field and a `confirmation` field, both fields must match each other but unlike the validation scenarios you've encountered, you now have a dependency between two fields, as one must match the other.

## Targeting other fields

vee-validate handles such rules but **you must do the following**:

- Wrap the fields within the same `ValidationObserver` component.
- The target field must have a `name` or `vid` prop.
- Properly reference the target field `name` or `vid` value in the rules of the other.

This can be confusing at first, you can start by defining those two fields:

```vue
<ValidationProvider rules="required" v-slot="{ errors }">
  <input type="password" v-model="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<!-- You can use vid or name to specify a targetable field -->
<ValidationProvider name="confirm" vid="confirm" rules="required" v-slot="{ errors }">
  <input type="password" v-model="confirmation">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

First you need to wrap them both in a `ValidationObserver` component:

```vue{1,12}
<ValidationObserver>
  <ValidationProvider rules="required" v-slot="{ errors }">
    <input type="password" v-model="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>


  <ValidationProvider name="confirm" rules="required" v-slot="{ errors }">
    <input type="password" v-model="confirmation">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</ValidationObserver>
```

The `ValidationObserver` not only aggregates the fields state, it also allows them to discover each other and be able to reference one another.

Secondly, create the `password` rule, which needs to check if the field value matches the given `target` value:

```js
import { extend } from 'vee-validate';

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password confirmation does not match'
});
```

If you test the rule right away like this:

```vue
<ValidationProvider rules="required|password:confirm" v-slot="{ errors }">
  <input type="password" v-model="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

You will notice that it doesn't work. This is because vee-validate does not know you are trying to reference another field's value, so the param value is fixed to always be "confirm".

To reference another field's value, add a `@` at the beginning of a param to signal to vee-validate that it should substitute the param with the target field value. So instead of getting a static "confirm" string, you will get the field's value instead.

```vue{2}
<ValidationObserver>
  <ValidationProvider rules="required|password:@confirm" v-slot="{ errors }">
    <input type="password" v-model="password">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>


  <ValidationProvider name="confirm" rules="required" v-slot="{ errors }">
    <input type="password" v-model="confirmation">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
</ValidationObserver>
```

You can see the previous sample working here:

@[example](cross-field-password)

:::tip
Note that the `password` rule you created is not special in any way, it just checks if two strings are the same. You can use the `@` to reference fields values in any rule you create, there is no limitation on that.
:::

## Targeting multiple fields

You are not limited to targeting just 1 field, you can target as many as you like provided that you use the proper syntax to reference that field.

Try another example that's slightly more complex to solidify this concept. Imagine having a field whose value must be between two other fields, our `between` rule can be as simple as this:

```js
import { extend } from 'vee-validate';

extend('between', {
  params: ['min', 'max'],
  validate(value, { min, max }) {
    return value >= min && value <= max;
  },
  message: 'This field value must be between {min} and {max}'
});
```

Again, make sure to wrap our Providers within the same `ValidationObserver` so they can reference each other, and make sure you reference the two fields with `@max` and `@min`.

@[example](cross-field-between)

## Target Fields Names

When generating messages for target fields, it is more useful to have their names rather than their values. For example, a password confirmation rule will not typically say the following:

```
Your Password does not match the $P455W0RD
```

It would make more sense to have the target field name instead of its value:

```
Your Password does not match the Password Confirmation
```

VeeValidate does that for you automatically when it interpolates the given message, instead of giving you the target field value, it will give you its display name. This is an example of a rule that uses the placeholder for the `target` param to display the other field's name.

@[example](cross-field-names)

The same applies to all arguments passed to rules, **when a target field is specified, the param placeholder will resolve to the target field name rather than its value**. These are a few examples to help make this clear:

> Using a `between` rule message that looks like this:

```
The field must be between {min} and {max}
```

Assuming you have also these fields:

```vue
<!-- Check the table below for the possible between values ->
<ValidationProvider name="value" rules="between:..." v-slot="{ errors }">
  <input type="number" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider vid="maxValue" name="Min Value" rules="required" v-slot="{ errors }">
  <input type="number" v-model="min">
  <span>{{ errors[0] }}</span>
</ValidationProvider>


<ValidationProvider vid="minValue" name="Max Value" rules="required" v-slot="{ errors }">
  <input type="number" v-model="max">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

The following is a table that shows the `between` rule message in various configurations when coupled with cross-field validation:

| between rule arguments | Generated message                              | Explanation                                                                              |
| ---------------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------- |
| between:3,5            | The field must be between 3 and 5              | Arguments are specified as values are interpolated as is in the message.                 |
| (3, @maxValue)         | The field must be between 3 and Max Value      | The `min` argument is interpolated as is, while the `max` will be the target field name. |
| (@minValue, @maxValue) | The field must between Min Value and Max Value | Both arguments will be interpolated as their corresponding fields display names          |

If you always need the values of target fields in your message, wrap the argument name with `_` like this:

```
The field must be between {_min_} and {_max_}
```

Which will always interpolate the values regardless if cross-field validation is used or not.
