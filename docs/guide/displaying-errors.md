# Displaying Errors

After generating error messages, they are stored in an ErrorBag instance which simplifies displaying errors in your UI.

By default the error bag instance will be injected in your component's computed properties under the `errors` name, which can be customized to avoid conflicts with other libraries/components.

## Displaying single error message

Typically you would want to display one error at a time for your fields, you can do this using `errors.first('fieldName')` method.

```html
<input type="text" name="fieldName" v-validate="'required'">
<span>{{ errors.first('fieldName') }}</span>
```

::: tip
  VeeValidate __only generates one message per field by default__ as it uses a fast-exit strategy when running the validation pipeline. When the first failing rule is detected it will have its message generated and stored in the error bag instance, other rules results are then ignored. To disable this behavior you may want to configure the `fastExit` option in [VeeValidate's config](/configuration.md) or use the [`continues` modifier](/api/directive.md#continues).
:::

## Displaying Multiple error messages

Another use-case is that you might want to display all the errors for an input, typically to allow the user to fix multiple input errors at once. The `errors.collect('fieldName')` method collects all error messages for a specific field into an array.

```html
<input type="text" name="fieldName" v-validate.continues="'required|alpha|min:5'">
<ul>
  <li v-for="error in errors.collect('fieldName')">{{ error }}</li>
</ul>
```

## Displaying all errors

Sometimes you need to display all fields errors on top of a form, especially for very large forms. You can use either:

### Flat list of errors

You can use `errors.all()` to collect all fields errors into a single flat array.

```html
<input type="text" name="first" v-validate.continues="'required|alpha|min:5'">

<input type="text" name="second" v-validate.continues="'required|alpha|min:5'">

<ul>
  <li v-for="error in errors.all()">{{ error }}</li>
</ul>
```

### Grouped by field name

Use `errors.collect()` without providing a field name to collect all errors into an object which keys are field names and the values are arrays of error messages for each field. In other words it groups error messages by field name.

```html
<input type="text" name="first" v-validate.continues="'required|alpha|min:5'">

<input type="text" name="second" v-validate.continues="'required|alpha|min:5'">

<ul>
  <li v-for="group in errors.collect()">
    <ul>
      <li v-for="error in group">{{ error }}</li>
    </ul>
  </li>
</ul>
```
