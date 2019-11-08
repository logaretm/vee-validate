# Validating Forms

Now that you've learned how to use the `ValidationProvider` to validate your input fields, we can move on to validating forms in its entirety. For this we will be using another component called `ValidationObserver`, which like how it's name suggests it observers the validation state of fields within it.

## Basic Example

Let's create a basic form:

```vue
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

  <button type="submit">Submit</button>
</form>
```

It would be great if we are able to disable the submit button until the form is valid,