---
title: VeeValidate
lang: en-US
home: true
heroImage: /logo.png
actionText: Get Started →
actionLink: ./guide/
features:
  - title: Simple
    details: Template based validation that is both familiar and easy to setup.
  - title: Flexible
    details: Validate HTML inputs and Vue components, generate localized errors, Extendable, It does it all.
  - title: Configurable
    details: Config that doesn't get into your way, everything is optional.
footer: MIT Licensed | Copyright © 2019-present Baianat
description: Template Based Validation Framework for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Validation Framework for Vue.js
---

# Quick Setup

VeeValidate is a validation framework that offers validation for your fields using components and scoped slots.

## Installation

```bash
# install with npm
npm install vee-validate

# install with yarn
yarn add vee-validate
```

## Usage

Register the `ValidationProvider` component:

```js{1,3,4,5,6,11}
import { ValidationProvider, extend } from 'vee-validate';

extend('required', {
  validate: value => !!value,
  message: 'The {field} is required'
});

new Vue({
  el: '#app',
  components: {
    ValidationProvider
  },
  data: () => ({
    value: ''
  })
});
```

Wrap your inputs with the `ValidationProvider`:

```html{1,4}
<validation-provider rules="required" v-slot="{ errors }">
  <input v-model="value" name="myinput" type="text" />
  <span>{{ errors[0] }}</span>
</validation-provider>
```

And this is the result:

<validation-provider rules="required" v-slot="{ errors }">
  <input v-model="value" name="myinput" type="text" placeholder="type something">
  <span>{{ errors[0] }}</span>
</validation-provider>

<script>
export default {
  data: () => ({
    value: ''
  })
};
</script>

