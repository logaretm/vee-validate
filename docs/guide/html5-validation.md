# HTML5 Validation

Consider this example:

```vue{2,6}
<ValidationProvider
  rules="required|email"
  v-slot="{ errors }"
>
  <div>
    <input required type="email" v-model="value">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

Notice how `email` and `required` was mentioned 2 times, once for vee-validate and once for the HTML5 validation API.

You can skip providing `rules` for the validation provider and the provider component would pick them up and match them with the built in rules. So the previous example can be written as:

```vue{1,3}
<ValidationProvider v-slot="{ errors }">
  <div>
    <input required type="email" v-model="value">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

And it would still work, The `ValidationProvider` can tell which HTML attributes on `input` elements that can be used as the rules source, allowing you to make much better and accessible forms with reduced verbosity.

:::tip Heads Up!
  This only works for **native HTML inputs**, those **"Inferred Rules"** can be reviewed in the [rules API reference](../api/rules.md).
:::

If you provide both `rules` prop and inferred rules at the same time they will be merged together, and if the same rules exist in both spots the `rules` prop ones will take precedence and override the inferred ones.

## Disabling inferred rules

You can disable the inferred rules behavior by setting the `useConstraintAttrs` config to `false`.

```js
import { configure } from 'vee-validate';

configure({
  useConstraintAttrs: false
});
```
