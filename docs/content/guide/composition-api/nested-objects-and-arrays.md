---
title: Nested Objects and Arrays
description: Structuring forms in nested paths in objects or arrays
order: 4
next: guide/composition-api/api-review
---

# Nested Objects and Arrays

vee-validate supports nested objects and arrays by using field name syntax to indicate a field's path. This allows you to structure forms easily to make data mapping straightforward without having to deal with flat form values.

## Nested Objects

You can specify a field to be nested in an object using dot paths, like what you would normally do in JavaScript to access a nested property. The field's `name` acts as the path for that field in the form values:

```vue
<template>
  <form @submit="onSubmit">
    <input v-model="twitter" type="url" />
    <input v-model="github" type="url" />

    <button>Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    const { value: twitter } = useField('links.twitter');
    const { value: github } = useField('links.github');

    return {
      twitter,
      github,
      onSubmit,
    };
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
  <form @submit="onSubmit">
    <input v-model="twitter" type="url" />
    <input v-model="github" type="url" />

    <button>Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    const { value: twitter } = useField('links[0]');
    const { value: github } = useField('links[1]');

    return {
      twitter,
      github,
      onSubmit,
    };
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
  <form @submit="onSubmit">
    <input v-model="twitter" type="url" />
    <input v-model="github" type="url" />

    <button>Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';

export default {
  setup() {
    const { handleSubmit } = useForm();
    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    const { value: twitter } = useField('[links.twitter]');
    const { value: github } = useField('[links.github]');

    return {
      twitter,
      github,
      onSubmit,
    };
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

## Field Arrays

Field arrays are a special type of nested array fields, they are often used to collect repeatable pieces of data or repeatable forms. They are often called "repeatable fields".

Unlike the [components](/guide/components/nested-objects-and-arrays) API, it can be tricky to set up a group of repeatable fields with the composition API in the same component. This is because you usually need an input component to iterate over.

The following snippet uses the `Field` component as the input component, but you can use any component as long as they call `useField` internally.

To set up a repeatable field, you can use `useFieldArray` to help you manage the array values and operations:

```vue
<template>
  <form @submit="onSubmit" novalidate>
    <div v-for="(entry, idx) in entries" :key="entry.key">
      <Field :name="`links[${idx}].url`" type="url" />

      <button type="button" @click="remove(idx)">Remove</button>
    </div>

    <button type="button" @click="push({ id: Date.now(), url: '' })">Add</button>

    <button>Submit</button>
  </form>
</template>

<script>
import { Field, useForm, useFieldArray } from 'vee-validate';

export default {
  components: {
    Field,
  },
  setup() {
    const { handleSubmit } = useForm({
      initialValues: {
        links: [{ id: 1, url: 'https://github.com/logaretm' }],
      },
    });

    const { remove, push, entries } = useFieldArray({
      // Those can be reactive refs
      name: 'links',
      keyPath: 'id',
    });

    const onSubmit = handleSubmit(values => {
      console.log(JSON.stringify(values, null, 2));
    });

    return {
      entries,
      push,
      remove,
      onSubmit,
    };
  },
};
</script>
```

### Field Array Paths

When planning to use `useFieldArray` you need to provide a `name` prop which is the path of the array starting from the root form value, you can use dot notation for object paths or indices for array paths.

Here are a few examples:

_*Iterate over the `users` array:*_

```js
const { remove, push, entries } = useFieldArray({
  name: 'users',
  keyPath: 'id',
});
```

_*Iterate over the `domains` inside `settings.dns` object:*_

```js
const { remove, push, entries } = useFieldArray({
  name: 'settings.dns.domains',
  keyPath: 'id',
});
```

### Iteration Keys

You probably have noted in the previous examples we always generate a unique id for each array entry. This is a [Vue.js best practice](https://v3.vuejs.org/guide/list.html#maintaining-state) to make sure loops are efficient.

The `key-path` prop is another required prop that vee-validate exposes its value on the `entries` items as the `key` property, this enables you to use the `key` property as the iteration key for your loops.

```vue
<template>
  <form @submit="onSubmit" novalidate>
    <div v-for="(entry, idx) in entries" :key="entry.key">
      <Field :name="`links[${idx}].url`" type="url" />
    </div>
  </form>
</template>

<script>
import { Field, useForm, useFieldArray } from 'vee-validate';

export default {
  components: {
    Field,
  },
  setup() {
    const { handleSubmit } = useForm({
      initialValues: {
        links: [{ id: 1, url: 'https://github.com/logaretm' }],
      },
    });

    const { entries } = useFieldArray({
      name: 'links',
      keyPath: 'id',
    });

    return {
      entries,
    };
  },
};
</script>
```

That means while it is possible to have an array of strings or numbers, you will have a harder time getting unique ids for those fields, so it is recommended to create objects for your entries like these examples here.

```ts
// ❌ Don't
// No each to tell two entries apart, indexes are not unique and mutable
const links = ['link1', 'link2'];

// ✅ Do
// Each entry has a unique id that is not the index and is not mutable
const links = [
  { id: 1, value: 'link1' },
  { id: 2, value: 'link2' },
];
```

### Array Helpers

The `<useFieldArray />` function provides the following properties and functions:

- `entries`: a **read-only** version of your array field items, it includes some useful properties like `key`, `isFirst` and `isLast`, the actual item value is inside `.value` property. You should use it to iterate with `v-for`.
- `push(item: any)`: adds an item to the end of the array.
- `remove(idx: number)`: removes the item with the given index from the array.
- `swap(idxA: number, idxB: number)`: Swaps two array elements by their indexes.
- `insert(idx: number, item: any)`: Inserts an array item at the specified index.

[Read the API reference](/api/use-field-array) for more information.

## Caveats

### Paths creation and destruction

vee-validate creates the paths inside the form data automatically but lazily, so initially, your form values won't contain the values of the fields unless you provide initial values for them. It might be worthwhile to provide initial data for your forms with nested paths.

When fields get unmounted like in the case of conditional rendered fields with `v-if` or `v-for`, their path will be destroyed just as it was created if they are the last field in that path. So you need to be careful while accessing the nested field in `values` inside your submission handler.

### Referencing Errors

When referencing errors using `errors` object returned from the `useForm` function. Make sure to reference the field name in the same way you set it on the `name` argument for that field. So even if you avoid nesting you should always include the square brackets. In other words `errors` do not get nested, they are always flat.

### Nested Fields With Validation Schema

Since vee-validate supports [form-level validation](/guide/composition-api/validation#form-level-validation), referencing the nested fields may vary depending on how you are specifying the schema.

If you are using yup, you can utilize the nested `yup.object` or `yup.array` schemas to provide validation for your nested fields, here is a quick example:

```vue
<template>
  <form @submit="onSubmit">
    <input v-model="name" />
    <span>{{ errors['user.name'] }}</span>
    <input v-model="address" />
    <span>{{ errors['user.addresses[0]'] }}</span>

    <button>Submit</button>
  </form>
</template>

<script>
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default {
  setup() {
    const { handleSubmit, errors } = useForm({
      validationSchema: yup.object({
        user: yup.object({
          name: yup.string().required(),
          addresses: yup.array().of(yup.string().required()),
        }),
      }),
    });

    const { value: name } = useField('user.name');
    const { value: address } = useField('user.addresses[0]');

    const onSubmit = handleSubmit(values => {
      alert(JSON.stringify(values, null, 2));
    });

    return {
      name,
      address,
      onSubmit,
      errors,
    };
  },
};
</script>
```

You can [visit this link](/examples/array-fields) for a practical example using nested arrays.
