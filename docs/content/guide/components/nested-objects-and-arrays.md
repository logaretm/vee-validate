---
title: Nested Objects and Arrays
description: Structuring forms in nested paths in objects or arrays
order: 4
next: guide/global-validators
---

# Nested Objects and Arrays

vee-validate supports nested objects and arrays, using field name syntax to indicate a field's path. This allows you to structure forms easily to make data mapping straightforward without having to deal with flat form values.

## Nested Objects

You can specify a field to be nested in an object using dot paths, like what you would normally do in JavaScript to access a nested property. The field `name` prop acts as the path for that field:

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

Similar to objects, you can also nest your values in an array, using square brackets just like how you would do it in JavaScript.

Here is the same example as above but in array format:

```vue
<template>
  <Form @submit="onSubmit">
    <Field name="links[0]" type="url" />
    <Field name="links[1]" type="url" />

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

vee-validate will only create nested arrays if the path expression is a complete number, for example, paths like `some.nested[0path]` will not create any arrays because the `0path` key is not a number. However `some.nested[0].path` will create the array with an object as the first item.

</doc-tip>

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
}
```

## Field Arrays <DocBadge title="v4.5" />

Field arrays are a special type of nested array fields, they are often used to collect repeatable pieces of data or repeatable forms. They are often called "repeatable fields".

When dealing with those fields it is better to use `<FieldArray />` component which gives you a few helpers you can use to manage the array fields.

Here is a small example that shows how easy it is to create a repeatable group of fields:

```vue
<template>
  <Form @submit="onSubmit" :initial-values="initialValues">
    <FieldArray name="links" v-slot="{ fields, push, remove }">
      <div v-for="(entry, idx) in fields" :key="entry.key">
        <Field :name="`links[${idx}]`" type="url" />

        <button type="button" @click="remove(idx)">Remove</button>
      </div>

      <button type="button" @click="push({ id: Date.now(), name: '', url: '' })">Add</button>
    </FieldArray>

    <button>Submit</button>
  </Form>
</template>

<script>
export default {
  data: () => ({
    // you can set initial values for those array fields
    initialValues: {
      links: ['https://github.com/logaretm'],
    },
  }),
  methods: {
    onSubmit(values) {
      alert(JSON.stringify(values, null, 2));
    },
  },
};
</script>
```

<doc-tip title="Form Context" type="warn">

The `<FieldArray />` component requires being used inside a `Form` component or a `useForm` to be called at its parent tree.

</doc-tip>

### Field Array Paths

When planning to use `<FieldArray />` you need to provide a `name` prop which is the path of the array starting from the root form value, you can use dot notation for object paths or indices for array paths.

Here are a few examples:

_*Iterate over the `users` array:*_

```vue
<Form>
  <FieldArray name="users" v-slot="{ fields }">
    <div v-for="(entry, idx) in fields" :key="entry.key">
      <Field :name="`users[${idx}].name`" />
    </div>
  </FieldArray>
</Form>
```

_*Iterate over the `domains` inside `settings.dns` object:*_

```vue
<Form>
  <FieldArray name="settings.dns.domains" v-slot="{ fields }">
    <div v-for="(entry, idx) in fields" :key="entry.key">
      <Field :name="`settings.dns.domains[${idx}]`" />
    </div>
  </FieldArray>
</Form>
```

_*Iterate over both `users` and `links`:*_

```vue
<Form>
  <FieldArray name="users" v-slot="{ fields: users }">
    <div v-for="(userEntry, userIdx) in users">
      <FieldArray :name="`users[${userIdx}].links`" v-slot="{ fields: links }">
        <div v-for="(entry, idx) in fields" :key="entry.key">
          <Field :name="`users[${userIdx}].links[idx]`" />
        </div>
      </FieldArray>
    </div>
  </FieldArray>
</Form>
```

### Iteration Keys

The `FieldArrayEntry` item exposes a `key` property, this property is unique and is auto-generated for you so you can use it as an iteration key.

```vue
<FieldArray name="users" v-slot="{ fields }">
  <div v-for="(entry, idx) in fields" :key="entry.key">
    <Field :name="`users[${idx}].name`" />
  </div>
</FieldArray>
```

This auto-generated `key` property is very convenient as you no longer have to provide your own unique key for each item.

### Array Helpers

The `<FieldArray />` slot provides the following properties and functions:

- `fields`: a **read-only** version of your array field items, it includes some useful properties like `key`, `isFirst` and `isLast`, the actual item value is inside `.value` property. You should use it to iterate with `v-for`.
- `push(item: any)`: adds an item to the end of the array.
- `insert(idx: number, item: any)`: Inserts an array item at the specified index.
- `prepend(item: any)`: adds an item to the start of the array.
- `remove(idx: number)`: removes the item with the given index from the array.
- `swap(idxA: number, idxB: number)`: Swaps two array elements by their indexes.
- `replace(items: any[])`: Replaces the entire array values with the given items.
- `update(idx: number, value: any)`: Updates an array item value at the specified index.

[Read the API reference](/api/field-array) for more information.

## Caveats

### Paths creation and destruction

vee-validate creates the paths inside the form data automatically but lazily, so initially, your form values won't contain the values of the fields unless you provide initial values for them. It might be worthwhile to provide initial data for your forms with nested paths.

When fields get unmounted like in the case of conditional rendered fields with `v-if` or `v-for`, their path will be destroyed just as it was created if they are the last field in that path. So you need to be careful while accessing the nested field in `values` inside your submission handler or the `Form` component `values` slot prop.

### Referencing Errors

When referencing errors using `errors` object on the `Form` slot props or the `ErrorMessage` component, make sure to reference the field name in the same way you set it on the `name` prop for that field. So even if you avoid nesting you should always include the square brackets. In other words `errors` do not get nested, they are always flat.

### Nested Fields With Validation Schema

Since vee-validate supports [form-level validation](/guide/components/validation#form-level-validation), referencing the nested fields may vary depending on how you are specifying the schema.

If you are using yup, you can utilize the nested `yup.object` or `yup.array` schemas to provide validation for your nested fields, here is a quick example:

```vue
<template>
  <Form v-slot="{ errors }" :validation-schema="schema" @submit="onSubmit">
    <Field name="user.name" />
    <span>{{ errors['user.name'] }}</span>
    <Field name="user.addresses[0]" />
    <span>{{ errors['user.addresses[0]'] }}</span>

    <button>Submit</button>
  </Form>
</template>

<script>
import * as yup from 'yup';

export default {
  data() {
    return {
      schema: yup.object({
        user: yup.object({
          name: yup.string().required(),
          addresses: yup.array().of(yup.string().required()),
        }),
      }),
    };
  },
  methods: {
    onSubmit(values: any) {
      fn(values);
    },
  },
};
</script>
```

You can [visit this link](/examples/array-fields) for a practical example using nested arrays.
