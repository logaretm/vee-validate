---
title: Composition API Caveats
description: Things to watch out for when using the composition API
order: 6
next: guide/global-validators
menuTitle: Caveats
new: true
---

# Composition API Caveats

When using the composition API, there are a few things that are not clear when first starting to use it. This page will contain these topics and help you understand how to workaround or address them.

## Reactive Field Names with `useField`

You might've noticed that some examples in the docs call `toRef` when assigning a field name to `useField`:

```js
import { toRef } from 'vue';
import { useField } from 'vee-validate';

export default {
  props: {
    name: String,
  },
  setup(props) {
    const { value, errorMessage } = useField(toRef(props, 'name'));
  },
};
```

This is mainly because the `props` in Vue.js is a reactive object, meaning if you access or destruct any of its properties they will lose the reactivity aspect. Let's say you did the following:

```js
import { useField } from 'vee-validate';

export default {
  props: {
    name: String,
  },
  setup(props) {
    // ❌ Don't do this in custom input components
    const { value, errorMessage } = useField(props.name);
  },
};
```

The implications are that vee-validate is no longer able to tell when the field name changes, which is crucial for syncing values when they do.

A common example where field names change frequently is in a array field where `v-for` loops field names use the index or the iterated value to generate the field name

```vue{4}
<CustomTextField
  v-for="(user, idx) in users"
  :key="user.id"
  :name="`users[${idx}].name`"
></CustomTextField>
```

To address this issue, you need to get a reactive reference to the `name` property. Vue offers a few ways to do this, so you can use any of the following methods:

```js
import { toRef, toRefs, computed } from 'vue';

// ✅ using `toRef`
const { value, errorMessage } = useField(toRef(props, 'name'));

// ✅ using `toRefs`
const { name } = toRefs(props);
const { value, errorMessage } = useField(name);

// ✅ using `computed`
const name = computed(() => props.name);
const { value, errorMessage } = useField(name);
```
