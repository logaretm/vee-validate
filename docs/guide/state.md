# Validation State

In our previous example we used `errors` to display the field errors, but the `errors` array is only a part of the validation state available to you. There are other state items that can prove useful to you when building accessible and pleasant forms.

## Flags

The validation flags is a set of boolean values that gives you information about the field you are validating, for example you may want to know if the field is currently valid, or if it is blurred by the user.

This is a table of all the flags available that you can access:

| Name      |   Type    | Default | Description                                       |
| :-------- | :-------: | :-----: | :------------------------------------------------ |
| valid     | `boolean` | `false` | If The field is valid.                            |
| invalid   | `boolean` | `false` | If the field is invalid.                          |
| changed   | `boolean` | `false` | If the field value has been changed.              |
| touched   | `boolean` | `false` | If the field has been blurred.                    |
| untouched | `boolean` | `true`  | If the field wasn't blurred.                      |
| pristine  | `boolean` | `true`  | If the field value was not manipulated.           |
| dirty     | `boolean` | `false` | If the field value has been manipulated.          |
| pending   | `boolean` | `false` | Indicates if the field validation is in progress. |
| required  | `boolean` | `false` | If the field is required.                         |
| validated | `boolean` | `false` | If the field has been validated at least once.    |
| passed    | `boolean` | `false` | If the field has been validated and is valid.     |
| failed    | `boolean` | `false` | If the field has been validated and is invalid.   |

These flags are supported for all types of HTML5 inputs as well as custom components that emit the proper events for these flags.

:::tip
To support all the flags for your custom component you need to emit an `input` event and a `blur` event.
:::

These flags are exposed as a slot prop on the `ValidationProvider` component, this is a small demo for these flags:

```vue
<ValidationProvider
  name="field"
  rules="required"
  v-slot="{
    valid,
    invalid,
    changed,
    touched,
    untouched,
    pristine,
    dirty,
    pending,
    required,
    validated,
    passed,
    failed
  }"
>
  <input type="text" v-model="value">
  <ul class="BooleanSwitches">
    <li>valid: {{ valid }}</li>
    <li>invalid: {{ invalid }}</li>
    <li>changed: {{ changed }}</li>
    <li>touched: {{ touched }}</li>
    <li>untouched: {{ untouched }}</li>
    <li>pristine: {{ pristine }}</li>
    <li>dirty: {{ dirty }}</li>
    <li>pending: {{ pending }}</li>
    <li>required: {{ required }}</li>
    <li>validated: {{ validated }}</li>
    <li>passed: {{ passed }}</li>
    <li>failed: {{ failed }}</li>
  </ul>
</ValidationProvider>
```

<ValidationProvider
  name="field"
  rules="required"
  v-slot="{
    valid,
    invalid,
    changed,
    touched,
    untouched,
    pristine,
    dirty,
    pending,
    required,
    validated,
    passed,
    failed
  }"
>
  <input type="text" v-model="values.flags">
  <ul class="BooleanSwitches">
    <li :class="`is-${valid}`">valid: {{ valid }}</li>
    <li :class="`is-${invalid}`">invalid: {{ invalid }}</li>
    <li :class="`is-${changed}`">changed: {{ changed }}</li>
    <li :class="`is-${touched}`">touched: {{ touched }}</li>
    <li :class="`is-${untouched}`">untouched: {{ untouched }}</li>
    <li :class="`is-${pristine}`">pristine: {{ pristine }}</li>
    <li :class="`is-${dirty}`">dirty: {{ dirty }}</li>
    <li :class="`is-${pending}`">pending: {{ pending }}</li>
    <li :class="`is-${required}`">required: {{ required }}</li>
    <li :class="`is-${validated}`">validated: {{ validated }}</li>
    <li :class="`is-${passed}`">passed: {{ passed }}</li>
    <li :class="`is-${failed}`">failed: {{ failed }}</li>
  </ul>
