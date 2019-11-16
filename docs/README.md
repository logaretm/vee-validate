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

## Contributions

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](https://github.com/logaretm/vee-validate/blob/master/CONTRIBUTING.md)].
<a href="https://github.com/logaretm/vee-validate/graphs/contributors"><img src="https://opencollective.com/vee-validate/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/vee-validate/contribute)]

#### Individuals

<a href="https://opencollective.com/vee-validate"><img src="https://opencollective.com/vee-validate/individuals.svg?width=890"></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/vee-validate/contribute)]

<a href="https://opencollective.com/vee-validate/organization/0/website"><img src="https://opencollective.com/vee-validate/organization/0/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/1/website"><img src="https://opencollective.com/vee-validate/organization/1/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/2/website"><img src="https://opencollective.com/vee-validate/organization/2/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/3/website"><img src="https://opencollective.com/vee-validate/organization/3/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/4/website"><img src="https://opencollective.com/vee-validate/organization/4/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/5/website"><img src="https://opencollective.com/vee-validate/organization/5/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/6/website"><img src="https://opencollective.com/vee-validate/organization/6/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/7/website"><img src="https://opencollective.com/vee-validate/organization/7/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/8/website"><img src="https://opencollective.com/vee-validate/organization/8/avatar.svg"></a>
<a href="https://opencollective.com/vee-validate/organization/9/website"><img src="https://opencollective.com/vee-validate/organization/9/avatar.svg"></a>
