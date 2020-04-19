---
sidebarDepth: 1
---

# Migration Guide

This document should help you navigate the tricky path of migrating between different versions of `vee-validate` that introduced breaking changes:

## Migrating from 3.2.x to 3.3.0

Only 1 minor change was introduced which could be breaking to some edge cases.

### `v-model` detection limited to 1 Node

Starting from 3.3.0, the `ValidationProvider` will only look for exactly 1 node with the `v-model` attached to it. This shouldn't affect you as usually you had 1:1 input to `ValidationProvider` relation, but in some cases when you have more complex template inside the `ValidationProvider`, you should make sure your input that will be validated will come first in the tree.

## Migrating from 3.0.x to 3.1.0

There aren't breaking changes introduced in `3.1` but there could some minor issues when upgrading to `3.1` from `3.0.x`.

### Removed: ValidationProvider `persist` prop

The `persist` prop has been removed from the `ValidationProvider` for a better alternative in the Vue core, instead of using `persist` prop to keep the validation state of unmounted providers use the `keep-alive` component, this is what it supposed to do and it works perfectly with vee-validate.

For more information, see [Persisting Provider State](./guide/forms.md#persisting-provider-state)

### Renamed: ValidationObserver `passes` slot prop method

The method `passes` was used to trigger validation before submitting and only submits if the form is valid, because it will be confusing with `passed` boolean slot prop, it is now renamed to `handleSubmit` which makes it clear and explicit.

### Removed: ValidationObserver's internal `ctx` prop

The `ctx` computed prop was never meant to be used publicly but it provided suitable programmatic access to the observer's combined state, this was removed because the state is no longer computed and is debounced by watcher and a setter instead.

You can use two new data properties called `errors` and `flags` which should cater to the same use-case as the deprecated `ctx` prop.

## Migrating from 2.x to 3.0

vee-validate 3.0 introduced a lot of breaking changes due to the deprecation of the main outlet of its validation, the `v-validate` directive was removed due to many design choices that wasn't suitable for the library moving forward. You should treat `3.x` as a different library and read the documentation carefully, however these are some pointers towards more of the significant changes.

To migrate from `2.x` you need to understand some of the changes to the public API and note that for the users of the `v-validate` directive there is not direct path to upgrade and if you have a large app and you don't need some of the newer features, consider staying at the 2.x releases.

### Removed: v-validate directive

Fields that had the `v-validate` directive needs to be wrapped by `ValidationProvider` component now, and they need to use `v-model` to properly tag themselves for vee-validate.

So this:

```vue
<input type="text" name="field" v-validate="'required'">
<span>{{ errors.first('field') }}</span>
```

Will be re-written as this:

```vue
<ValidationProvider name="field" rules="required" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Much of the directive modifiers has been moved to be props on the `ValidationProvider`, be sure to go through the guide to learn most of the features.

### Removed: Injected \$validator property

VeeValidate no longer has `$validator`, `errors` or `fields` implicitly injected. If you relied on `$validator` providing a **validate before submit** mechanism, you need to use `ValidationObserver` to wrap your form and use the `handleSubmit` function on the observer's slot.

Here is what the code looks like in `2.x`:

So in your old code if you had this:

```vue
<template>
  <form @submit.prevent="validateBeforeSubmit">
    <input type="text" name="fname" v-validate="'required'" />
    <input type="text" name="lname" v-validate="'required'" />

    <button>Submit</button>
  </form>
</template>

<script>
export default {
  methods: {
    validateBeforeSubmit() {
      this.$validator.validate().then(success => {
        // Do something!
      });
    }
  }
};
</script>
```

It should be re-written as this:

```vue
<template>
  <ValidationObserver v-slot="{ handleSubmit }">
    <form @submit.prevent="handleSubmit(submit)">
      <ValidationProvider v-slot="props">
        <input type="text" name="fname" v-validate="'required'" />
      </ValidationProvider>

      <ValidationProvider v-slot="props">
        <input type="text" name="lname" v-validate="'required'" />
      </ValidationProvider>

      <button>Submit</button>
    </form>
  </ValidationObserver>
</template>

<script>
export default {
  methods: {
    submit() {
      // Only executes when validation passes!
    }
  }
};
</script>
```

For more information, see the [Validate Before Submit](./guide/forms.md#validate-before-submit)

### Removed: `ErrorBag` and `Validator` classes

If you used `Validator`, you might want to use `validate()` instead which is a stateless function that allows you to validate arbitrary values. For more information, see [Advanced: Programmatic Validation](./advanced/programmatic-validation.md).

There isn't an alternative to the `ErrorBag` class.

### Removed: `mapFields` function

You longer have access to `mapFields` function, instead you should either use `$refs` or do most of your logic in the template.

### Reworked: Localization

#### data-vv-as

The `v-validate` directive usually was looking at `data-vv-as` attribute that can give the field a friendly name and even a localized name, `ValidationProvider` replaces this functionality with `name` and `vid` props, where the `name` is the "friendly name" for your field while the `vid` is the validation id that will be used to target the field in cross-field validation and to distinguish the field.

```vue
<input type="text" name="email" v-validate="'required'" data-vv-as="E-mail Address">
<span>{{ errors.first('email') }}</span>
```

Will instead be this:

```vue
<ValidationProvider vid="email" name="E-mail Address" rules="required" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

#### Dictionary and Locales

You no longer have access to the underlying dictionary used by vee-validate, instead use `localize()` function. For more information, see [Guide: Localization](./guide/localization.md)

#### Localization Files

Localization Files have been changed to be `json` files, while this makes them harder to use in browser or `UMD` environments, using JSON files is common in localization libraries and allows them to be easily imported into various tools used by translators or converted into more dedicated formats.
