# Validation Observer

The `ValidationObserver` is a component that wraps your forms and provides aggregated validation state for all the fields nested under it using [scoped slots](https://vuejs.org/v2/guide/components-slots.html#Scoped-Slots).

For more information on how to use the `ValidationObserver`, see [Forms Guide](../guide/forms.md).

## Scoped Slot Props

These are the properties available on the slot scope accessible with `v-slot`:

| Name      |                          Type                           | Description                                                                                                                                                               |
| :-------- | :-----------------------------------------------------: | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| dirty     |                        `boolean`                        | True if at least one field is dirty.                                                                                                                                      |
| pristine  |                        `boolean`                        | True if all fields are pristine (not dirty).                                                                                                                              |
| valid     |                        `boolean`                        | True if all fields are valid.                                                                                                                                             |
| invalid   |                        `boolean`                        | True if at least one field is invalid.                                                                                                                                    |
| pending   |                        `boolean`                        | True if at least one field's validation is in progress.                                                                                                                   |
| touched   |                        `boolean`                        | True if at least one field has been touched (blurred).                                                                                                                    |
| untouched |                        `boolean`                        | True if all fields haven't been touched (blurred).                                                                                                                        |
| passed |                        `boolean`                        | True if all fields are valid as a result of user interaction                                                                                                                        |
| failed |                        `boolean`                        | True if any field is invalid as a result of user interaction                                                                                                                        |
| errors    |               `{ [x: string]: string[] }`               | An object containing reference to each field errors, each field is keyed by its `vid` prop.                                                                               |
| validate  | `() => Promise<boolean>` | A method that triggers validation for all providers. Mutates child providers state unless `silent` is true. |
| handleSubmit    |  `(cb: Function) => Promise<void>`            | Calls validation like `validate` and mutates provider's state, accepts a callback to be run only if the validation is successful.                                          |
| reset     |                      `() => void`                       | A method that resets validation state for all providers.                                                                                                                  |

## Rendering

[Like providers](./validation-provider.md#rendering), observers render a `span` by default. You can customize the rendered tag using the `tag` prop, for example a `form` tag might be more useful.

```vue
<!-- Render a form -->
<ValidationObserver tag="form">
  <!-- Fields -->
</ValidationObserver>
```

### Forcing Renderless

Sometimes it is unsuitable for a Observer component in principle to render anything extra, because of limitations in the Vue rendering output, you cannot have multiple root nodes which limits the design choice to move away from renderless at the moment, in Vue 3.x it this may change with fragments.

A `slim` prop can be used to force the component to be renderless, by default it is set to `false`. The highlighted lines are the only rendered elements in the final output:

```vue{2,4}
<!-- Only the form inside the observer will be rendered -->
<ValidationObserver slim>
  <form>
    <!-- Fields -->
  </form>
</ValidationObserver>
```

Note that **only the first child** will be rendered when `slim` is used, any other nodes will be dropped as you cannot have multiple root nodes in a renderless component. Be mindful of that when using the `slim` prop.

```vue{2}
<!-- Only form is rendered. -->
<ValidationObserver slim>
  <form></form>
  <div></div>
</ValidationObserver>
```

## Props

| Prop     | Type      | Default Value | Description                                                                                             |
| -------- | --------- | ------------- | ------------------------------------------------------------------------------------------------------- |
| tag      | `string`  | `span`        | The default tag to [render](#rendering).                                                                |
| slim     | `boolean` | `false`       | If true, it will make the observer [renderless](#renderless), only rendering the HTML inside its slot.  |
| disabled | `boolean` | `false`       | If true, the observer will be ignored when `validate` is called by a parent observer.                   |
| vid      | `string`  | random string | if provided it will be used as the observer's id when being registered as a child of a parent observer. |

## Methods

Those are the only methods meant for public usage, other methods that may exist on the ValidationObserver are strictly internal.

| Method   |         Args          |    Return Value    | Description                                                                                  |
| -------- | :-------------------: | :----------------: | -------------------------------------------------------------------------------------------- |
| validate | `{ silent: boolean }` | `Promise<boolean>` | Validates all the child providers/observers and mutates their state unless `silent` is true. |
| reset    |        `void`         |       `void`       | Resets validation state for all child providers/observers.                                   |

## Events

The validation observer does not emit any events at this time.
