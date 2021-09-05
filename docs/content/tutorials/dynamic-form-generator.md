---
title: Build a Form Generator
description: Learn how to build a schema-generated form
order: 2
---

# Build a Form Generator

Building forms is often a repetitive task and requires a lot of back and forth to maintain. Maybe your client asked to add a field, maybe they asked to remove a field.

For most cases using static markup is good enough for your form needs but in some cases it would great if you had a dynamic form generator that would quickly render your fields based on some JSON schema.

In this tutorial you will learn how to use vee-validate to build your own form-generator without external libraries.

Let's quickly recap what you will be building, the component we will be building should:

<div class="features">

- Accept a form schema specifying the fields
- Render the given schema
- Use [yup](https://github.com/jquense/yup) to validate our form
- Show error messages

</div>

<doc-tip>

This guide will cover how to build a basic form generator.

If you are looking for a more robust solution for form generation, take a look at [Formvuelate](https://formvuelate.js.org/), and it has first-party [vee-validate support](https://formvuelate.js.org/guide/veevalidate.html).

</doc-tip>

## Prerequisites

This tutorial assumes you have knowledge of:

- Modern JavaScript like arrow functions and ES modules.
- Vue's [list rendering with `v-for`](https://v3.vuejs.org/guide/list.html#mapping-an-array-to-elements-with-v-for).
- Vue's [dynamic components](https://v3.vuejs.org/guide/component-basics.html#dynamic-components).

This tutorial also assumes you already have an empty Vue-cli project that you will edit as you follow along and that you have installed `vee-validate` already.

## Laying The Foundation

Before getting to the implementation details to implement a dynamic form generator, you need to have an overview of how it would work.

So let's assume we have already implemented a component called `DynamicForm` that accepts a `schema` prop that has all the information needed to render the form.

We have a few requirements to fulfill:

- Should be able to provide the fields.
- Should be able to specify types (elements) for those fields
- Should be able to specify validation either on field-level or form-level

Assuming we have such a component, we can imagine using it to be like this:

```vue[App.vue]
<template>
  <DynamicForm :schema="formSchema" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue';

export default {
  components: {
    DynamicForm,
  },
  data: () => {
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

    return {
      formSchema,
    };
  },
};
</script>
```

The form schema will contain `fields` property which is an array of the fields we want to render, each field entry will have these properties:

- `label`: a friendly label to display with the input.
- `name`: a unique name for the field to identify it.
- `as`: the name of the input element to render, it can be any native HTML element.

## Rendering Fields

<div class="tutorial-step is-first">

The initial implementation will follow these generic steps:

- Use `Form` component from vee-validate to render the form
- Iterate over each field in `schema.fields`
- Render each field as a `Field` component passing all props to it

Let's put that into some code.

</div>

```vue[components/DynamicForm.vue]
<template>
  <Form>
    <div
      v-for="field in schema.fields" :key="field.name">
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

Notice that when you run the example, the `password` field is being rendered as a text field which isn't ideal. We would like to be able to pass the `type` property to the input element as well.

<div class="tutorial-step">

In the `App.vue` component, add highlighted line:

</div>

```vue{29}[App.vue]
<template>
  <DynamicForm :schema="formSchema" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue';

export default {
  components: {
    DynamicForm,
  },
  data: () => {
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
          type: 'password'
        },
      ],
    };

    return {
      formSchema,
    };
  },
};
</script>
```

<div class="tutorial-step">

In the `DynamicForm.vue` component, update the iteration with `v-for` portion to extract the known keys that we expect and collecting the rest in another object using ES6 object rest operator.

</div>

```vue{3-9}[components/DynamicForm.vue]
<template>
  <Form>
    <div
      v-for="{ as, name, label, ...attrs } in schema.fields"
      :key="name"
    >
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs" />
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

The `v-bind` there allows us to bind everything in the `attrs` object which is all the other props we didn't extract explicitly and bind them to the `Field` component.

The `Field` component will pass down any props that it doesn't accept to whatever gets rendered in its place, effectively passing down other attributes to our `input` tags.

<details>

<summary>Bonus: Adding support for slotted inputs</summary>

