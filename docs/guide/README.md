---
prev: false
next: ./getting-started.md
---
# Introduction

VeeValidate is a template-based validation library for Vue.js. It has plenty of validation rules out of the box and support for custom ones as well. It is template based so it is easy and familiar.

## Features

- Template based validation.
- Written in TypeScript.
- Validates HTML5 inputs and custom Vue components.
- [Many validation rules are provided out of the box](./rules.md).
- [Localization Support](./localization.md) with 40+ locales available.
- [Custom Rules](./custom-rules.md) support.
- No dependencies.

## Why Template based validation

There are two ways to tackle form validation, declarative and imperative. When the validation is applied using the template or markup it is called "declarative" as you declare both your elements and their validation rules.

Both approaches has their pros and cons, but the declarative style has been rooted in the HTML spec as it feels more natural, for example:

```html
<input type="text" required>
```

Clearly communicates that the input is required with minimal effort. Compared to a traditional imperative code:

```html
<input oninput="updateValue" type="text">
```

```js
let value = '';

function checkRequired (value) {
  return value.trim().length > 0;
}

function updateValue (e) {
  value = e.target.value;
  checkRequired(value);
}
```

Which is not immediately clear at first glance, of course modern libraries would abstract away some of these issues but they are still observed. The form requirements are not visible in the template.

Also you would normally display error messages and hints to your users in the template anyways, so you would need to go back and forth between the template and the script as you setup your forms.

This is why vee-validate uses the declarative approach, most of the work goes into the template in a fire and forget manner which allows you to focus more on your app logic rather than trivial tasks like validation.

vee-validate can still be used imperatively, but it is not the main focus nor the goal of this library.
