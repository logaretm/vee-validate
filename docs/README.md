---
title: VeeValidate
lang: en-US
home: true
heroImage: /logo.svg
actionText: Get Started →
actionLink: ./guide/basics.md
features:
  - title: Simple
    details: Template based validation that is both familiar and easy to setup.
  - title: Flexible
    details: Validate HTML inputs and Vue components, generate localized errors, Extendable, It does it all.
  - title: Configurable
    details: Config that doesn't get into your way, everything is optional.
footer: MIT Licensed | Copyright © 2020-present Abdelrahman Awad
description: Template Based Form Validation for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Form Validation for Vue.js
---

# Quick Setup

## Installation

```bash
# install with yarn
yarn add vee-validate

# install with npm
npm install vee-validate --save
```

## Usage

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

Then use the `Form` and `Field` component to render your form:

```html{1,4}
<form as="form" v-slot="{ errors }">
  <Field name="field" as="input" :rules="isRequired" />
  <span>{{ errors.field }}</span>
</form>
```

And this is the result:

@[example](intro)

For more information continue reading the [Guide](./guide).
