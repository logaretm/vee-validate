---
title: VeeValidate
lang: en-US
home: true
heroImage: /logo.png
actionText: Get Started →
actionLink: ./guide/basics.md
features:
  - title: Simple
    details: Template based validation that is both familiar and easy to setup.
  - title: Flexible
    details: Validate HTML inputs and Vue components, generate localized errors, Extendable, It does it all.
  - title: Configurable
    details: Config that doesn't get into your way, everything is optional.
footer: MIT Licensed | Copyright © 2019-present Abdelrahman Awad
description: Template Based Form Validation Framework for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Form Validation Framework for Vue.js
---

:::danger Version

This is the docs for vee-validate 3.x. You access the docs for the old version 2.x [from here](http://vee-validate.logaretm.com/v2).

:::

# Quick Setup

VeeValidate is a form validation framework for Vue.js.

## Installation

```bash
# install with npm
npm install vee-validate --save

# install with yarn
yarn add vee-validate
```

## Usage

Register the `ValidationProvider` component and add the `required` rule:

```js{1,2,4,5,6,7,12}
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required'
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

<RuleDemo rule="required" :customMessages="{ required: 'This field is required' }" />
