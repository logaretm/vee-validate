## [data-* Attributes](#data-attributes)

data-* attributes provide an alternate interface for the plugin to specify what exactly should happen, providing a simple and Vue version-compatiable API. They are useful if you do not like to pass complex expressions to the directive.


<table class="table">
    <thead>
        <tr>
            <th>Attribute</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td class="is-method-name">data-vv-as</td>
            <td>Specifies a pretty name for the field.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-delay</td>
            <td>Specifies the delay amount in milliseconds for triggering the validation.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-name</td>
            <td>Specifies a name for the field, used in components validation and as a fallback name for inputs.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-value-path</td>
            <td>Specifies the value path within a component $data to retrieve the component current value. Only used for components.</td>
        </tr>
        <tr>
            <td class="is-method-name">data-vv-validate-on</td>
            <td>Used to specify a list of event names separated by pipes, the default varies by the type of the input.</td>
        </tr>
    </tbody>
</table>
