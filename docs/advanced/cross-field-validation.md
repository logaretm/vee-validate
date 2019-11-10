# Cross Field Validation

There are a lot of terms to describe this use case, so we will just use an example. Consider a `password` field and a `confirmation` field, both fields must match each other but unlike the validation scenarios we encountered we now actually have a dependency between two fields, as one must match the other.

## Targeting other fields

vee-validate handles such rules given that you properly do the following:

- Wrap the fields within the same `ValidationObserver` component.
- The target field must have a `name` or `vid` prop.
- Properly reference the target field `name` or `vid` value in the rules of the other.

This can be confusing at first, but let's build up our sample from scratch, so we have those two fields:

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

First we need to wrap them both in a `ValidationObserver` component:

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

The validation observer here acts as an broker for those fields, it allows them to discover each other and be able to reference one another.

Now we need to create our rule which is straight forward:

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

This rule checks if the field's `value` matches the target param value, which wouldn't work if we do this:

```vue
<ValidationProvider rules="required|password:confirm" v-slot="{ errors }">
  <input type="password" v-model="password">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

This doesn't work because vee-validate does not know you are trying to reference another field's value, so the param value is fixed to always be "confirm".

We need to add `@` at the beginning of a param to signal to vee-validate that it should substitute the param with the target field value. Now instead of getting a static "confirm" string, you will get the field's value instead.

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

Here is an example of what we just did:

@[example](cross-field-password)

:::tip
Note that the `password` rule we created is not special in any way, it just checks if two strings are the same. You can use the `@` to reference fields values in any rule you create, there is no limitation on that.
:::

## Targeting multiple fields

You are not limited to targeting just 1 field, you can target as many as you like provided that you use the proper syntax to reference that field.

Let's try another example that's slightly more complex to solidify this concept.

Imagine having a field whose value must be between two other fields, our `between` rule can be as simple as this:

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

Again we make sure to wrap our Providers within the same `ValidationObserver` so they can reference each other.

@[example](cross-field-between)
