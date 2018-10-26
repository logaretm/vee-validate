# Bundle Size

VeeValidate does a lot of heavy lifting and offers plenty of features, that comes with the cost of a large bundle size, in production vee-validate gzipped would take about 30kb with all of its features intact.

Implementing a custom solution or with a more lightweight library to achieve the same features will also add up to your bundle size. Remember that vee-validate doesn't only validate, but also it generates error messages and offers most of the validation rules you would need out of the box.

## Minimal Bundle

There is a bundle stripped of all validation rules and messages, this bundle is about half the size of the full one. Taking about 15kb gzipped but you would need to pick the rules that you need from the provided rules bundle and also their messages from the localized bundles, here is a small example:

```js
import Vue from 'vue';
import { Validator, install as VeeValidate } from 'vee-validate/dist/vee-validate.minimal.esm.js';
import { required, min, max } from 'vee-validate/dist/rules.esm.js';
import veeEn from 'vee-validate/dist/locale/en';

// Add the rules you need.
Validator.extend('required', required);
Validator.extend('min', min);
Validator.extend('max', max);

// Merge the messages.
Validator.localize('en', veeEn);

// install the plugin
Vue.use(VeeValidate);
```

::: tip
Rules are maintained internally as a singleton object, meaning any rule you add to a validator at any place of your code will be available for all other validator instances throughout your app. Still to avoid side effects it is recommended to add the rules at the entry file of your app.
:::

## Modular Approach

In the future vee-validate would take a more modular approach, while still featuring the same features, it would offer a modular API for lower bundle sizes. For example vee-validate handles model validation, HTML5 validation and component validation. You might be only interested in model based validation, the idea is to offer such features as validation strategies, similar to passport. So you would only choose the strategies you will use in your app.

But we still haven't decided on the timeline but will be likely introduced in the next major version.
