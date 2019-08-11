# Organizing Forms

VeeValidate allows you to create **logical** forms with the `ValidationObserver` component, as it can be nested and controlled by parent observers. Although recommended, you don't have to use the `form` tag.

## Same Page Forms

You can have multiple forms in the same page, for example a sign up/sign in page with both forms.

<iframe src="https://codesandbox.io/embed/vue-template-kysb1?fontsize=14" title="VeeValidate multi-forms example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

:::tip Refactoring
Having multiple forms in the same page is messy, try to avoid that and refactor your forms into form components instead if your app has too many forms.
:::

## Nested Forms

The native HTML `form` tag doesn't allow you to nest other `form` tags as children, and in reality the need for nested forms is rather rare.

But since JavaScript Validation doesn't require you to use `form` tags, you can create logically nested forms.

<iframe src="https://codesandbox.io/embed/veevalidate-multi-forms-example-dfukg?fontsize=14" title="VeeValidate nested-forms example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>
