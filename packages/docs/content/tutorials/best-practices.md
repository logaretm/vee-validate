---
title: Best Practices
description: Tips and best practices to improve your workflow with vee-validate
---

# Best Practices

In this guide you will learn some tips and opportunities to improve your workflow while using vee-validate.

## Disable Reactivity for yup Schemas

While defining a `yup` schema, you would be inclined to do this:

```js
import * as yup from 'yup';

export default {
  data() {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      // other fields ...
    });

    return {
      schema,
    };
  },
};
```

This will have a very small overhead, because Vue automatically transforms anything returned in `data` into a reactive object and that's redundant in most cases for `yup` schemas as there won't be any rendering logic related to the schema, it's just a plain piece of data, keep in mind that Vue will also recursively traverse the property tree in that schema to make them reactive as well which isn't something we need.

We can save a few milliseconds by using the composition API's `markRaw` function which allow us to opt out of that recursive behavior and make yup schema non-reactive. So the previous example can be re-written as follows:

```js
import { markRaw } from 'vue';
import * as yup from 'yup';

export default {
  setup() {
    const schema = yup.object().shape({
      email: yup.string().email().required(),
      // other fields ...
    });

    return {
      schema: markRaw(schema), // non-reactive
    };
  },
};
```