The `select` input introduces an edge case where your field would need to have child elements (i.e: `<option>` elements) inside its slot. Let's tackle this edge case head-on.

Add a new fourth entry to the fields schema. This new entry will have a new `children` property that contains the options we want to render in the select element.

```vue{16-40}[App.vue]
<template>
  <DynamicForm :schema="formSchema" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue';

export default {
  components: {
    DynamicForm,
  },
  data: () => {
    const formSchema = {
      fields: [
        // ...
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

    return {
      formSchema,
    };
  },
};
</script>
```

Similar to how we render fields we will iterate on the `children` property if it exists inside the default slot for the `<Field />` component.

```vue{4,9-16}[components/DynamicForm.vue]
<template>
  <Form>
    <div
      v-for="{ as, name, label, children, ...attrs } in schema.fields"
      :key="name"
    >
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs">
        <template v-if="children && children.length">
          <component v-for="({ tag, text, ...childAttrs }, idx) in children"
            :key="idx"
            :is="tag"
            v-bind="childAttrs"
          >
            {{ text }}
          </component>
        </template>
      </Field>
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

The template started to get a little bit more complex, so we will stop there but now we have support for `select` elements and any other type of inputs you may need.

</details>

## Handling Validation

We would like each field to have its own validation rules defined on the schema. We will use [`yup`](https://github.com/jquense/yup) for those validation rules.

<div class="tutorial-step">

In `App.vue`, update the fields schema so that each fields has a new `rules` property with sensible validation rules

</div>

```vue{7,20,26,33}[App.vue]
<template>
  <DynamicForm :schema="formSchema" />
</template>

<script>
import DynamicForm from '@/components/DynamicForm.vue';
import * as Yup from 'yup';

export default {
  components: {
    DynamicForm,
  },
  data: () => {
    const formSchema = {
      fields: [
        {
          label: 'Your Name',
          name: 'name',
          as: 'input',
          rules: Yup.string().required(),
        },
        {
          label: 'Your Email',
          name: 'email',
          as: 'input',
          rules: Yup.string().email().required(),
        },
        {
          label: 'Your Password',
          name: 'password',
          as: 'input',
          type: 'password',
          rules: Yup.string().min(6).required(),
        },
      ],
    };

    return {
      formSchema,
    };
  },
};
</script>
```

Now that each field has its own validation rules, we will need to display the error messages.

<div class="tutorial-step">

Import and register the `ErrorMessage` component inside the `DynamicForm.vue` component, and add it to the template after the `<Field />`.

</div>

```vue{27,34,19}[components/DynamicForm.vue]
<template>
  <Form>
    <div
      v-for="{ as, name, label, children, ...attrs } in schema.fields"
      :key="name"
    >
      <label :for="name">{{ label }}</label>
      <Field :as="as" :id="name" :name="name" v-bind="attrs">
        <template v-if="children && children.length">
          <component v-for="({ tag, text, ...childAttrs }, idx) in children"
            :key="idx"
            :is="tag"
            v-bind="childAttrs"
          >
            {{ text }}
          </component>
        </template>
      </Field>
      <ErrorMessage :name="name" />
    </div>

    <button>Submit</button>
  </Form>
</template>

<script>
import { Form, Field, ErrorMessage } from 'vee-validate';

export default {
  name: 'DynamicForm',
  components: {
    Form,
    Field,
    ErrorMessage
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

And that's it, you should have validation working now 🎉

## Demo

You can check a live sample of what we did here.

<code-sandbox id="dynamic-form-generator-example-1jvdl" title="dynamic form generator example"></code-sandbox>

## Conclusion

In this guide, you learned how to use the dynamic rendering capabilities of Vue.js combined with the flexible nature of the vee-validate components. You created a form that renders fields and validates them based on a JSON schema.

While the finished product is far from being complete, you can add features as needed to your form generator.

<doc-tip>

If you are looking for a more robust solution for form generation, take a look at [Formvuelate](https://formvuelate.js.org/), and it has first-party [vee-validate support](https://formvuelate.js.org/#vee-validate-plugin).

</doc-tip>
