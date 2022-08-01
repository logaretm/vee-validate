# @vee-validate/zod

<p align="center">
  <a href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img width="150" src="https://github.com/logaretm/vee-validate/raw/main/logo.png">
  </a>

  <a href="https://vee-validate.logaretm.com/v4/guide/global-validators" target="_blank">
    <img width="150" src="https://github.com/colinhacks/zod/raw/master/logo.svg">
  </a>
</p>

> Official vee-validate integration with Zod schema validation

<p align="center">
  <a href="https://github.com/sponsors/logaretm">
    <img src='https://sponsors.logaretm.com/sponsors.svg'>
  </a>
</p>

## Getting Started

This official vee-validate plugin allows you to use zod schemas as a drop-in replacement for [yup](https://github.com/jquense/yup).

### Install

Install these packages `vee-validate`, `zod` and `@vee-validate/zod`.

```sh
yarn add vee-validate zod @vee-validate/zod

# or with NPM

npm install vee-validate zod @vee-validate/zod
```

### Usage

#### Field-level schema

```js
import { toFieldValidator } from '@vee-validate/zod';
import * as zod from 'zod';

const fieldSchema = toFieldValidator(zod.string().nonempty(REQUIRED_MSG).min(8, MIN_MSG));
```

Then use it with `<Field />` component or `useField` function:

```vue
<Field name="field" :rules="fieldSchema" />
```

```js
const { value, errorMessage } = useField('field', fieldSchema);
```

#### Form-level schema

```js
import { toFormValidator } from '@vee-validate/zod';
import * as zod from 'zod';

const schema = toFormValidator(
  zod
    .object({
      password: zod.string(),
      confirmation: zod.string(),
    })
    .refine(data => data.confirmation === data.password, {
      message: CONFIRM_MSG,
      path: ['confirmation'],
    })
);
```

Then use it with `<Form />` component or `useForm` function:

```vue
<Form :validation-schema="schema">
  ...
</Form>
```

```js
const { errors } = useForm({
  validationSchema: schema,
});
```

### Limitations

Under the hood, this plugin converts zod schemas to `yup` schemas by wrapping them with a similar API, this means there are some limitations, if you encounter unexpected behaviors or type issues please report them.

At the moment there are no known limitations.

### Documentation

You can find more information over at [vee-validate documentation here](https://vee-validate.logaretm.com/v4).

For how to use zod, check [their repository](https://github.com/colinhacks/zod).

### License

MIT
