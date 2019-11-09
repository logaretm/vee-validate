# Validating Forms

Now that you've learned how to use the `ValidationProvider` to validate your input fields, we can move on to validating forms in its entirety. For this we will be using another component called `ValidationObserver`, which like how it's name suggests it observers the validation state of fields within it.

You can think of `ValidationProvider` components as individual fields, and the `ValidationObserver` as a form. As such the `ValidationObserver` acts as an aggregator for its child providers or any components that extend them.

On other words, the `ValidationObserver` exposes a combined validation state of all its fields. The validation state that's aggregated is the `errors` and the validation flags.

## Basic Example

Let's create a basic form, It would be great if we are able to disable the submit button until the form is valid, let's use the `ValidationObserver` to do that:

@[example](basic-form)

You can do that with all the validation flags.

## Validate Before Submit

What will also be great if we are able to validate before submitting the form, the `ValidationObserver` offers a `handleSubmit` function that you can use to protect your form submissions, the `handleSubmit` function accepts a submit handler and will only execute it once the form is valid and has been submitted by user.

@[example](validate-before-submit)

## Resetting Forms

You may want to reset the form state after successful submission or for whatever reason you may have, the `ValidationObserver` also exposes a `reset` method that you can use to reset forms.

@[example](form-reset)

:::tip
  The ValidationObserver `reset` method does not reset the values of the child fields, this is up to you.
:::

## Nested Observers

There is no such thing as **nested forms** in HTML5 and for a good reason, it doesn't make a lot of sense to have two forms within each other. However the `ValidationObserver` components can be nested and this changes how you think about them, child `ValidationObserver` components now act as a `<fieldset>` rather than `<form>` tags.

You are probably wondering where this might be useful, consider having a multi-step form, you don't want to move from one step to the other unless the previous step is valid.

@[example](nested-observers)

:::tip
 The previous example could've just used `div` elements instead of `ValidationObserver` components and it would've worked the same, We recommend you only nest observers where you need to know the fieldset current state.
:::
