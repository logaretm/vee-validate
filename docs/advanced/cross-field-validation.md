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
