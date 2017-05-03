> The field must always have either a `name` or a `data-vv-name` attribute, which both acts as the identifier for that input. The `name` attribute takes precedent. However the name that appears in the error messages can be customized using `data-vv-as` attribute or it can use the [dictionary object](localization.html#dictionary)

## [Rendering Errors](#render-errors)

Naturally, you would want to display the errors to your users. The plugin augments your Vue instance with a private validator object and a public errors data object. You are responsible for how the errors should be rendered.  

The errors object exposes a simple methods to help you render errors:

- `first('field')` Fetches the first error message associated with that field.
- `collect('field')` Fetches all error messages associated with that field. alternativly you can pass nothing and it will return errors grouped by fields
- `has('field')` Checks if there are any errors associated with that field.
- `all()` Gets all error messages.
- `any()` Checks if there are any errors.

There are a few more [methods](api.html#error-bag) that you can use to manipulate the errors object.
