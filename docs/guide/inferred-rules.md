# Inferred Rules

While you can specify your rules in the `v-validate` directive, you can also let vee-validate resolve rules from native HTML5 elements based on their [validation attributes](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) and their type. You can enable this behavior by setting the `validity` option to `true`.

## Enabling Validity

```js
// When installing the plugin.
Vue.use(VeeValidate, { validity: true });
```

## Example

It would be redundant to specify `v-validate="'required|email'"`. vee-validate will detect the input type and the required attribute and include those rules for you automatically, so you would only need to add `v-validate` on the input.

```html
<input
  name="email"
  type="email"
  required
  v-validate
>
```

## Demo

<iframe src="https://codesandbox.io/embed/y3504yr0l1?initialpath=%2F%23%2Finfer&module=%2Fsrc%2Fcomponents%2FInfer.vue" style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;" sandbox="allow-modals allow-forms allow-popups allow-scripts allow-same-origin"></iframe>

[![Edit VeeValidate Examples](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/y3504yr0l1?initialpath=%2F%23%2Finfer&module=%2Fsrc%2Fcomponents%2FInfer.vue)

## Inferred Rules Reference

This is a table of HTML attributes that is inferred as rules.

| Attribute |   value          | Rule                                                                      |
|-----------|:----------------:|---------------------------------------------------------------------------|
| type      | "email"          |  `email`                                                                  |
| type      | "number"         | `decimal`                                                                 |
| type      | "date"           | `date_format:YYYY-MM-DD`                                                  |
| type      | "datetime-local" | `date_format: YYYY-MM-DDThh:mm`                                           |
| type      | "time"           | `date_format:hh:mm` or `date_format:hh:mm:ss` depending on the step value |
| type      | "week"           | `date_format:YYYY-Www`                                                    |
| type      | "month           | `date_format:YYYY-MM`                                                     |
| min       | val              |  min_value: val                                                           |
| max       | val              | max_value: val                                                            |
| pattern   | rgx              | regex: rgx                                                                |
| required  | _none_           | required                                                                  |

::: tip
  This feature does not work on custom components, only HTML5 inputs can take advantage from this feature.
:::
