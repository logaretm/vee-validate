# extend()

`extend` Allows you to add more rules to be used globally by the vee-validate functions and components. For in-depth guide on how to add rules and their messages, see [Guide: Basics - Adding Rules](../guide/basics.md#adding-rules).

## Signature

For the signature or the typings of the `extend` function, see [extend() in source code](https://github.com/logaretm/vee-validate/blob/master/src/extend.ts).

## Example

```js
extend('positive', (value) => {
  if (value >= 0) {
    return true;
  }

  return 'This value must be a positive number';
});
```
