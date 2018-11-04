---
title: VeeValidate
lang: en-US
home: true
heroImage: https://s3.eu-central-1.amazonaws.com/logaretm/vee-validate.svg
actionText: Get Started →
actionLink: ./guide/
features:
- title: Simple
  details: Template based validation that is both familiar and easy to setup.
- title: Flexible
  details: Validate HTML inputs and Vue components, generate localized errors, Extendable, We have it all.
- title: Configurable
  details: Config that doesn't get into your way, everything is optional.
footer: MIT Licensed | Copyright © 2018-present Baianat
description: Template Based Validation Framework for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Validation Framework for Vue.js
---
# Quick Setup

## install

```bash
# install with npm
npm install vee-validate

# install with yarn
yarn add vee-validate
```

## Use

In your html

```html
<input v-validate="'required'" name="myinput" type="text">
<span>{{ errors.first('myinput') }}</span>
```

And in your JavaScript:

```js
Vue.use(VeeValidate);
```