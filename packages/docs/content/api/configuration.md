---
title: Configuration
description: VeeValidate Global Config Reference
---

# Configuration

vee-validate exposes global configs to help with a few repeated or certain behaviors that needs to be set app-wide.

## Config Options

| Option          | Type                            | Description                                                                                                                                                                                                                                             |
| --------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| bails           | `boolean`                       | Whether to run validations to completion or quit on the first, default is `true` error                                                                                                                                                                  |
| generateMessage | `(ctx: FieldContext) => string` | A message generator function for i18n libraries and a fallback for rules with no messages. For more information about the `FieldContext` type and the purpose of this, see the [Global Message Generator Guide](../guide/i18n#global-message-generator) |

## Updating The Config

You can change the global config using the `configure` function exposed by vee-validate passing any options that you need to change. You can call that function at any time during runtime but the changes will take effect for new `Field` and `useField` afterwards.

Here is an example:

```js
import { configure } from 'vee-validate';

configure({
  bails: false,
});
```
