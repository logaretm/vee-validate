# Validation Observer

Using [providers](./validation-provider.md) for validation is very handy but it introduces few usage problems of its own, for example how would you tell the current state. Let's say you want to disable a button as long as the form is invalid, how would you do that?

The ValidationObserver is a convenient component that also uses the [scoped slots feature](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to communicate the current state of your inputs as a whole.

Here is a small example, again with Vuetify components wrapped by the [Provider's withValidation](./validation-provider.md#creating-high-order-components) method:

```vue
<ValidationObserver v-slot="{ invalid }">
  <form @submit.prevent="submit">
    <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

    <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

    <v-btn :disabled="invalid">Submit</v-btn>
  </form>
</ValidationObserver>
```

## Rendering

[Like providers](./validation-provider.md#rendering), observers render a `span` by default. You can customize the rendered tag using the `tag` prop, for example a `form` tag might be more useful.

```vue
<!-- Render a form -->
<ValidationObserver tag="form">
  <!-- Fields -->
</ValidationObserver>
```

You can expand upon this by adding your form listeners like `submit` on the observer directly:

```vue
<!-- Render a form -->
<ValidationObserver tag="form" @submit.prevent="onSubmit">
  <!-- Fields -->
</ValidationObserver>
```

### Renderless

Sometimes it is unsuitable for a Provider component in principle to render anything extra, because of limitations in the Vue rendering engine we cannot have multiple root nodes which limits the design choice to move away from renderless at the moment, in Vue 3.x it this may change with fragments.

In 2.2.10 a `slim` prop can be used to force the component to be renderless, by default it is set to `false`.

```vue
<!-- Only the stuff inside the observer will be rendered -->
<ValidationObserver slim>
  <form>
    <!-- Fields -->
  </form>
</ValidationObserver>
```

Note that **only the first child** will be rendered when `slim` is used, any other nodes will be dropped as you cannot have multiple root nodes in a renderless component. Be mindful of that when using the `slim` prop.

```vue
<!-- Only form is rendered. -->
<ValidationObserver slim>
  <form></form>
  <div></div>
</ValidationObserver>
```

## Scoped Slot Data

The scoped slot is passed an object containing a flags object representing the merged state of all providers registered under the observer. It contains the following properties:

| Name      | Type                        |  Description                                                                                |
|:----------|:---------------------------:|:--------------------------------------------------------------------------------------------|
| dirty     | `boolean`                   | True if at least one field is dirty.                                                        |
| pristine  | `boolean`                   | True if all fields are pristine (not dirty).                                                |
| valid     | `boolean`                   | True if all fields are valid.                                                               |
| invalid   | `boolean`                   | True if at least one field is invalid.                                                      |
| pending   | `boolean`                   | True if at least one field's validation is in progress.                                     |
| touched   | `boolean`                   | True if at least one field has been touched (blurred).                                      |
| untouched | `boolean`                   | True if all fields haven't been touched (blurred).                                           |
| errors    | `{ [x: string]: string[] }` | An object containing reference to each field errors, each field is keyed by its `vid` prop. |
| validate  | `({ silent: boolean }) => { then: () => Promise<any> }` | A method that triggers validation for all providers. Can be chained using `then` to run a method after successful validation. Mutates child providers state unless `silent` is true. |
| reset     | `() => void`                | A method that resets validation state for all providers. |

## Examples

### Validate Before Submit

Validating before submit is even easier than the old way, using the [public methods](#methods) and a simple [ref](https://vuejs.org/v2/api/#ref) we can validate all providers before submitting the form.

```vue
<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="submit()">
    <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

    <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

    <v-btn :disabled="invalid">Submit</v-btn>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    async submit () {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
      }

      // 🐿 ship it
    }
  }
};
</script>
```

If you plan to trigger validation from the template without using `refs` you can use the `validate` method present in the scopedSlot data.

```vue
<template>
  <ValidationObserver v-slot="{ invalid, validate }">
    <form @submit.prevent="validate().then(submit)">
      <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

      <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

      <v-btn :disabled="invalid">Submit</v-btn>
    </form>
  </ValidationObserver>
</template>
```

As you have guessed, the `validate` method on the Observer's scopedSlot is thenable, meaning you can chain another method to run after the validation passes like the form submission handler. Note that the `validate` method does not return a promise, but a promise-like object that has a `then` method for convenience, which can be also chained further.

[You can see observers in action here](/examples/validation-providers.md)

### Resetting Forms

Like the `validate` method, we could also reset our form after submitting the values to the server. There are a few things to keep in mind:

- The observer does not reset the values on your inputs, you have to do that yourself.
- It only resets the validation state, being the error messages and flags.
- Vue does renders updates asynchronously.

```vue
<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="submit()">
    <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

    <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

    <v-btn :disabled="invalid">Submit</v-btn>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    async submit () {
      const isValid = await this.$refs.observer.validate();
      if (!isValid) {
        // ABORT!!
      }

      // 🐿 ship it
      // sending to API...
      // ...

      // reset the values ...
      this.first = '';
      this.second = '';

      // You should call it on the next frame
      requestAnimationFrame(() => {
        this.$refs.observer.reset();
      });
    }
  }
};
</script>
```

Notice the usage of [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame), this is because Vue does not update the values immediately after you set them. So you need to reset the state after the UI has been stabilized, otherwise some inputs may report an invalid state.

### Scopes And Groups

The Validation Components API does not implement scopes and won't be, you can use the __ValidationObserver__ to group your fields without the complexties of the scopes API by using multiple observers and refs.

```vue
<template>
  <div>
    <ValidationObserver tag="form" ref="obs1" v-slot="{ invalid }">
      <!-- Fields -->
    </ValidationObserver>

    <ValidationObserver tag="form" ref="obs2" v-slot="{ invalid }">
      <!-- Fields -->
    </ValidationObserver>
  </div>
</template>

<script>
// Somewhere in a method ...
// validate the first observer.
this.$refs.obs1.validate();

// validate the second observer.
this.$refs.obs2.validate();
</script>
```

Simple and clean.

### Nested Observers

Building upon the previous example, observers can be nested to create nested forms for advanced use-cases. The outmost observer is able to trigger validation/resets on child obeservers and providers. Its state is also synced with the child observers and providers alike.

```vue
<ValidationObserver ref="op" v-slot="observer">
  <ValidationObserver ref="oc">
    <ValidationProvider rules="required" v-slot="provider">
      <input type="text" v-model="value">
      <span>{{ provider.errors[0] }}</span>
    </ValidationProvider>
    <!-- This is synced with the state of all children providers/observers -->
    <pre>
      {{ observer }}
    </pre>
  </ValidationObserver>
</ValidationObserver>
```

## Reference

Below is the reference of the ValidationObserver public API.

### Props

|Prop   | Type     | Default Value         | Description                                                      |
|-------|----------|------------------|-----------------------------------------------------------------------|
| tag  | `string`  | `span`     | The default tag to [render](#rendering).      |
| slim | `boolean` | `false`    | If true, it will make the observer [renderless](#renderless), only rendering the HTML inside its slot. |

### Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationObserver are strictly internal.

|Method       | Args    | Return Value                  | Description                                                     |
|-------------|:-------:|:-----------------------------:|-----------------------------------------------------------------|
| validate    | `{ silent: boolean }`  | `Promise<boolean>` | Validates all the child providers/observers and mutates their state unless `silent` is true. |
| reset       | `void`  | `void`                        | Resets validation state for all child providers/observers.                |

### Events

The validation observer does not emit any events at this time.
