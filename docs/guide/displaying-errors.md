# Displaying Errors

The `errors` array exposed on the `ValidationProvider` is a simple array containing error messages for the field as strings, you can manipulate the displayed field name and how many errors should be displayed for that field.

## Single error message

Typically you would want to display one error at a time for your fields, which is the first item in the `errors` array.

```vue{3}
<ValidationProvider rules="required" v-slot="{ errors }">
  <input v-model="value" type="text" />
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

## Multiple error messages

You will notice that only 1 error is generated. this is because vee-validate tries to be efficient by stopping validation on the first failure it encounters for any rule. to disable this behavior and force the validation to test against all rules you can provide `bails` prop set to `false` on the `ValidationProvider`.

```vue{4}
<ValidationProvider
  rules="required|min:3|alpha"
  v-slot="{ errors }"
  :bails="false"
>
  <input v-model="value" type="text" />
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

Additionally you can disable this behavior for all Providers by using the `bails` config:

```js
import { configure } from 'vee-validate';

// Disable fast-exit behavior for all providers in the app.
configure({ bails: false });
```

:::tip
  The `bails` prop takes precedence over the global config, that means you can have fields with either behavior at the same time in your app by passing a `bails` prop explicitly to those fields.
:::

Now that we've setup multiple errors generation properly, you can iterate over the `errors` array to display them with `v-for`:

```vue{4}
<ValidationProvider rules="required|min:3|alpha" v-slot="{ errors }" :bails="false">
  <input v-model="value" type="text" />
  <ul>
    <li v-for="error in errors">{{ error }}</li>
  </ul>
</ValidationProvider>
```

## Customizing the field name

So far you only saw `{field}` placeholder used in the error messages to refer to the field, you can change that by specifying a `name` prop on the `ValidationProvider`.

```vue{2}
<ValidationProvider
  name="first name"
  rules="required"
  v-slot="{ errors }"
>
  <input v-model="value" type="text" />
  <span>{{ errors[0] }}</span>
</ValidationProvider>
```

 <!-- TODO: Add localization and custom messages guide -->
<!-- Messages can also be localized and customized per field. -->

---

Now that we have got grasp of the basics, we can learn more about the validation provider.
