---
title: VeeValidate
description: Template Based Validation for Vue.js
home: true
features:
  - title: Simple
    details: Template based validation that is both familiar and easy to setup.
  - title: Flexible
    details: Validate HTML inputs and Vue components, generate localized errors, Extendable, It does it all.
  - title: ⚡️ Fast
    details: Build faster forms faster with intuitive syntax
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

new Vue({
  el: '#app',
  components: {
    Field,
    Form,
  },
  setup() {
    // Validator function
    const isRequired = value => (value ? true : 'This field is required');

    return {
      isRequired,
    };
  },
});
```

Then use the `Form` and `Field` components to render your form:

```vue
<Form v-slot="{ errors }">
  <Field name="field" as="input" :rules="isRequired" />

  <span>{{ errors.field }}</span>
</Form>
```

And this is the result:

For more information continue reading the [Guide](./guide).
