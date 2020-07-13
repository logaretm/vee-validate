---
title: VeeValidate
description: Template Based Validation for Vue.js
heroImage: /logo.png
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
yarn add vee-validate

# install with npm
npm install vee-validate --save
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
    let isRequired = value => {
      if (value && value.length) {
        return true;
      }

      return 'This field is required';
    };
  },
});
```

Then use the `Form` and `Field` components to render your form:

```html{1,4}
<form as="form" v-slot="{ errors }">
  <Field name="field" as="input" :rules="isRequired" />
  <span>{{ errors.field }}</span>
</form>
```

And this is the result:

@[example](intro)

For more information continue reading the [Guide](./guide).
