# Configuration

## Config

You may need to configure some options to tweak some of the plugin internals. You don't have to configure anything to get validation going but some defaults may require adjusting.

```js
import { configure } from 'vee-validate';

const config = {
  aria: true,
  classNames: {},
  bails: true,
  delay: 0,
  mode: 'aggressive',
  validity: false,
  useConstraintAttrs: true
};

// Configures the options.
configure(config);
```

You can update the config with the `configure` method at any time during your app life-cycle.

## Reference

|Property       | Type      | Default   | Description  |
|:--------------|:---------:|:---------:|:---------|
| aria          | `boolean` | `true`    | Allows setting `aria-invalid` and `aria-required` attributes on HTML inputs. |
| classNames    | `object`  |           | The classes to be applied depending on the state of the input. |
| delay         | `number`  | `0`       | The default debounce time for all inputs (only affects validations). |
| mode | `string` | `'aggressive'` | Sets the interaction mode to one of the predefined modes. |
| bails      | `boolean`|  `true`     | Whether the validation should bail after the first failure for each field, you can opt in or out from either settings by using the [continues](/api/directive.md#continues) and the [bails](/api/directive.md#bails) modifiers. |
| validity      | `boolean` | `false` | Set custom validity [Constraint validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) on native HTML inputs. |
| useConstraintAttrs | `boolean` | `true` | Enables [rule inference](/guide/inferred-rules.md) on native HTML inputs. |
