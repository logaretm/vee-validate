# Handling Forms

Now that you've learned how to use the `ValidationProvider` to validate your input fields, what about validating forms in its entirety?

For this you will be using another component called `ValidationObserver`, which like how its name suggests, observes the validation state of fields within it.

You can think of `ValidationProvider` components as individual fields, and the `ValidationObserver` as a form. As such the `ValidationObserver` acts as an aggregator for its child providers or any components that extend them.

In other words, the `ValidationObserver` exposes a combined validation state of all its fields. The validation state that's aggregated is the `errors` and the validation flags.

## Basic Example

Assuming you have a basic form, and you want to disable the submit button until the form is valid. You can use the `ValidationObserver` invalid flag exposed on the slot props:

@[example](basic-form)

All the `validation` flags exposed on the `ValidationProvider` are also available on the `ValidationObserver` slot props, so you can craft the UX you need for your forms.

## Validate Before Submit

Validating forms before submitting is a must in form validation.
The `ValidationObserver` offers a `handleSubmit` function that you can use to protect your form submissions. This `handleSubmit` function accepts a submit handler and will only execute the handler once the user submits a valid form.

@[example](validate-before-submit)

## Resetting Forms

You may want to reset the form state after successful submission. This can be useful in re-usable forms and other situations. The `ValidationObserver` exposes a `reset` method that you can use for this purpose. The `reset` method reverts the validation states back to their initial state.
For example: setting the `touched` and `dirty` flags to `false` and clearing all errors.

@[example](form-reset)

:::tip
The ValidationObserver `reset` method does not reset the values of the child fields, this is up to you.
:::

## Programmatic Access with \$refs

Typically, resetting forms happens programmatically once the submission succeeds, and not as a response to event handlers like in the previous example. In addition, you may want to arbitrarily call the `validate` or `handleSubmit` methods on the `ValidationObserver` in your script rather than the template. You can also use `validateWithInfo` which returns more detailed information about the validation like error messages and the fields involved in the validation.

That means you need access to the `ValidationObserver` in your script. To do that, use the `ref` attribute.
Here is an example that handles validation before submit and then resetting using `$refs`.

@[example](form-refs)

:::tip
Using `refs` gives you full access to the `ValidationObserver` component API, but it is recommended that you only use the documented API as any of the internals are subject to change.
See the [ValidationObserver Public API](../api/validation-observer.md).
:::

:::tip TypeScript

When using `$refs` with TypeScript, you have to provide the typings for the `ValidationObserver` or `ValidationProvider` instances which can be done using `InstanceType` utility type. Use it like the following snippet:

:::

```ts
import { ValidationObserver } from 'vee-validate';

export default class App extends Vue {
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>;
  };

  mounted() {
    this.$refs.observer;
  }
}
```

## Initial State Validation

The `ValidationProvider` doesn't validate initially, but you can use the `immediate` prop to validate your fields upon rendering:

```vue{3}
<ValidationProvider rules="required" immediate v-slot="{ errors }">
  <!-- -->
</ValidationProvider>
```

This will validate the fields immediately when they are rendered.

This is an example of such a form:

@[example](immediate-form)

## Persisting Provider State

The `ValidationObserver` only observes the currently rendered `ValidationProvider` instances. If any `ValidationProvider` is hidden with `v-if` or removed with `v-for` it will automatically be excluded from the `ValidationObserver` state.

You might want the `ValidationObserver` to **keep the state of unmounted providers**. for example you could have a paged/multi-step form where the user can freely go to the next set of inputs without forcing the previous set to be valid, but you want to make sure all the pages/steps are valid before they submit the entire form.

In these cases you can use the Vue.js `keep-alive` built-in component. The `ValidationObserver` is able to detect cached `ValidationProvider` components and will keep their validation state reflected in its computation.

Here is an example that employs `keep-alive` to keep `ValidationProvider` state in its parent `ValidationProvider`:

@[example](persist-provider)

:::tip
Even when fields are hidden/unmounted, as long as they wrapped with `keep-alive` their state will also be affected by `validate` and `reset` calls.
:::

## Nested Observers

There is no such thing as **nested forms** in HTML5 and for a good reason: It doesn't make a lot of sense to have two forms within each other. However, the `ValidationObserver` components can be nested and this changes how you must think about them.
Nested/Child `ValidationObserver` components will now act as a `<fieldset>` rather than `<form>` tags.

This is only useful in very rare scenarios where you need access to individual `fieldset` states at the same time and it is recommended to avoid having such nested observers (but you can do that if you want).

This is an example that uses nested observers:

@[example](nested-observers)

Here is the same example but without such nesting and only using one `ValidationObserver`:

@[example](no-nested-observers)

It is simpler to think about non-nested observers than multiple observers. For the shown scenario it is unnecessary to know whether two observers are valid at the same time. This is because there is only one rendered `ValidationObserver` at any given time. Having such a situation should give you a hint about only needing one from the start.

## Advanced Forms

Some forms have more complex requirements, like **input masks** or file validation. VeeValidate allows you to hook your complex inputs into the validation cycle.
To do this [see the advanced file-validation guide](../advanced/model-less-validation.md).

---

You should now have enough information on building your next form. The only thing remaining is to tackle localization.
