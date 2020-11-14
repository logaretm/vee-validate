---
title: Best Practices
description: Tips and best practices to improve your workflow with vee-validate
order: 3
---

# Best Practices

## Yup Bundle Size

vee-validate's entire core size is very small, but the same can't be said about the validators you import. Most examples uses the following snippet to import everything `yup` has to offer:

```js
import * as yup from 'yup';

const schema = yup.object().shape({
  email: yup.string().email(),
  // ...
});
```

Instead you can leverage your bundler's tree-shaking capabilities and only import what you need:

```js
import { object, string } as yup from 'yup';

const schema = object().shape({
  email: string().email(),
  // ...
});
```

This will keep your app bundle size and routes to a minimum, ensuring faster load and interaction experiences for your users.

## Yup schemas in data

In most examples you probably noticed something like this:

```js
{
  data() {
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
}
```

This is fine for most cases, but the way Vue makes `data` items reactive is by recursively traveling the object tree and marking each object as reactive, this is an unnecessary overhead as you don't really need `yup` schemas to be reactive.

Instead you could either use `setup` instead of your data or [`markRaw`](https://v3.vuejs.org/api/basic-reactivity.html#markraw) to prevent Vue from marking the `yup` schemas as reactive which eliminates the deep reactive conversion overhead.

```js
{
  setup() {
    // Non-reactive because it was not explicitly defined with `reactive` or `ref`
    const schema = yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    });

    return {
      schema,
    };
  },
}
```

```js
import { markRaw } from 'vue';

{
  data() {
    // Non-reactive because it was explicitly defined with `markRaw`
    const schema = markRaw(yup.object().shape({
      email: yup.string().required().email(),
      password: yup.string().required().min(8),
    }));

    return {
      schema,
    };
  },
}
```

The performance implications for this might be negligible for most cases, however for large form schemas this can be helpful to avoid the default behavior of deep reactive conversion.
