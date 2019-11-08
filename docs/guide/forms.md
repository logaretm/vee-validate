# Validating Forms

Now that you've learned how to use the `ValidationProvider` to validate your input fields, we can move on to validating forms in its entirety. For this we will be using another component called `ValidationObserver`, which like how it's name suggests it observers the validation state of fields within it.

You can think of `ValidationProvider` components as individual fields, and the `ValidationObserver` as a form. As such the `ValidationObserver` acts as an aggregator for its child providers or any components that extend them.

On other words, the `ValidationObserver` exposes a combined validation state of all its fields. The validation state that's aggregated is the `errors` and the validation flags.

## Basic Example

Let's create a basic form, It would be great if we are able to disable the submit button until the form is valid, let's use the `ValidationObserver` to do that:

```vue
<ValidationObserver v-slot="{ invalid }">
  <form @submit.prevent="onSubmit">
    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
      <input v-model="email" type="email">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="firstName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="lastName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <button type="submit" :disabled="invalid">Submit</button>
  </form>
</ValidationObserver>
```

<ValidationObserver v-slot="{ invalid }" slim>
  <form @submit.prevent="onSubmit">
    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
      <input v-model="values.email" type="email">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
    <input v-model="values.firstName" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
  <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
    <input v-model="values.lastName" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
  <button type="submit" :disabled="invalid">Submit</button>
  </form>
</ValidationObserver>

You can do that with all the validation flags.

## Validate Before Submit

What will also be great if we are able to validate before submitting the form, the `ValidationObserver` offers a `handleSubmit` function that you can use to protect your form submissions, the `handleSubmit` function accepts a submit handler and will only execute it once the form is valid and has been submitted by user.

```vue
<ValidationObserver v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(onSubmit)">
    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
      <input v-model="email" type="email">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="firstName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="lastName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <button type="submit">Submit</button>
  </form>
</ValidationObserver>
```

<ValidationObserver v-slot="{ handleSubmit }" slim>
  <form @submit.prevent="handleSubmit(onSubmit)">
    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
      <input v-model="values.email" type="email">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>
  <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
    <input v-model="values.firstName" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
  <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
    <input v-model="values.lastName" type="text">
    <span>{{ errors[0] }}</span>
  </ValidationProvider>
  <button type="submit">Submit</button>
  </form>
</ValidationObserver>

## Resetting Forms

You may want to reset the form state after successful submission or for whatever reason you may have, the `ValidationObserver` also exposes a `reset` method that you can use to reset forms.

```vue
<ValidationObserver v-slot="{ handleSubmit, reset }">
  <form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
    <ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
      <input v-model="email" type="email">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="firstName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
      <input v-model="lastName" type="text">
      <span>{{ errors[0] }}</span>
    </ValidationProvider>

    <button type="submit">Submit</button>
    <button type="reset">Reset</button>
  </form>
</ValidationObserver>
```

<ValidationObserver v-slot="{ handleSubmit, reset }">
<form @submit.prevent="handleSubmit(onSubmit)" @reset.prevent="reset">
<ValidationProvider name="E-mail" rules="required|email" v-slot="{ errors }">
  <input v-model="values.email" type="email">
  <span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider name="First Name" rules="required|alpha" v-slot="{ errors }">
<input v-model="values.firstName" type="text">
<span>{{ errors[0] }}</span>
</ValidationProvider>

<ValidationProvider name="Last Name" rules="required|alpha" v-slot="{ errors }">
<input v-model="values.lastName" type="text">
<span>{{ errors[0] }}</span>
</ValidationProvider>
<button type="submit">Submit</button>
<button type="reset">Reset</button>
</form>
</ValidationObserver>

:::tip
  The ValidationObserver `reset` method does not reset the value, this is up to you.
:::

## Nested Observers

There is no such thing as **nested forms** in HTML5 and for a good reason, it doesn't make a lot of sense to have two forms within each other. However the `ValidationObserver` components can be nested and this changes how you think about them, child `ValidationObserver` components now act as a `<fieldset>` rather than `<form>` tags.

You are probably wondering where this might be useful, consider having a multi-step form, you don't want to move from one step to the other unless the previous step is valid.

```vue
<ValidationObserver v-slot="{ handleSubmit }">
  <form @submit.prevent="handleSubmit(onSubmit)">
    <ValidationObserver v-if="currentStep === 1">
      <fieldset>
        <legend>Step 1</legend>
        <!-- Providers and fields -->
      </fieldset>
    </ValidationObserver>

    <ValidationObserver v-if="currentStep === 2">
      <fieldset>
        <legend>Step 2</legend>
        <!-- Providers and fields -->
      </fieldset>
    </ValidationObserver>

    <ValidationObserver v-if="currentStep === 3">
      <fieldset>
        <legend>Step 3</legend>
        <!-- Providers and fields -->
      </fieldset>
    </ValidationObserver>

    <button type="submit">Next</button>
  </form>
</ValidationObserver>
```

Here is an example for such a form:

<iframe src="https://codesandbox.io/embed/veevalidate-30-multi-step-form-example-i4tfh?fontsize=14" title="VeeValidate 3.0 - Multi-step Form example" allow="geolocation; microphone; camera; midi; vr; accelerometer; gyroscope; payment; ambient-light-sensor; encrypted-media" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

:::tip
 The previous example could've just used `div` elements instead of `ValidationObserver` components and it would've worked the same, We recommend you only nest observers where you need to know the fieldset current state.
:::

<script>
export default {
  data: () => ({
    values: {}
  }),
  methods: {
    onSubmit () {

    }
  }
}
</script>
