---
title: Best Practices
description: Tips and best practices to improve your workflow with vee-validate
order: 3
---

# Yup Bundle Size

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
