# Validation Observer

Using [providers](./validation-provider.md) for validation is very handy but it introduces few usage problems of its own, for example how would you tell the current state of an entire form. Let's say you want to disable a button as long as the form is invalid, how would you do that?

The ValidationObserver is a convenient component that also uses the [scoped slots feature](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to communicate the current state of your inputs as a whole.

Here is a small example, with our refactored components:

```vue
<ValidationObserver v-slot="{ invalid }">
  <form>
    <TextFieldWithValidation rules="required" v-model="first" />

    <TextField WithValidation rules="required" v-model="second" />

    <button :disabled="invalid">Submit</button>
  </form>
</ValidationObserver>
```

## Scoped Slot Data

The scoped slot is passed an object containing a flags object representing the merged state of all providers registered under the observer. It contains the following properties:

| Name      |                          Type                           | Description                                                                                                                                                                          |
| :-------- | :-----------------------------------------------------: | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| dirty     |                        `boolean`                        | True if at least one field is dirty.                                                                                                                                                 |
| pristine  |                        `boolean`                        | True if all fields are pristine (not dirty).                                                                                                                                         |
| valid     |                        `boolean`                        | True if all fields are valid.                                                                                                                                                        |
| invalid   |                        `boolean`                        | True if at least one field is invalid.                                                                                                                                               |
| pending   |                        `boolean`                        | True if at least one field's validation is in progress.                                                                                                                              |
| touched   |                        `boolean`                        | True if at least one field has been touched (blurred).                                                                                                                               |
| untouched |                        `boolean`                        | True if all fields haven't been touched (blurred).                                                                                                                                   |
| errors    |               `{ [x: string]: string[] }`               | An object containing reference to each field errors, each field is keyed by its `vid` prop.                                                                                          |
| validate  | `({ silent: boolean }) => { then: () => Promise<any> }` | A method that triggers validation for all providers. Can be chained using `then` to run a method after validation. Mutates child providers state unless `silent` is true. |
| passes | `(cb: Function) => Promise<void>` | Calls validation like `validate` and mutates provider's state, accepts a callback to be run only if the validation is successful |
| reset     |                      `() => void`                       | A method that resets validation state for all providers.                                                                                                                             |

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

### Forcing Renderless

Sometimes it is unsuitable for a Provider component in principle to render anything extra, because of limitations in the Vue rendering output we cannot have multiple root nodes which limits the design choice to move away from renderless at the moment, in Vue 3.x it this may change with fragments.

A `slim` prop can be used to force the component to be renderless, by default it is set to `false`. The highlighted lines are the only rendered elements in the final output:

```vue{2,4}
<!-- Only the form inside the observer will be rendered -->
<ValidationObserver slim>
  <form>
    <!-- Fields -->
  </form>
</ValidationObserver>
```

Note that **only the first child** will be rendered when `slim` is used, any other nodes will be dropped as you cannot have multiple root nodes in a renderless component. Be mindful of that when using the `slim` prop.

```vue{2}
<!-- Only form is rendered. -->
<ValidationObserver slim>
  <form></form>
  <div></div>
</ValidationObserver>
```

## Examples

### Validate Before Submit

Validating before submit is very easy way, using the [public methods](#methods) and a simple [ref](https://vuejs.org/v2/api/#ref) we can validate all providers before submitting the form.

```vue{2,15}
<template>
  <ValidationObserver ref="observer" v-slot="{ invalid }" tag="form" @submit.prevent="submit()">
    <TextFieldWithValidation rules="required" v-model="first" />

    <TextFieldWithValidation rules="required" v-model="second" />

    <button :disabled="invalid">Submit</button>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    submit () {
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

You can trigger validation from the template using `passes` method which is convenient for running a handler if the form is valid:

```vue{2}
<template>
  <ValidationObserver v-slot="{ invalid, passes }">
    <form @submit.prevent="passes(submit)">
      <TextFieldWithValidation rules="required" v-model="first" />

      <TextFieldWithValidation rules="required" v-model="second" />

      <button :disabled="invalid">Submit</button>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    submit() {
      // No need to worry about form state
      // as this is only runs when the form is valid
      // 🐿 ship it
    }
  }
};
</script>
```

[You can see observers in action here](/examples/validation-providers.md)

### Adding errors to fields

While you can add errors manually to `ValidationProvider` with the `setErrors` method, it can be annoying to do so for multiple fields at once.

The `ValidationObserver` exposes a `setErrors` method that can set errors for its children providers.

```vue
<template>
  <div>
    <ValidationObserver ref="observer">
      <ValidationProvider vid="field1" v-slot="{ errors }">
        <input type="text" v-model="field1" />
        <span id="error1">{{ errors[0] }}</span>
      </ValidationProvider>

      <ValidationProvider vid="field2" v-slot="{ errors }">
        <input type="text" v-model="field2" />
        <span id="error2">{{ errors[0] }}</span>
      </ValidationProvider>
    </ValidationObserver>
  </div>
