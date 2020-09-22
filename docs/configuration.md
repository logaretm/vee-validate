# Configuration

## Config

You may need to configure some options to tweak some of the plugin internals. You don't have to configure anything to get validation going but some defaults may require adjusting.

```js
import { configure } from 'vee-validate';

const config = {
  classes: {
    valid: 'is-valid',
    invalid: 'is-invalid'
  },
  bails: true,
  skipOptional: true,
  mode: 'aggressive',
  useConstraintAttrs: true
};

// Sets the options.
configure(config);
```

You can update the config with the `configure` method at any time during your app life-cycle.

## Reference

| Property           |          Type           |           Default           | Description                                                                |
| :----------------- | :---------------------: | :-------------------------: | :------------------------------------------------------------------------- |
| classes            |        `object`         |                             | The classes to be applied depending on the state of the input.             |
| mode               |        `string`         |       `'aggressive'`        | Sets the interaction mode to one of the predefined modes.                  |
| bails              |        `boolean`        |           `true`            | Whether failed validations should exit or all rules are run to completion. |
| skipOptional       |        `boolean`        |           `true`            | Optional fields with empty values will be excluded from validation.        |
| useConstraintAttrs |        `boolean`        |           `true`            | Enables [rule inference](./guide/rules.md#rules) on native HTML inputs.    |
| defaultMessage     | `string | () => string` | "{\_field\_} is not valid." | The fallback message for rules without messages.                           |
