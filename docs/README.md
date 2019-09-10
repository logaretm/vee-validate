---
title: VeeValidate
lang: en-US
home: true
heroImage: /logo.svg
actionText: Get Started →
actionLink: ./guide/
features:
  - title: Simple
    details: Template based validation that is both familiar and easy to setup.
  - title: Flexible
    details: Validate HTML inputs and Vue components, generate localized errors, Extendable, It does it all.
  - title: Configurable
    details: Config that doesn't get into your way, everything is optional.
footer: MIT Licensed | Copyright © 2019-present Abdelrahman Awad
description: Template Based Validation Framework for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Validation Framework for Vue.js
---

:::danger Version

This is the docs for vee-validate 3.x. You access the docs for the old version 2.x [from here](http://vee-validate.logaretm.com/v2).

:::

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

Register the `ValidationProvider` component and add the `required` rule:

```js{1,2,4,5,6,7,12}
import { ValidationProvider, extend } from 'vee-validate';
import { required } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
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

<RuleDemo rule="required" />

## Backers

<br>

<img src="https://opencollective.com/vee-validate/tiers/backer/badge.svg?label=backer&color=brightgreen" />

<object type="image/svg+xml" data="https://opencollective.com/vee-validate/tiers/backer.svg?avatarHeight=36&width=600"></object>
