# Server Side Validation

Handling errors on both the server-side and client-side can be a boring process and any mismatch between the rules used on either side will lead to confusion and will hurt your users experience overall, so it can be useful to have your backend determining the validation rules for your fields without relying on the client-side validation.

:::tip
  Client-side validation is meant to aid the users by providing instant feedback, so implementing both provides great user experience and reduces potential invalid requests to your backend API.
:::

## Setting Errors Manually

Sometimes you want your backend to be able to handle validation for your forms. For example you might want your Backend application to return the validation errors then you could set them on the inputs.

The `ValidationObserver` component allows you to set errors on the form level using the `setErrors` method which accepts an object containing errors for each field, the object should look like this:

```js
{
  email: ['The email field is required', 'The email field must be a valid email'],
  name: ['The email field is required'],
  age: ['The age field must be a valid number'],
}
```

The keys of the errors object **must match the provider's `vid` or `name` props** and the values must be an array of strings containing the corresponding field errors.

This is a basic example that illustrates setting errors manually:

@[example](manual-errors)

## Handling Backend Validation

It doesn't matter what kind of backend server you have, it can be Laravel or some Node.js framework. As long the errors are formatted as shown in the previous section, you should be able to use your backend validation to power your forms on the client-side.

This example handles a Node.js server-side validation in a Nuxt app.

TODO: Setup a Node.js app
