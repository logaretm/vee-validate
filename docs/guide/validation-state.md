# Validation State

The `ValidationProvider` and `ValidationObserver` components both expose validation state in their slot props, the state can be categorized into two categories:

- Validation Errors.
- Validation Flags.

We already covered a lot on the former, as messages are usually shown to help the user input correct values.

## Validation Flags

These are various boolean state values that indicate various actions done by the user on the input field. They are exposed on the `flags` property of the `ValidationProvider` slot props:

<ValidationProvider rules="required" v-slot="{ flags }">
  <div>
    <input type="text" v-model="values.classes">
    <pre class="no-highlight">{{ flags }}</pre>
  </div>
</ValidationProvider>

```vue{3,7}
<ValidationProvider
  rules="required"
  v-slot="{ flags }"
>
  <div>
    <input type="text" v-model="value">
    <pre>{{ flags }}</pre>
  </div>
</ValidationProvider>
```

Each flag's state is set depending on the following behavior:

- `touched`: indicates that the field has been touched or focused.
- `untouched`: indicates that the field has not been touched nor focused.
- `dirty`: indicates that the field has been manipulated.
- `pristine`: indicates that the field has not been manipulated.
- `valid`: indicates that the field has passed the validation.
- `invalid`: indicates that the field has failed the validation.
- `pending`: indicates that the field validation is in progress, helpful if you have long running validation.
- `validated`: indicates that the field has been validated at least once by a user event (input) or triggered manually using `validate()`.
- `changed`: indicates that the field value has been changed (strict check).

You can use these flags to give your users a great experience, for example you can disable a button if the field value didn't change.

<ValidationProvider
  rules="required"
  v-slot="{ flags }"
>
  <input type="text" v-model="values.changed">
  <button :disabled="!flags.changed">Submit</button>
</ValidationProvider>

```vue
<ValidationProvider
  rules="required"
  v-slot="{ flags }"
>
  <input type="text" v-model="value">

  <button :disabled="!flags.changed">Submit</button>
</ValidationProvider>
```

You can do a lot more, like disabling a button if any field in a form is invalid:

<ValidationObserver v-slot="{ valid }"><RuleDemo rule="required" /><RuleDemo rule="required|email" /><button :disabled="!valid">Submit</button></ValidationObserver>

```vue
<ValidationObserver v-slot="{ valid }">
  <ValidationProvider
    rules="required"
    v-slot="{ errors }"
  >
    <input type="text" v-model="name">
    <span>{{ errors[0] }}</span>

  </ValidationProvider>

  <ValidationProvider
    rules="required|email"
    v-slot="{ errors }"
  >
    <input type="text" v-model="email">
    <span>{{ errors[0] }}</span>

  </ValidationProvider>

  <button :disabled="!valid">Submit</button>
</ValidationObserver>
```

:::warning Undetermined
The `valid` and `invalid` flags are special, because both can be `null` at the same time. Initially the input state is undetermined for a very short window of time until vee-validate checks the state internally (silent validation). That is why in the previous example we used `!valid` instead of `invalid` since both will be falsy initially.
:::

<style lang="css">
.theme-default-content pre.no-highlight {
  background: #fff
}
</style>

<script>
export default {
  data: () => ({ values: { changed: '' } })
};
</script>
