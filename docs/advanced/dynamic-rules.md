# Dynamic Rules

Sometimes your validation rules may change depending on arbitrary reasons in you app, for example maybe you have a field that is required when the user checks a box.

The `ValidationProvider` component automatically watches the `rules` prop and whenever it changes it will trigger validation **if the field has been validated before**. Meaning not only you can create very versatile form validation rules but you can dynamically apply them.

So you can do the following:

```vue{4}
<template>
  <div>
    <ValidationProvider :rules="`${required ? 'required' : ''}`" v-slot="{ errors }">
      <input v-model="value" type="text" />
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
    <div><input type="checkbox" v-model="required" /> Is Required?</div>
  </div>
</template>

<script>
export default {
  data: () => ({
    value: '',
    required: false
  })
};
</script>
```

The previous sample will work, but it is very verbose. You can utilize the [**rules object expression**](./rules-object-expression.md) for better readability and versatility, here such an example:

@[example](dynamic-rules)
