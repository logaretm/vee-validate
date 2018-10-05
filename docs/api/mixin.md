# Mixin

VeeValidate injects a mixin that augments your Vue instances with the following properties:

- `$validator`: A `Validator` instance.
- `errors`: An `ErrorBag` instance.
- `fields` An object containing state flags for the validated fields.

::: tip
  You can choose to not automatically inject those properties in your instances by setting the `inject` [config option](/configuration.md) to false, but you will need to manage providing the `$validator` instance yourself so that the directive can work, refer to the [component injections](/concepts/injections.md#component-injections) section.
:::
