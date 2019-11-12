# Migration Guide

This document should help you navigate the tricky path of migrating between major versions of `vee-validate` that introduced breaking changes:

## Migrating from 2.x to 3.0

vee-validate 3.0 introduced a lot of breaking changes due to the deprecation of the main outlet of its validation, the `v-validate` directive was removed due to many design choices that wasn't suitable for the library moving forward. You should treat `3.x` as a different library and read the documentation carefully, however these are some pointers towards more of the significant changes.

To migrate from `2.x` you need to understand some of the changes to the public API and note that for the users of the `v-validate` directive there is not direct path to upgrade and if you have a large app and you don't need some of the newer features, consider staying at the 2.x releases.

### Directive deprecation

Fields that had the `v-validate` directive needs to be wrapped by `ValidationProvider` component now, and they need to use `v-model` to properly tag themselves for vee-validate.

So this:

```vue
<input type="text" name="field" v-validate="'required'">
<span>{{ errors.first('field') }}</span>
```

Becomes this:

```vue
<ValidationProvider name="field" rules="required" v-slot="{ errors }">
  <input type="text" v-model="value">
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

Much of the directive modifiers has been moved to be props on the `ValidationProvider`, be sure to go through the guide to learn most of the features.

### Handling Forms

VeeValidate no longer has `$validator`, `errors` or `fields` implicitly injected.

If you relied on `$validator` providing a **validate before submit** mechanism, you need to use `ValidationObserver` to wrap your form and use the `handleSubmit` function on the observer's slot.

Here is what the code looks like in `2.x`:

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

In `3.x` you need to do this:

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

## Handling Localization

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
