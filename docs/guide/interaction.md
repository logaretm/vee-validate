# Interaction Modes

This feature is only implemented for [ValidationProvider components](./components/validation-provider.md).

Borrowing from the idea of interaction modes formalized by [vue-simple-validator](http://simple-vue-validator.magictek.cn/#m_modes). Interaction modes are used by vee-validate to determine when a validation should trigger. It is used as a replacement for the `events` prop.

VeeValidate comes with **4 interaction modes** out of the box:

- `aggressive`: this is the default behavior and it validates whenever an `input` event is emitted.
- `passive`: doesn't validate on any event, so you can only validate manually.
- `lazy`: validates on `change` or `blur` depending on the input type.
- `eager`: when the field **is valid** or has not yet been interacted with, it will validate on `change`. When the field becomes invalid due to the first validation, it will validate on `input` for as long the field is invalid. When the field is valid again, it will go back to validating on `change`. It is a mix between the `aggressive` and `lazy` modes.

## Configuration

You can set any of the validation providers mode to any of those modes using the `mode` prop.

```vue
<ValidationProvider rules="required|email" mode="eager">
  <div slot-scope="{ errors }">
    <input v-model="val">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

You can configure the mode for all providers in the config when you are installing the plugin:

```js
Vue.use(VeeValidate, {
  mode: 'eager'
});
```

And you can set it dynamically after the plugin has been installed using `VeeValidate.setMode`.

```js
import VeeValidate from 'vee-validate';

// set all future providers default mode to passive.
// does not affect existing ones.
VeeValidate.setMode('passive');
```

## Custom Modes

You also have the ability to create custom modes that suit your needs. A mode is a function that recieves an object containing useful information about the field. It contains:

- `errors`: list of error messages.
- `flags`: the field flag object.
- `value`: the last validated field value.
- `failedRules`: a map object of the rules that had failed validation and their messages.

The mode function should then return an object containing some (or none) of those properties:

- `on`: array of event names that should trigger validation eg: `['input', 'change']`
- `debounce`: number of the debounce time value for the validation.

Modes can be passed directly to providers `mode` prop or applied globally using `VeeValidate.setMode`.

### Example

This example implements a custom version that behaves similar to the `eager` mode, except it applies a **debounce** value depending on each event type, an input event usually has high trigger frequenecy in text fields, so we debounce it to only validate after the user has finished typing.

```js
VeeValidate.setMode('betterEager', ({ errors }) => {
   // become slightly aggressive if the field is invalid.
  if (errors.length) {
    return {
      on: ['input'],
      debounce: 350
    };
  }

  // validate immediately after leaving the field.
  return {
    on: ['change'],
    debounce: 0
  };
});
```
