---
title: Composition Helpers
description: Various composable functions to compose validation logic into your components
order: 7
---

# Composition Helpers

The composition helpers are various functions that you can use to craft specialized form components components, like a submission indicator component, or a custom error messages component.

These functions expose validation state to child components, most of these functions expose 2 variants of each state. On a form level and a field level.

## API Reference

<doc-tip>

All of the following code snippets assume you are using them inside a `setup` function.

</doc-tip>

<code-title level="4">

`useFieldError(field?: string): ComputedRef<string | undefined>`

</code-title>

Returns a computed ref to a single field's error message, returns `undefined` if no errors were found for that field or if the field does not exist.

```js
import { useFieldError } from 'vee-validate';

const message = useFieldError('fieldName');

message.value; // string or `undefined`
```

You can also use it in a child component that has a parent that used `useField`, The `useFieldError` will automatically pick up the field and produce its error messages.

```js
import { useFieldError } from 'vee-validate';

// Will look for the first parent that used `useField`
const message = useFieldError();
message.value;
```

<code-title level="4">

`useFormErrors(): ComputedRef<Record<string, string | undefined>>`

</code-title>

Returns a computed ref to the error bag of the entire form, fields with no errors will not be included in the error bag object.

```js
import { useFormErrors } from 'vee-validate';

const errors = useFormErrors();

message.value; // {}
```

<code-title level="4">

`useIsFieldDirty(field?: string): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the specified field's `dirty` meta state.

```js
import { useIsFieldDirty } from 'vee-validate';

const isDirty = useIsFieldDirty();

isDirty.value; // true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldDirty` will automatically pick up the field and produce its meta `dirty` value

```js
import { useIsFieldDirty } from 'vee-validate';

// Will look for the first parent that used `useField`
const isDirty = useIsFieldDirty();
```

<code-title level="4">

`useIsFormDirty(): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the context form `dirty` meta state.

```js
import { useIsFormDirty } from 'vee-validate';

const isDirty = useIsFormDirty();

isDirty.value; // if form exists: true or false
```

<code-title level="4">

`useIsFieldTouched(field?: string): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the specified field's `touched` meta state.

```js
import { useIsFieldTouched } from 'vee-validate';

const isTouched = useIsFieldTouched('fieldName');

isTouched.value; // if form exists: true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldTouched` will automatically pick up the field and produce its meta `touched` value

```js
import { useIsFieldTouched } from 'vee-validate';

// Will look for the first parent that used `useField`
const isTouched = useIsFieldTouched();
```

<code-title level="4">

`useIsFormTouched(): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the context form `touched` meta state.

```js
import { useIsFormTouched } from 'vee-validate';

const isTouched = useIsFormTouched();

isTouched.value; // if form exists: true or false
```

<code-title level="4">

`useIsFieldValid(field?: string): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the specified field's `valid` meta state.

```js
import { useIsFieldValid } from 'vee-validate';

const isValid = useIsFieldValid('fieldName');

isValid.value; // if form exists: true or false
```

You can also use it in a child component that has a parent that used `useField`, The `useIsFieldValid` will automatically pick up the field and produce its meta `valid` value

```js
import { useIsFieldValid } from 'vee-validate';

// Will look for the first parent that used `useField`
const isValid = useIsFieldValid();
```

<doc-tip type="warn">

You should only use the `valid` state to determine if a field is valid. The opposite is not accurate, meaning using this to determine if a field **is not valid** is not accurate because the field may not have been validated yet. To determine if a field is not valid you should check if it has an error message.

</doc-tip>

<code-title level="4">

`useIsFormValid(): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the context form `valid` meta state.

```js
import { useIsFormValid } from 'vee-validate';

const isValid = useIsFormValid();

isValid.value; // if form exists: true or false
```

<doc-tip type="warn">

You should only use the `valid` state to determine if a field is valid. The opposite is not accurate, meaning using this to determine if a field **is not valid** is not accurate because the field may not have been validated yet. To determine if a field is not valid you should check if it has an error message.

</doc-tip>

<code-title level="4">

`useValidateField(field?: string): () => Promise<ValidationResult>`

</code-title>

Returns a function that validates the field and returns a validation result object containing any errors, if the `errors` field is empty then it means the field is valid. If a field doesn't not exist it will return an empty `errors` field with a warning.

```js
import { useValidateField } from 'vee-validate';

const validate = useValidateField('fieldName');

await validate(); // { errors: [] }
```

You can also use it in a child component that has a parent that used `useField`, The `useValidateField` will automatically pick up the field and will return the function that validates it.

```js
import { useValidateField } from 'vee-validate';

// Will look for the first parent that used `useField`
const validate = useValidateField();
```

<code-title level="4">

`useValidateForm(): () => Promise<FormValidationResult>`

</code-title>

Returns a function that validates the form and returns a `Form`.

```js
import { useValidateForm } from 'vee-validate';

const validate = useValidateForm();

await validate(); // true or false
```

<code-title level="4">

`useIsSubmitting(): ComputedRef<boolean>`

</code-title>

Returns a computed ref to the form's `isSubmitting` state.

```js
import { useIsSubmitting } from 'vee-validate';

const isSubmitting = useIsSubmitting();

useIsSubmitting.value; // true or false
```

<code-title level="4">

`useSubmitCount(): ComputedRef<number>`

</code-title>

Returns a computed ref to the form's `submitCount` state.

```js
import { useSubmitCount } from 'vee-validate';

const count = useSubmitCount();

count.value;
```

<code-title level="4">

`useResetForm(): () => void`

</code-title>

Returns a function that you can use to reset the form

```js
import { useResetForm } from 'vee-validate';

const resetForm = useResetForm();

resetForm(); // resets the form
```
