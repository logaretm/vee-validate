# Validating Custom Components

VeeValidate allows you to validate custom components as well as HTML5 input elements. But custom components have a few caveats due to them having no standard so validating custom components may vary. This topic addresses the things to watch out for when validating custom components.

## How It Works

**So how does vee-validate validate custom components typically?**

Custom components that act as an input typically use the `v-model` to communicate its value, VeeValidate tries to watch the model using `$watch` API which has its limitations. For instance it cannot watch a `v-for` iterator value since it does not exist on the Vue instance per say, it only exists in the `v-for` loop context.

VeeValidate falls back to watching the `value` prop for that custom component. If your component [customizes the `model` constructor](https://vuejs.org/v2/guide/components-custom-events.html#Customizing-Component-v-model) property, VeeValidate will detect the correct prop name and validate watch that instead.

[Here is a small demo](https://vuetifyjs.com/en/components/forms#example-vee-validate) validating the popular [Vuetify](https://github.com/vuetifyjs/vuetify) UI framework input components.

This covers most cases, except the case where your component does not use `v-model` to pass its current value. You can further improve `VeeValidate` integration with your component using the [ctor options](#component-constructor-options) explained in the following section, which gives you a fine control over the validation behavior of your component.

## Component Constructor Options

For your custom components that act as inputs you could customize the way the validator interacts with your components, reducing greatly the number of needed attributes to make your component validatable.

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
| validator     | `string`        |  `new` or `null`   |         Determines how the component get its validator instance, 'new' means it will always instantiate its own validator instance, the default is it will instantiate an instance unless it requests a `$validator` injection. [You can inject the parent tree's validator instance](./injections.md#injecting-parent-validator) with Vue's Provide/Inject API |

These options allow you to configure your custom components behavior with vee-validate, check these examples here:

<iframe src="https://codesandbox.io/embed/2wyrp5z000" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

For a step-by-step guide to take advantage of ctor options you should [read this article](https://medium.com/@logaretm/authoring-validatable-custom-vue-input-components-1583fcc68314).