</template>

<script>
// Somewhere in a method, set the errors for each field.
this.$refs.observer.setErrors({
  field1: ['wrong'],
  field2: ['whoops']
});
</script>
```

Notice that the observer `setErrors` takes a different argument than the `ValidationProvider` method, as it accepts an object containing error arrays keyed by the `vid` of each provider.

Refer to the [live example](../examples/backend.md#adding-errors-manually) for more information.

### Resetting Forms

Like the `validate` method, we could also reset our form after submitting the values to the server. There are a few things to keep in mind:

- The observer does not reset the values on your inputs, you have to do that yourself.
- It only resets the validation state, being the error messages and flags.
- Vue renders updates asynchronously.

```vue{3,34,35,36}
<template>
  <ValidationObserver
    ref="observer"
    tag="form"
    @submit.prevent="submit()"
    v-slot="{ invalid }"
  >
    <TextFieldWithValidation rules="required" v-model="first" />

    <TextFieldWithValidation rules="required" v-model="second" />

    <button :disabled="invalid">Submit</button>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    async submit() {
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

### Grouping Fields

You can use the **ValidationObserver** to group your fields using multiple observers and refs.

```vue{3,7,16,19}
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

### Nested Observers

Building upon the previous example, observers can be nested to create nested forms for advanced use-cases. The outmost observer is able to trigger validation/resets on child observers and providers. Its state is also synced with the child observers and providers alike.

```vue{1,2,11,12}
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

### Persisting Provider Errors

Sometimes when building something like a multi-step form, you would need to use `v-if` on your providers to toggle the visibility of your steps. However, when the provider is hidden and shown again, it does not keep its state.

You can use the `persist` prop to allow the provider to **remember** its state across mounting/destroyed lifecycles, but there are a couple of caveats:

- Your Provider **must be inside** an **observer** component.
- Your Provider **must have** a `vid` property set.

```vue{5,6}
<ValidationObserver>
  <div v-if="!isHidden">
    <ValidationProvider
      rules="required|min:3|max:6"
      vid="myfield"
      :persist="true"
      v-slot="{ errors }"
    >
      <input type="text" v-model="value">
      {{ errors[0] }}
    </ValidationProvider>
  </div>
</ValidationObserver>
<button @click="isHidden = !isHidden">Toggle</button>
```

When querying the observer state, any errors will still be preserved even if the provider is not visible anymore.

## Reference

Below is the reference of the ValidationObserver public API.

### Props

| Prop | Type      | Default Value | Description                                                                                            |
| ---- | --------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| tag  | `string`  | `span`        | The default tag to [render](#rendering).                                                               |
| slim | `boolean` | `false`       | If true, it will make the observer [renderless](#renderless), only rendering the HTML inside its slot. |
| disabled | `boolean` | `false`       | If true, the observer will be ignored when `validate` is called by a parent observer. |

### Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationObserver are strictly internal.

| Method   |         Args          |    Return Value    | Description                                                                                  |
| -------- | :-------------------: | :----------------: | -------------------------------------------------------------------------------------------- |
| validate | `{ silent: boolean }` | `Promise<boolean>` | Validates all the child providers/observers and mutates their state unless `silent` is true. |
| reset    |        `void`         |       `void`       | Resets validation state for all child providers/observers.                                   |

### Events

The validation observer does not emit any events at this time.
