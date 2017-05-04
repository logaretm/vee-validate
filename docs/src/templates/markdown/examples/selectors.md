## [Error Selectors](#selectors-example)

The `errors.first` and `errors.has` methods don't only provide you with a way to fetch the first input for a specific field, they also allow you to filter it down further to a specific rule, using the following syntax `'field:rule'`, even more they allow you filter it down to a specific scope using `'scope.field'`, so if you want to display the first error for the email field in the newsletter form but only if the rule is email

```js
errors.first('newsletter.email:email');
```
  
In the example below, you have a collection of errors and you may use the input to filter down the errors, note that currently it is unlikely that the error bag will have multiple errors of the same input since it early exit upon first failure.
