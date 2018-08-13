# Inferred Rules

While you can specify your rules in the `v-validate` directive, vee-validate also deduces or infers additional rules based on the input type. For example if you have the following:

```html
<input
  name="email"
  type="email"
  required
>
```

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

| Attribute Name |   value      | Rule           |
| ------------- |:-------------:| -------- |
| type      | "email" |  `email`  |
| type      | "number"  | `decimal`  |
| type | "date" | `date_format:YYYY-MM-DD` |
| type | "datetime-local" | `date_format: YYYY-MM-DDThh:mm` |
| type | "time" | `date_format:hh:mm` or `date_format:hh:mm:ss` depending on the step value |
| type | "week" | `date_format:YYYY-Www` |
| type | "month | `date_format:YYYY-MM` |
| min | val |  min_value: val |
| max | val | max_value: val |
| pattern | rgx | regex: rgx |
| required | _none_ | required |

::: tip
  This feature does not work on custom components, only HTML5 inputs can take advantage from this feature.
:::

