# Multiple Forms

VeeValidate allows you to create **logical** forms with the `ValidationObserver` component, as it can be nested and controlled by parent observers. Although recommended, you don't have to use the `form` tag.

The following are some common examples where you would have multiple forms in the same component.

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

## Multi-step Forms

Tabbed forms structure isn't special per say, they are not that different from the last example. But the caveat is that you want to maintain the validation state even if the provider is hidden.

This is when `persist` prop comes into play. This tells each parent observer to "remember" the state of its direction provider children, so when they are rendered next time they will get their state back.

Ideally in this example you wouldn't pass a step unless the current active set is valid. But they can go back freely to update their previous inputs.

<iframe src="https://codesandbox.io/embed/veevalidate-30-multi-step-form-example-i4tfh?fontsize=14" title="VeeValidate 3.0 - Multi-step Form example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

:::tip Tip
Note that we don't need to use nested observers a lot here, they are only useful if you want to "group" some providers in a larger form structure.
:::
