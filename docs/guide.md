---
title: Getting Started
lang: en-US
footer: MIT Licensed | Copyright © 2018-present Baianat
description: Getting started with VeeValidate
sidebar: auto
meta:
  - name: og:title
    content: Getting Started
  - name: og:description
    content: Getting started with VeeValidate
---

# Getting started

## Installation

You can install this plugin via [npm](#npm) or via a [CDN](#cdn).

### npm

```bash
npm install vee-validate --save
```

### CDN

```html
  <!-- jsdelivr cdn -->
  <script src="https://cdn.jsdelivr.net/npm/vee-validate@latest/dist/vee-validate.js"></script>

  <!-- unpkg -->
  <script src="https://unpkg.com/vee-validate@latest"></script>
```

## Usage

::: tip
    Examples use the ES2015 syntax, make sure to brush up on ES2015 if you haven't already.
:::

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate);
```

or include the script directly

```html
  <script src="path/to/vue.js"></script>
  <script src="path/to/vee-validate.js"></script>
  <script>
    Vue.use(VeeValidate); // good to go.
  </script>
```

## Basic Example

All you need is to add the `v-validate` directive to the input you wish to validate, and make sure your input has a `name` attribute for error messages generation.

Then, pass to the directive a `rules` string which contains a list of validation rules separated by a pipe '`|`'. For the following example the validation rules are straight forward. Use `required` to indicate that the field is required, and `email` to indicate that the field must be an email. To combine both rules we assign the string value `required|email` to the `v-validate` expression value.

[More Examples](examples.md)

## Available Rules

There are more than 20 rules available to validate your inputs:

- [after](validation.md#rule-after)
- [alpha](validation.md#rule-alpha)
- [alpha_dash](validation.md#rule-alpha_dash)
- [alpha_num](validation.md#rule-alpha_num)
- [alpha_spaces](validation.md#rule-alpha_spaces)
- [before](validation.md#rule-before)
- [between](validation.md#rule-between)
- [confirmed](validation.md#rule-confirmed)
- [credit_card](validation.md#rule-credit_card)
- [date_between](validation.md#rule-date_between)
- [date_format](validation.md#rule-date_format)
- [decimal](validation.md#rule-decimal)
- [digits](validation.md#rule-digits)
- [dimensions](validation.md#rule-dimensions)
- [email](validation.md#rule-email)
- [ext](validation.md#rule-ext)
- [image](validation.md#rule-image)
- [in](validation.md#rule-in)
- [integer](validation.md#rule-integer)
- [ip](validation.md#rule-ip)
- [is](validation.md#rule-is)
- [is_not](validation.md#rule-is-not)
- [length](validation.md#rule-length)
- [max](validation.md#rule-max)
- [max_value](validation.md#rule-max_value)
- [mimes](validation.md#rule-mimes)
- [min](validation.md#rule-min)
- [min_value](validation.md#rule-min_value)
- [not_in](validation.md#rule-not_in)
- [numeric](validation.md#rule-numeric)
- [regex](validation.md#rule-regex)
- [required](validation.md#rule-required)
- [size](validation.md#rule-size)
- [url](validation.md#rule-url)
