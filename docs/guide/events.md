# Validation Events

vee-validate listens on your inputs for a set of specific events that once triggered will fire a validation on that field. by default vee-validate listens for the `input` event.

If `input` event validation is too aggressive for your users, you can choose to fire validation based on other triggers like `change`. You can configure the default events vee-validate listens for or even designate specific events for specific fields.

## Changing Default Events

```js
Vue.use(VeeValidate, {
  events: 'change'
});
```

If you want to listen for multiple events, Just use a pipe separated list of event names:

```js
Vue.use(VeeValidate, {
  events: 'change|blur|xxx'
});
```

Specially, If you want to include custom ones, Just write the code like below

```js
Vue.use(VeeValidate, {
  events: 'change|custom'
});
```

## Changing Events Per Field

You can specify which events this field should be validated on by using the `data-vv-validate-on` attribute which takes the same value as the `events` config:

```html
<input name="field" v-validate="'required'" data-vv-validate-on="change|custom">
```

## Disabling Events Validation

You may want to disable all validation triggered by events, for example you only want to validate once the user clicks the submit button, you can do that by specifying an empty string to the `events` config which will disable all listeners for all fields.

```js
Vue.use(VeeValidate, {
  events: ''
});
```

Or use the `.disable` modifier on the `v-validate` directive:

```html
<input name="field" v-validate.disable="'required'">
```

Later in your code you can call `this.$validator.validate()` to trigger validation once the user submits the form:

```js
export default {
  // ...
  methods: {
    onSubmit () {
      this.$validator.validate().then(valid => {
        if (!valid) {
          // do stuff if not valid.
        }
      });
    }
  }
  // ...
}
```