</ValidationProvider>

## Failed Rules

Failed rules is similar to `errors` but you can use it to find out which rules invalidated the field, useful if you are planning to have some SSR error messages that's injected by PHP or other backend technologies.

Just like the `errors` array, by default it will only contain 1 key because of the **fast-exit** strategy, if we disable this behavior we can see our failed rules mapped to their message:

```vue
<ValidationProvider
  name="field"
  :bails="false"
  rules="required|min:3|email|max:100"
  v-slot="{
    failedRules
  }"
>
  <input type="text" v-model="value">
  <pre>{{ failedRules }}</pre>
</ValidationProvider>
```

<ValidationProvider
  name="field"
  rules="required|min:3|email|max:100"
  :bails="false"
  v-slot="{
    failedRules
  }"
>
  <input type="text" v-model="values.failedRules">
  <pre style="color: white;">{{ failedRules }}</pre>
</ValidationProvider>

<style lang="stylus">
  .BooleanSwitches
    list-style: none
    padding: 0
    margin: 0
    margin-top: 20px
    box-sizing: border-box
    column-count: 3

    li
      padding: 5px 10px
      transition: background-color 0.3s, color 0.3s ease-in-out
      font-weight: bold
      border-radius: 20px
      text-align: center

      &.is-true
        background-color: #0AE569
        color: #045929

      &.is-false
        background-color: #FFA4A2
        color: #EB0600

    li + li
      margin-top: 10px

</style>

## CSS Classes

VeeValidate also provides a reactive `classes` state that you can use to bind to your input, the classes themselves are mapped from the validation flag state which isn't very useful but you can configure how flags map to class names using the global `configure` function:

```js
import { configure } from 'vee-validate';

configure({
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid',
    dirty: ['is-dirty', 'is-dirty'], // multiple classes per flag!
    // ...
  }
})
```

You don't have to configure all the classes, just configure what you need and once you are done you can directly use class binding to apply them to your input.

```vue
<ValidationProvider
  name="field"
  rules="required|min:3|email|max:100"
  :bails="false"
  v-slot="{
    classes
  }"
>
  <div class="control" :class="classes">
    <input type="text" v-model="value">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

<ValidationProvider
  name="field"
  rules="required|min:3|email|max:100"
  :bails="false"
  v-slot="{
    classes,
    errors
  }"
>
  <div class="control" :class="classes">
    <input type="text" v-model="values.classes">
    <span>{{ errors[0] }}</span>
  </div>
</ValidationProvider>

<style lang="stylus">
  .control
    width: 100%
    span
      display: block
    input
      padding: 5px 10px

    &.invalid
      input, span
        color: #EB0600
      input
        border: 1px #EB0600 solid
    &.valid
      input, span
        color: #045929
      input
        border: 1px #045929 solid

</style>

## Aria Attributes

`ValidationProvider` also exposes two more state items that can be used to enhance the accessability of your forms, the `ariaInput` and `ariaMsg` objects contain `aria-*` attributes that you can directly bind to your inputs just like classes:

```vue
<ValidationProvider
  name="field"
  rules="required|email"
  :bails="false"
  v-slot="ctx"
>
  <div>
    <input type="text" v-model="value" v-bind="ariaInput">
    <span v-bind="ariaMsg">{{ errors[0] }}</span>
  </div>
</ValidationProvider>
```

<ValidationProvider
  name="a11y"
  rules="required|email"
  :bails="false"
  v-slot="{ errors, ariaMsg, ariaInput }"
>
  <div>
    <input type="text" v-model="value" v-bind="ariaInput">
    <span v-bind="ariaMsg">{{ errors[0] }}</span>
  </div>
</ValidationProvider>

You can use your devtools to check which attributes where applied on each element.

<script>
export default {
  data: () => ({
    values: {}
  })
}
</script>

---

Now that you got the validation state under your belt we can move on to building actual forms!
