---
title: VeeValidate
description: Form Validation for Vue.js
home: true
features:
  - title: 🍞 Easy
    details: Declarative validation that is familiar and easy to setup
  - title: 🧘‍♀️ Flexible
    details: Synchronous, Asynchronous, field-level, or form-level validation
  - title: ⚡️ Fast
    details: Build faster forms faster with intuitive API and small footprint
  - title: 🏏 Minimal
    details: Only handles the complicated and painful form concerns, gives you full control over everything else
  - title: 🍤 Tiny
    details: Small footprint < 5kb which makes your apps faster to load
  - title: 😎 UI Agnostic
    details: Works with native HTML elements or your favorite UI library components
  - title: 🦾 Progressive
    details: Works with any setup whether you use Vue.js as a progressive enhancement or in a complex setup
  - title: ✅ Built-in Rules
    details: Companion lib with 25+ Rules that covers most needs in most web applications
  - title: 🌐 i18n
    details: 45+ locales for built-in rules contributed by developers from all over the world
---

## Quick Setup

<br />

### Installation

```sh
# install with yarn
yarn add vee-validate@next

# install with npm
npm install vee-validate@next --save
```

Or use a CDN

```html
<script src="https://unpkg.com/vee-validate@next"></script>
```

### Usage

Register the `Field` and `Form` components and create a simple `required` validator:

```js
import { Field, Form } from 'vee-validate';

export default {
  components: {
    Field,
    Form,
  },
  methods: {
    // Validator function
    isRequired(value) {
      return value ? true : 'This field is required';
    },
  },
};
```

Then use the `Form` and `Field` components to render your form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

For more information continue reading the [Guide](/guide/overview).
