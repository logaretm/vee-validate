---
title: Checkbox and Radio Inputs
description: Validating checkboxes and Radio inputs
---

# Checkbox and Radio Inputs

The documentation has so far avoided using `type="radio"` and `type="checkbox"` inputs because of their complex nature, however vee-validate supports both HTML checkboxes and radio inputs as well as your custom components that act as such (with caveats).

The only requirements are that the fields:

<div class="features">

- Must be inside a `Form` component or a [derivative (using useForm)](./../api/use-form#creating-custom-form-components)
- Must Have the same `name` prop
- Should have a `type` attribute

</div>

## Validating Radio Inputs

vee-validate automatically assigns the value of the checked radio button to the `values` object sent to your submit function or present on the `Form` scoped-slot props.

```vue
<Form @submit="onSubmit">
  <Field name="drink" type="radio" value="" /> Coffee
  <Field name="drink" type="radio" value="Tea" /> Tea
  <Field name="drink" type="radio" value="Coke" /> Coke

  <ErrorMessage name="drink" />

  <button>Submit</button>
</Form>
```

## Validating Checkbox Inputs

vee-validate automatically assigns the value of the checked checkboxes as an array on the `values` object. Just like `v-model`.

```vue
<Form @submit="onSubmit">
  <Field name="drink" type="checkbox" value="" /> Coffee
  <Field name="drink" type="checkbox" value="Tea" /> Tea
  <Field name="drink" type="checkbox" value="Coke" /> Coke

  <ErrorMessage name="drink" />

  <button>Submit</button>
</Form>
```
