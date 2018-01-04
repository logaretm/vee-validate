## [Scopes](#scope-example)

By default the scope of the validator is the same as the Vue instance that owns it, sometimes you may have multiple fields within the same component, they are in different forms and serve different purposes. The validator will then treat those two fields as the same field which will cause problems detecting the input and displaying the errors.  

You can tell the validator to scope the fields by adding a `data-vv-scope` attribute which tells the validator the name of the scope. Those fields will be then identified using their name and their scope, you can have inputs with the same name in different scopes, and you can display, clear and validate those scopes indepently.  

For convienece you may add the `data-vv-scope` attribute on the form that owns the inputs, you don't have to add the attribute on every input. You can also pass `scope` property to the validator expression.

