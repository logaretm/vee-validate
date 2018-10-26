# Scopes

By default, the scope of the validator is the same as the Vue instance that owns it. Sometimes you may have multiple fields within the same component, they are in different forms and serve different purposes. Since the validator uses the `name` or `data-vv-name` attributes to identify the field, fields with the same name will conflict with each other, which will cause problems when trying to display error messages for either of them.

You can tell the validator to scope the fields by adding a `data-vv-scope`. Those fields will be then identified using their name and their scope. You can have inputs with the same name in different scopes, and you can display, clear and validate those scopes independently.

For convenience, you may add the `data-vv-scope` attribute on the form that owns the inputs, you don't have to add the attribute on every input. You can also pass `scope` property to the validator expression.

::: tip
  `data-vv-scope` when applied on forms works if the inputs are HTML5 inputs. Custom components would need to define their scope using the attribute.
:::

In the following example, we have two scopes and we operate on either of them independently:

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fscopes&module=%2Fsrc%2Fcomponents%2FScopes.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fscopes&module=%2Fsrc%2Fcomponents%2FScopes.vue)
