# Model-less Validation

The `ValidationProvider` requires having `v-model` on your input elements. However, that does not mean that inputs like `file` inputs cannot be validated.

:::tip
While the `file` input is the most common field not to use a `v-model`.This guide applies to any type of input, not just the `file` type.
:::

## HTML File Validation

To validate a file input you can use the `validate` function on the slot prop as an event handler, and use it on the `change` event to validate the file input.

@[example](file-validation)

If you need to manually trigger the validation because you need to do some processing along with validating the file (like uploading it) you can use `$refs` to use the `validate` method:

@[example](file-validation-manual)

## Custom Component File Validation

There are a couple of differences when using a custom component that acts as a file input:

- Vue Input components generally emit the `input` event rather than `change`.
- Vue Input components emit the value directly rather than an Event Object.

In that case, you can send the emitted value directly to the `validate` method and it should work the same.

:::tip
The available file rules like `image` and `size` accept a single `File` or an array of `File` instances, so when using a custom component or running validation manually you might be careful not send in other value types. Otherwise you can create your own rules to handle your case.
:::

There are more complicate scenarios when creating complex components like a dropzone-like gallery uploader, First you should be aware how the `ValidationProvider` does things.

## Value Synchronization

The `ValidationProvider` checks your inputs values on each re-render and if the value changes it will store a reference to that value. Once validation is triggered that last value will be used as the current value to validate.

You can synchronize the value manually using `ValidationProvider.syncValue()` method, which allows you to pass in a value that will be used as the current value for the next validation attempt.

That means in the previous examples if you change the value for whatever reason you might need to sync it again like this:

```js
this.$refs.provider.syncValue(newValue);
```

This will not trigger validation.

## Using Computed Setters

You can use computed setters for cases where your input manipulates multiple states rather than one bound with `v-model`. For example consider a `fullName` input that changes both the `firstName` and `lastName` values:

```vue
<template>
  <ValidationProvider rules="required" name="fullName" v-slot="{ errors }">
    <input type="text" />
    <p>{{ errors[0] }}</p>
  </ValidationProvider>
</template>

<script>
export default {
  data: () => ({
    firstName: '',
    lastName: ''
  })
};
</script>
```

You won't be able to bind `v-model` on a single input for both of these states as `v-model` have a 1:1 relation with data items, instead you can use [Vue's computed setters](https://vuejs.org/v2/guide/computed.html#Computed-Setter) to achieve binding with `v-model` while updating the state accordingly.

@[example](computed-setters)
