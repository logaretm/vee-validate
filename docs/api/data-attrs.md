# data-* Attributes

data-* attributes provide an alternate interface for the plugin to specify what exactly should happen, providing a simple and Vue version-compatible API. They are useful if you do not like to pass complex expressions to the directive.

|Attribute|Description|
|:---|:--- |
|<nobr>data-vv-as</nobr>|Specifies a pretty name for the field.|
|<nobr>data-vv-delay</nobr>|Specifies the delay amount in milliseconds for triggering the validation.|
|<nobr>data-vv-name</nobr>|Specifies a name for the field, used in components validation and as a fallback name for inputs.|
|<nobr>data-vv-scope</nobr>|Specifies a scope for the field. See [here](../examples/scopes.md) for more information about scopes.|
|<nobr>data-vv-value-path</nobr>|Specifies the value path within a component $data to retrieve the component current value. Only used for components.|
|<nobr>data-vv-validate-on</nobr>|Used to specify a list of event names separated by pipes, the default varies by the type of the input.|
