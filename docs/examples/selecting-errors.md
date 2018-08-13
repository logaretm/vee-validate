# Error Selectors

The `errors.first` and `errors.has` methods don't only provide you with a way to fetch the first input for a specific field, they also allow you to filter it down further to a specific rule, using the following syntax `'field:rule'`. Even more, they allow you to filter it down to a specific scope using `'scope.field'`, so if you want to display the first error for the email field in the newsletter form but only if the rule is email.

```js
errors.first('newsletter.email:email');
```

In the example below, you have a collection of errors and you may use the input to filter down the errors. Note that it is by default the error bag will not have multiple errors of the same input since the validator bails upon first rule that fails.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fselectors&module=%2Fsrc%2Fcomponents%2FSelectors.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fselectors&module=%2Fsrc%2Fcomponents%2FSelectors.vue)
