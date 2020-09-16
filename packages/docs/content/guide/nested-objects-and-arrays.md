---
title: Nested Objects and Arrays
description: Structuring forms in nested paths in objects or arrays
---

# Nested Objects and Arrays

vee-validate supports nested objects and arrays, using field names syntaxes to indicate a field's path. This allows you to structure forms easily to make data mapping straightforward without having to deal with flat form values.

## Nested Objects

You can specify a field to be nested in an object using dot paths, like what you would normally do in JavaScript do access a nested property. The field `name` prop acts as the path for that field:

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="links.twitter" type="url" />
    <Field name="links.github" type="url" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

Submitting the previous form would result in the following values being passed to your handler:

```js
{
  "links": {
    "twitter": "https://twitter.com/logaretm",
    "github": "https://github.com/logaretm"
  }
}
```

You are not limited to a specific depth, you can nest as much as you like.

## Nested Arrays

Similar to objects, you can also nested your values in an array, using dot paths as well but using numbers as property key instead.

Here is the same example as above but in array format:

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="links.0" type="url" />
    <Field name="links.1" type="url" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

Submitting the previous form would result in the following values being passed to your handler:

```js
{
  "links": [
    "https://twitter.com/logaretm",
    "https://github.com/logaretm"
  ]
}
```

<doc-tip type="warn">

vee-validate will only create nested arrays if the path expression is a complete number, for example paths like `some.nested.0path` will not create any arrays because the `0path` key is not a number. However `some.nested.0.path` will create the array with an object as the first item.

</doc-top>

## Avoiding Nesting

If your fields' names are using the dot notation and you want to avoid the nesting behavior which is enabled by default, all you need to do is wrap your field names in square brackets (`[]`) to disable nesting for those fields.

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="[links.twitter]" type="url" />
    <Field name="[links.github]" type="url" />

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

Submitting the previous form would result in the following values being passed to your handler:

```js
{
  "links.twitter": "https://twitter.com/logaretm",
   "links.github": "https://github.com/logaretm"
  ]
}
```

## Caveats

- vee-validate creates the paths inside the form data automatically but lazily, so initially your form values won't contain the fields values unless you provide initial values for them. It might be worthwhile to provide initial data for your forms with nested paths.
- When fields get unmounted like in the case of conditional rendered fields with `v-if` or `v-for`, their path will be destroyed just as it was created if they are the last field in that path. So you need to be careful while accessing the nested field in `values` inside your submission handler or the `Form` component or `useForm` composable.
- When referencing errors using `errors` object on the `Form` slot props or the `ErrorMessage` component, make sure to reference the field name in the exact same way you set it on the `name` prop for that field. So even if you avoid nesting you should always include the square brackets.
