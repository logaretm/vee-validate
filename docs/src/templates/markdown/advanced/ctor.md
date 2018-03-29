## [Component Constructor Options](#ctor)

For your custom components that act as inputs you could customize the way the validator intereacts with your components, reducing greatly the number of needed attributes to make your component validatable.

You can use it by defining a `$_veeValidate` field in your component options definition:

```js
export default {
  // ...
  $_veeValidate: {
    // fetch the current value from the innerValue defined in the component data.
    value () {
      return this.innerValue;
    }
  },
  data: () => ({
    innerValue: 'initial'
    // ...
  })
}
```

Aside from defining the `value` getter you can also define the following:


<table class="table">
  <thead>
    <tr>
      <th>Property Name</th>
      <th>Type</th>
      <th>Default</th>
      <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="is-method-name">name</td>
      <td>() => string</td>
      <td>undefined</td>
      <td>
        A function that returns the component name to be registered as in the validator, cannot be an arrow function because its context will be the component itself
      </td>
    </tr>
    <tr>
      <td class="is-method-name">value</td>
      <td>() => any</td>
      <td>undefined</td>
      <td>
        A function that returns the component current value, will be used by the validator when it needs to resolve the field value, like calling `validate` without passing a value.
      </td>
    </tr>
    <tr>
      <td class="is-method-name">rejectsFalse</td>
      <td>boolean</td>
      <td>false</td>
      <td>
        Defines `false` as an invalid value when the component is validated against the `required` rule.
      </td>
    </tr>
    <tr>
      <td class="is-method-name">validator</td>
      <td>string</td>
      <td><code>'inherit|new'</code></td>
      <td>
        Determines how the component get its validator instance, 'new' means it will always instantiate its own validator instance, 'inherit' means it will be injected by its parent using Provide/Inject API, the default is it will instantiate an instance unless it requests a `$validator` injection.
      </td>
    </tr>
    <tr>
      <td class="is-method-name">events</td>
      <td>string</td>
      <td><code>'input|blur'</code></td>
      <td>
        Pipe separated list of event names to validate when triggered
      </td>
    </tr>
  </tbody>
</table>

These options allow you to configure your custom components behavior with vee-validate, check these examples here:


<iframe src="https://codesandbox.io/embed/2wyrp5z000" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
