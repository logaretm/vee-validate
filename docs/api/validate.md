# validate()

`validate` is one of the core functions provided by vee-validate, it allows you to run arbitrary async validation. It does not have a dependency on `Vue.js` so you can use it your JavaScript, for more information, see the [Advanced: Programmatic Validation](../advanced/programmatic-validation.md).

## Signature

For the signature or the typings of the `validate` function, see [validate() in source code](https://github.com/logaretm/vee-validate/blob/master/src/validate.ts).

## Example

```js
validate(password, 'required|confirmed:@confirmation', {
  name: 'Password',
  values: {
    confirmation
  }
}).then(result => {
  if (result.valid) {
    // Do something!
  }
});
```

:::warning Rules
  Although you are not required to import the rest of vee-validate exported members, you still need to `extend` the rules that you will use with the `validate()` function. For more information on adding rules, see [Guide: Basics - Adding Rules](../guide/basics.md#adding-rules).
:::
