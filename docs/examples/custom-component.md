# Custom Components Validation

::: tip
[Validation Components](/guide/components.md) are a newer, better way to validate your inputs especially vue components, it is recommneded to use them over the `v-validate`directive since it has some caveats with custom components. If you still want to use the directive to validate your components it is still reliable but it has some caveats mentioned below.
:::

You might have a custom component that you want to treat as an input. Like a custom input field, it would have its own validator instance, but you want to validate it in the parent scope because it is simply just an input with some whistles on top. You can achieve this by using the directive normally like you would on a regular input element, but you must make sure that your component satisfies the following:

- Must emit an `input` event whenever the value changes.
- Should have a `value` and `name` getters define in the components `$_veeValidate` [ctor options](/concepts/components.md) alternatively it can use the `data-vv-name` as a fallback for the `name` prop.

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Fcustom&module=%2Fsrc%2Fcomponents%2FCustom.vue&view=preview" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Fcustom&module=%2Fsrc%2Fcomponents%2FCustom.vue)

You can find a step-by-step guide on creating validatable components by [reading this article](https://medium.com/@logaretm/authoring-validatable-custom-vue-input-components-1583fcc68314).

