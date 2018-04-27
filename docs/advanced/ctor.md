# Component Constructor Options

For your custom components that act as inputs you could customize the way the validator intereacts with your components, reducing greatly the number of needed attributes to make your component validatable.

You can use it by defining a `$_veeValidate` field in your component options definition:

```js{3-8}
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

| Property      | Type          | Default Value | Description |
| ------------- |:-------------:|:-------------:|:------------------- |
| name          | `() => string`  | `undefined`     | A function that returns the component name to be registered as in the validator, cannot be an arrow function because its context will be the component itself |
| value         | `() => any`     | `undefined`     |  A function that returns the component current value, will be used by the validator when it needs to resolve the field value, like calling `validate` without passing a value.|
| rejectsFalse  | `boolean`       |  `false`        | Defines `false` as an invalid value when the component is validated against the `required` rule. |
| events        | `string`        |  `input|blur`   | Pipe separated list of event names to validate when triggered. |
| validator     | `string`        |  `inherit|new`   |         Determines how the component get its validator instance, 'new' means it will always instantiate its own validator instance, 'inherit' means it will be injected by its parent using Provide/Inject API, the default is it will instantiate an instance unless it requests a `$validator` injection. |

These options allow you to configure your custom components behavior with vee-validate, check these examples here:

<iframe src="https://codesandbox.io/embed/2wyrp5z000" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

For a step-by-step guide to take advantage of ctor options you should [read this article](https://medium.com/@logaretm/authoring-validatable-custom-vue-input-components-1583fcc68314).