# Validation Observer

Using [providers](./validation-provider.md) for validation is very handy but it introduces few usage problems of its own, for example how would you tell the current state. Let's say you want to disable a button as long as the form is invalid, how would you do that?

The ValidationObserver is a convenient component that also uses the [scoped slots feature](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots) to communicate the current state of your inputs as a whole.

Here is a small example, again with Vuetify components wrapped by the [Provider's wrap](./validation-provider.md#creating-high-order-components) method:

```vue
<ValidationObserver>
  <template slot-scope="{ invalid }">
    <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

    <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

    <v-btn :disabled="invalid" @click="submit()">Submit</v-btn>
  </template>
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
| untouched | `boolean`                   | True if all fields hasn't been tocuhed (blurred).                                           |
| errors    | `{ [x: string]: string[] }` | An object containing reference to each field errors, each field is keyed by its `vid` prop. |

## Examples

### Validate Before Submit

Validating before submit is even easier than the old way, using the [public methods](#methods) and a simple [ref](https://vuejs.org/v2/api/#ref) we can validate all providers before submitting the form.

```vue
<template>
  <ValidationObserver ref="observer">
    <template slot-scope="{ invalid }">
      <InputWithValidation rules="required" v-model="first" :error-messages="errors" />

      <InputWithValidation rules="required" v-model="second" :error-messages="errors" />

      <v-btn :disabled="invalid" @click="submit()">Submit</v-btn>
    </template>
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

::: tip
  Using the same approach you can reset validation state for all providers using the public method `reset()`.
:::

[You can see observers in action here](/examples/validation-providers.md)

### Scopes And Groups

The Validation Components API does not implement scopes and won't be, you can use the __ValidationObserver__ to group your fields without the complexties of the scopes API by using multiple observers and refs.

```vue
<template>
  <div>
    <ValidationObserver ref="obs1">
      <template slot-scope="{ invalid }">
        <!-- Fields -->
      </template>
    </ValidationObserver>

    <ValidationObserver ref="obs2">
      <template slot-scope="{ invalid }">
        <!-- Fields -->
      </template>
    </ValidationObserver>
  </div>
</template>

<script>
// Somewhere in a method ...
// validate the first observer.
this.$refs.$obs1.validate();

// validate the second observer.
this.$refs.$obs2.validate();
</script>
```

Simple and clean.

## Reference

Below is the reference of the ValidationObserver public API.

### Props

All the following props are optional.

|Prop       | Type      | Default Value         | Description                                                                  |
|-----------|-----------|-----------------------|------------------------------------------------------------------------------|
| tag       | `string`  | `span`                | The default HTML tag to be used to render the root element of the component. |

## Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationProvider are strictly internal.

|Method       | Args    | Return Value                  | Description                                                     |
|-------------|:-------:|:-----------------------------:|-----------------------------------------------------------------|
| validate    | `void`  | `Promise<boolean>`            | Validates all the child providers and also mutates their state. |
| reset       | `void`  | `void`                        | Resets validation state for all child providers.                |

### Events

The validation observer does not emit any events at this time.
