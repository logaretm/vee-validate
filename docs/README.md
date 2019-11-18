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
footer: MIT Licensed | Copyright © 2019-present Abdelrahman Awad
description: Template Based Validation Framework for Vue.js
meta:
  - name: og:title
    content: VeeValidate
  - name: og:description
    content: Template Based Validation Framework for Vue.js
---
# Quick Setup

:::danger Version

This is a the docs for vee-validate 2.x, to access the docs for the latest version 3.x [from here](https://logaretm.github.io/vee-validate/).

:::

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
