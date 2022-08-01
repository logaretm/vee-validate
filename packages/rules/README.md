# @vee-validate/rules

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/blob/main/logo.png">
  </a>
</p>

> Common Laravel-Like rules module for vee-validate

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

## What's this

VeeValidate v4 breaks up the parts that made it a popular solution for form validation into it isolated parts. The core `vee-validate` package no longer includes the rules that came by default in previous releases, the built-in rules were rebranded as **global validators**,

This is where this package comes in, It includes the most common validators you will use in most of your applications, vee-validate allows you to express global rules just like Laravel's validation syntax.

## Installation

```sh
yarn add @vee-validate/rules

# or with npm
npm install @vee-validate/rules
```

## Usage

Use the `defineRule` function from `vee-validate` core library to add rules exported by this library:

```js
import { defineRule } from 'vee-validate';
import { required, email, min } from '@vee-validate/rules';

defineRule('required', required);
defineRule('email', email);
defineRule('min', min);
```

Or you can globally define all the available rules in the `@vee-validate/rules` package:

```js
import { defineRule } from 'vee-validate';
import * as rules from '@vee-validate/rules';

Object.keys(rules).forEach(rule => {
  defineRule(rule, rules[rule]);
});
```

### Available Rules

- alpha
- alpha_dash
- alpha_num
- alpha_spaces
- between
- confirmed
- digits
- dimensions
- email
- excluded
- ext
- image
- one_of
- integer
- is
- is_not
- length
- max
- max_value
- mimes
- min
- min_value
- numeric
- regex
- required
- required_if
- size

For more information about each rules, check the [documentation for global validators](https://vee-validate.logaretm.com/v4/guide/global-validators)

## Credits

- Inspired by Laravel's [validation syntax](https://laravel.com/docs/5.4/validation)
