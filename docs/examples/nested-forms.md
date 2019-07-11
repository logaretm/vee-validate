# Organizing Forms

VeeValidate allows you to create **logical** forms with the `ValidationObserver` component, as it can be nested and controlled by parent observers. Although recommended, you don't have to use the `form` tag.

## Same Page Forms

You can have multiple forms in the same page, for example a sign up/sign in page with both forms.

TODO: Basic Example with 2 forms

:::tip Refactoring
  Having multiple forms in the same page is messy, try to avoid that and refactor your forms into form components instead.
:::

## Nested Forms

The native HTML `form` tag doesn't allow you to nest other `form` tags as children, and in reality the need for nested forms is rather rare.

But since vee-validate doesn't require you to use `form` tags, you can create logically nested forms.

TODO: Basic Example with 2 nested forms, a change password button.
