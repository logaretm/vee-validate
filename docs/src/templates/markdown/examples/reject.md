## [Reject Invalid Files](#reject-example)

After validating a file, you may want to reject the uploaded file if it fails the validation, this can be done by adding the `reject` modifier to directive. so you would use it like this: `v-validate.reject`.

> The `reject` modifier is only relevant on file inputs, adding it to other input types will not have an effect.