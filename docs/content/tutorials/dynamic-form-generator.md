---
title: Build a Form Generator
description: Learn how to build a schema-generated form
order: 2
---

# Build a Form Generator

Building forms is annoying and an often repetitive task and requires a lot of back and forth to maintain, maybe your client asked to add a field, maybe they asked to remove a field, for most cases using static markup is good enough for your web form needs but in some cases, it would great if you had a dynamic form generator that would quickly render your fields based on some JSON schema.

In this tutorial you will learn how to use vee-validate to build your own form-generator without external libraries.

Let's quickly recap what you will be building, the component we will be building should:

<div class="features">

- Accept a form schema specifying the fields
- Render the given schema
- Specify initial values for the fields
- Use yup to validate our form
- Show error messages

</div>

<doc-tip>

This guide will cover how to build a basic form generator.

If you are looking for a more robust solution for form generation, take a look at [Formvuelate](https://formvuelate.js.org/), and it has first-party [vee-validate support](https://formvuelate.js.org/#vee-validate-plugin).

</doc-tip>

## Prerequisites

You will need to be familiar with HTML and a good understanding of modern JavaScript like arrow functions and ES modules, you need to have a basic understanding of Vue's `v-for` and prop binding using `v-bind` and its shorthand `:`.

Some basic understanding of typescript would help understand some ideas but not required.

## Laying The Foundation

Instead of diving into the details first, let's take a step back and imagine we got the implementation done. How would you use such a component? It is often a good practice to mock/use your abstractions before implementing them to make sure you are on the right track.

So assuming we have a component called `DynamicForm` that accepts a schema prop that has all the information needed to render the form, we probably will have the following in our template:

```vue
<DynamicForm :schema="formSchema" />
```

Now, let's think how our `schema` shape would look like. A great way to "design" such complex props is to use typescript interfaces, the following is for demonstration purposes only and won't be in our actual code:

We have a few requirements to fulfill:

- Should be able to provide the fields.
- Should be able to specify types (elements) for those fields
- Should be able to specify validation either on field-level or form-level

The initial draft would look like this:

```ts
// The field schema shape
interface FieldSchema {
  as: string;
  name: string;
  label: string; // user friendly string
}

// The form schema shape
interface FormSchema {
  fields: FieldSchema[]; // fields
}
```

Notice that for the field schema we tried to match the same prop names on the [Field component](/api/field#props) which will help you later. Let's imagine we are building a sign-up form, our schema will look like this:

```js
const formSchema = {
  fields: [
    {
      label: 'Your Name',
      name: 'name',
      as: 'input',
    },
    {
      label: 'Your Email',
      name: 'email',
      as: 'input',
    },
    {
      label: 'Your Password',
      name: 'password',
      as: 'input',
    },
  ],
};
```

That looks fine for now, we will tackle initial values and validation later on, start to write some code.

## Rendering Fields

The initial implementation will follow these generic steps:

- Use `Form` component from vee-validate to render the form
- Iterate over each field in `schema.fields`
- Render each field as a `Field` component passing all props to it

```vue
<template>
  <Form>
    <div v-for="field in schema.fields" :key="field.name">
      <label :for="field.name">{{ field.label }}</label>
      <Field :as="field.as" :id="field.name" :name="field.name" />
    </div>

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field } from 'vee-validate';

export default {
  name: 'DynamicForm',
  components: {
    Form,
    Field,
  },
  props: {
    schema: {
      type: Object,
      required: true,
    },
  },
};
</script>
```

We have a problem though, our password field is showing the user input to everyone around them which isn't very responsible on our part. This means that some inputs may require additional props that we may need to pass to our `Field` component, let's update our `FieldSchema` definition:

```diff
interface FieldSchema {
  as: string;
  name: string;
  label: string;
+ [k: string]: any; // any additional attributes
}
```

Then in the template we will update the iteration with `v-for` portion to extract the known keys that we would expect and collecting the rest in another object using ES6 object rest operator:

```vue
<div v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
  <label :for="name">{{ label }}</label>
  <Field :as="as" :id="name" :name="name" v-bind="attrs" />
</div>
```

The `v-bind` there allows us to bind everything in the `attrs` object which is all the other props we didn't extract explicitly and bind them to the `Field` component, and luckily for us, the `Field` component will pass down any props that it doesn't accept to whatever gets rendered in its place, effectively passing down our attributes to our `input` tags.

That looks alright for now, but before we tackle validation and other things, what if we wanted to render a `select` input?

<details>

<summary>Bonus: Adding support for slotted inputs</summary>

The `select` input introduces an edge case where your field would need to have children nodes inside its slot, the nodes being `option` tags. If you are rendering a component that accepts its options via prop you don't need to do this but let's tackle this edge case head-on.

First, back to our schema and let's add support for `children` prop that accepts a flat array of child nodes:

```diff
interface FieldSchema {
  as: string;
  name: string;
  label: string;
  [k: string]: any;
+ children?: Array<{
+   tag: string; // the tag that will be rendered
+   text?: string; // a text content (optional)
+   [k: string]: any; // any additional attributes
+ }>;
}
```

The `children` field now can both specify props and a text node if needed in case of the `select` element's `option` nodes.

Let's update the template:

```vue
<div v-for="{ as, name, label, children, ...attrs } in schema.fields" :key="name">
  <label :for="name">{{ label }}</label>
  <Field :as="as" :id="name" :name="name" v-bind="attrs">
    <template v-if="children && children.length">
      <component v-for="({ tag, text, ...childAttrs }, idx) in children" :key="idx" :is="tag" v-bind="childAttrs">
        {{ text }}
      </component>
    </template>
  </Field>
</div>
```

The template started to get a little bit more complex, so we will stop there but now we have support for `select` elements and any other type of inputs you may need.

Let's update our `formSchema` to reflect that change:

```js
const formSchema = {
  fields: [
    // ....
    {
      label: 'Favorite Drink',
      name: 'drink',
      as: 'select',
      children: [
        {
          tag: 'option',
          value: '',
          text: '',
        },
        {
          tag: 'option',
          value: 'coffee',
          text: 'Coffeee',
        },
        {
          tag: 'option',
          value: 'tea',
          text: 'Tea',
        },
        {
          tag: 'option',
          value: 'coke',
          text: 'Coke',
        },
      ],
    },
  ],
};
```

</details>

## Handling Validation

We can go two ways here, either allow each field to define its own validation rules, or let it be defined on the form-level which is much easier with vee-validate and yup. We will go with the latter approach.

The `Form` component already has support for validating fields on the form-level by accepting a `validation-schema` prop which can be a yup object validation schema. Let's add support for the `validation` prop on our own `FormSchema` object:

```diff
interface FormSchema {
  fields: FieldSchema[];
+ validation: any;
}
```

Now let's use `yup` to add the validation schema:

```diff
const formSchema = {
  fields: [
    // ...
  ],
+ validation: yup.object({
+   email: yup.string().email().required(),
+   name: yup.string().required(),
+   password: yup.string().min(8).required(),
+ }),
};
```

Let's update the `DynamicForm` component to accept the validation schema:

```vue
<Form :validation-schema="schema.validation">
  <!-- ...... -->
</Form>
```

Now validation is working but we still need to show error messages, so let's update the `v-for` block that's rendering our fields to use the `<ErrorMessage />` component to render messages.

First import and register the `ErrorMessage` component inside the `DynamicForm` component:

```js
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  components: {
    Form,
    Field,
    ErrorMessage,
  },
  // ...
};
```

Then add it after the field passing the `name` prop to it so it can correctly show the field's error message.

```vue
<div v-for="{ as, name, label, ...attrs } in schema.fields" :key="name">
  <label :for="name">{{ label }}</label>
  <Field :as="as" :id="name" :name="name" v-bind="attrs" />
  <ErrorMessage :name="name" />
</div>
```

And that's it, you should have validation working now 🎉

## Handling Initial Values

Since we are using the `Form` component provided by vee-validate we almost got this for free. All we have to do is to allow your component consumers to pass in initial values, let's get back to the `FormSchema` and add support for a `values` prop that contains the form values as a key-value pair:

```diff
interface FormSchema {
  fields: FieldSchema[];
+ values: { [k: string]: any };
}
```

Now add `values` field to the `formSchema` object we built earlier:

```diff
const formSchema = {
  fields: [
    // ...
  ],
  validation: yup.object({
    // ...
  }),
+ values: {
+   email: 'example@example.com',
+   name: 'John Smith',
+   password: 'p@$$vv0rd',
+ },
};
```

The `Form` component already handles initial values, so all we need to do is pass down `schema.values` to the `Form` component's `initial-values` prop:

```vue
<Form :validation-schema="schema.validation" :initial-values="schema.values">
  <!-- ...... -->
</Form>
```

And that's it, any field that got an initial value will be automatically validated for you as well.

## Demo

You can check a live sample of what we did here, note that there are differences because the live version uses vee-validate and vue loaded from a CDN rather than a Vue Cli setup.

<p class="codepen" data-height="500" data-theme-id="light" data-default-tab="js,result" data-user="logaretm" data-slug-hash="vYLMKGV" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="Dynamic Form Generator">
  <span>See the Pen <a href="https://codepen.io/logaretm/pen/vYLMKGV">
  Dynamic Form Generator</a> by Abdelrahman Awad (<a href="https://codepen.io/logaretm">@logaretm</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>

## Conclusion

In this guide, you learned how to use the dynamic rendering capabilities of Vue.js combined with the flexible nature of the vee-validate components. You created a form that renders fields and validates them based on a JSON schema.

While the finished product is far from being complete, you can add features as needed to your form generator.

<doc-tip>

If you are looking for a more robust solution for form generation, take a look at [Formvuelate](https://formvuelate.js.org/), and it has first-party [vee-validate support](https://formvuelate.js.org/#vee-validate-plugin).

</doc-tip>
