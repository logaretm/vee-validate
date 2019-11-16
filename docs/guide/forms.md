# Validating Forms

Now that you've learned how to use the `ValidationProvider` to validate your input fields, what about validating forms in its entirety?

For this you will be using another component called `ValidationObserver`, which like how it's name suggests it observers the validation state of fields within it.

You can think of `ValidationProvider` components as individual fields, and the `ValidationObserver` as a form. As such the `ValidationObserver` acts as an aggregator for its child providers or any components that extend them.

On other words, the `ValidationObserver` exposes a combined validation state of all its fields. The validation state that's aggregated is the `errors` and the validation flags.

## Basic Example

Assuming you have a basic form, and you want to disable the submit button until the form is valid. You can use the `ValidationObserver` invalid flag exposed on the slot props:

@[example](basic-form)

All the `validation` flags exposed on the `ValidationProvider` are also available on the `ValidationObserver` slot props, so you can craft the UX you need for your forms.

## Validate Before Submit

Validating forms before submitting is a must when it comes to form validation, the `ValidationObserver` offers a `handleSubmit` function that you can use to protect your form submissions, the `handleSubmit` function accepts a submit handler and will only execute the handler once the user submits a valid form.

@[example](validate-before-submit)

## Resetting Forms

You may want to reset the form state after successful submission for re-usable forms or for whatever reason you may have. The `ValidationObserver` also exposes a `reset` method that you can use, the `reset` method reverts the validation state back to its initial state, for example: setting the `touched` and `dirty` flags to `false` and clearing all errors.

@[example](form-reset)

:::tip
  The ValidationObserver `reset` method does not reset the values of the child fields, this is up to you.
:::

## Programmatic Access with $refs

Typically, re-setting forms happens programmatically, and not as a response to event handlers like the previous example. Most of the time you will reset the forms once the submission succeeds. Also you may want to arbitrarily call the `validate` or `handleSubmit` methods on the `ValidationObserver` in your script rather than the template.

That means you need access to the `ValidationObserver` in your script. To do that, use the `ref` attribute, here is such an example that handles validation before submit then reset using `$refs`.

@[example](form-refs)

TODO: Public API Docs

:::tip
  Using `refs` gives you full access to the `ValidationObserver` component API, but it is recommended that you only use the documented API as any of the internals are subject to change. See the [ValidationObserver Public API]().
:::

## Persisting Provider State

The `ValidationObserver` only observes the currently rendered `ValidationProvider` instances, so if any `ValidationProvider` is hidden with `v-if` or removed with `v-for` it will automatically be excluded from the `ValidationObserver` state.

You might want the `ValidationObserver` **to keep unmounted providers** state, for example you could have a paged/multi-step form where the user can freely go to the next set of inputs without forcing the previous set to be valid, but you want to make sure that before they submit. All the pages/steps are valid.

For these cases you could use the Vue.js `keep-alive` built-in component. The `ValidationObserver` is able to detect cached `ValidationProvider` components and will keep their validation state reflected in its computation.

Here is an example that employs `keep-alive` to keep `ValidationProvider` state in its parent `ValidationProvider`:

@[example](persist-provider)

:::tip
  Even when fields are hidden/unmounted, as long as they wrapped with `keep-alive` their state will also be affected by `validate` and `reset` calls.
:::

## Nested Observers

There is no such thing as **nested forms** in HTML5 and for a good reason, it doesn't make a lot of sense to have two forms within each other. However the `ValidationObserver` components can be nested and this changes how you think about them, child `ValidationObserver` components now act as a `<fieldset>` rather than `<form>` tags.

This is only useful in very rare scenarios, where you need access to individual `fieldset` state at the same time. It is recommended to avoid having nested observers but you can do that if you want.

This is an example that uses nested observers:

@[example](nested-observers)

Here is the same example but without such nesting and only using one `ValidationObserver`:

@[example](no-nested-observers)

It is simpler to reason about than with multiple observers and for that scenario you don't need to know wether two observers are valid in the same time, there is only one rendered `ValidationObserver` at any given time which should give you a hint that you only need one from the start, not multiple ones.

---

You should now have enough information about building your next form, the only remaining thing is to tackle localization.
