# data-* Attributes

data-* attributes provide an alternate interface for the plugin to specify what exactly should happen, providing a simple and Vue version-compatible API. They are useful if you do not like to pass complex expressions to the directive.

| Attribute &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; | Description |
| :--- | :--- |
| data-vv-as | Specifies a pretty name for the field. |
| data-vv-delay | Specifies the delay amount in milliseconds for triggering the validation. |
| data-vv-name | Specifies a name for the field, used in components validation and as a fallback name for inputs. |
| data-vv-scope | Specifies a scope for the field. See [here](../examples/scopes.md) for more information about scopes. |
| data-vv-value-path | Specifies the value path within a component $data to retrieve the component current value. Only used for components. |
| data-vv-validate-on | Used to specify a list of event names separated by pipes, the default varies by the type of the input. |
