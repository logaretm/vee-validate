---
title: VeeValidate
description: Template Based Validation for Vue.js
home: true
features:
  - title: 🍞 Declarative
    details: Template based validation that is familiar and easy to setup
  - title: 🧘‍♀️ Flexible
    details: Synchronous, Asynchronous, field-level or form-level validation
  - title: ⚡️ Fast
    details: Build faster forms faster with intuitive API and small footprint
---

## Quick Setup

### Installation

```bash
# install with yarn
yarn add vee-validate@next

# install with npm
npm install vee-validate@next --save
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
  <Field name="field" as="input" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

For more information continue reading the [Guide](./guide).
