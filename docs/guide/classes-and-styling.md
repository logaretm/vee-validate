# Styling and CSS Classes

Styling certain aspects of your UI based on validation state is a common use-case for friendly UIs, vee-validate offers some UI utilities to make this easier for you.

## Auto CSS Classes

VeeValidate can apply classes on your native HTML input fields based on the validation state, for example you may want to apply a `valid` class on valid fields and `invalid` on fields that did not pass validation, this behavior is turned off by default.

By setting the `classes` option to `true` in the configuration VeeValidate handles this for you and applies a bunch of other useful classes based on the [flags object](./flags.md) for that field.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
  classes: true
});
```

### Customizing CSS classes

By default the classes applied on the inputs match the flags names, you can override the class name for each flag by setting the `classNames` object when configuring vee-validate. This is very useful if you are using a CSS framework that has predefined styles for input states.

This code snippet overrides the `valid` and `invalid` class names to have a bootstrap style of class names.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
  classes: true,
  classNames: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  }
});
```
You can [view the example live](https://codesandbox.io/s/l77o5m19lz)

Additionaly you can override the class names for `dirty`, `pristine`, `touched`, `untouched` flags.

## Styling with the HTML5 validation API

VeeValidate plays nicely with the [Constrained Validation API](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) or the HTML5 validation which is supported by most browsers, currently you can use `:valid` and `:invalid` psudo selectors to apply visual styles to your elements based on their validation state which is handled by vee-validate automatically.

::: tip
  This behavior is __disabled__ by default to prevent accidental styling, you can turn this feature on by setting the `validity` option to true when installing vee-validate.
:::

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
  validity: true
});
```

```css
input:valid {
  border-color: green;
}

input:invalid {
  border-color: red;
}
```

You can view [this example live](https://codesandbox.io/s/9zl091p17r)

::: tip
  One caveat with this feature is that the field can only be one of two states, either invalid or valid meaning you would face some situations when the applied styles are not suitable, for example a red border around a field that the user did not intereact with yet may result in a poor UX.
:::

## Styling with the aria-* attributes

VeeValidate also applies a couple of aria attributes on your HTML inputs:

- aria-required: when the field is required it will be set to 'true' otherwise 'false'.
- aria-invalid: when the field is invalid it will be set to 'true' otherwise 'false'.

You could use these attributes for CSS selectors to apply specific styling to fields applied with those aria attributes.

This feature is __enabled__ by default and can be disabled by setting the `aria` option to `false` in the plugin configuration.

```js
import Vue from 'vue';
import VeeValidate from 'vee-validate';

Vue.use(VeeValidate, {
  aria: true
});
```

```css
input[aria-invalid="true"] {
  border-color: red;
}

input[aria-invalid="false"] {
  border-color: green;
}
```

::: tip
  Like the validity feature, this also have the caveat of having only binary states for the inputs which may result in a poor UX experience, you may use this approach coupled with css classes to further constrain the styling applied on your inputs.
:::

A [live example can be found here](https://codesandbox.io/s/n35q1rnq00)

## Styling custom components

The features mentioned above only work for native HTML5 inputs. As for components, you should always design your components around using props/state to control their visual representation.

You may use a similar API with [Validation Components](/guide/components.md), specifically the [ValidationProvider component](/guide/components/validation-provider.md) that exposes useful props on the slot-scope to allow you to control your component's visuals.
