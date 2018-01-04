## [Custom Component Validation](#component-example)

You might have a custom component that you want to treat it as an input, like a custom input field, it would have its own validator instance but you want to validate it in the parent scope, because it is simply just an input with some whistles on top. You can achieve this by using the directive normally like you would on a regular input element, but you must make sure that your component satisfies the following:

- Must emit an `input` event whenever the value changes.
- Should have a `data-vv-name` or a `name` attribute defined.
- Should have a `data-vv-value-path` attribute which denotes how to access the value from within that component (Needed for `validateAll` calls).