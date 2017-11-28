import type Validator from '../src/core/validator';
import type ErrorBag from '../src/core/errorBag';

declare type ResultObject = {
  valid: boolean,
  data: Object
};

declare type Rule = (value: any, params: any[]) => boolean | ResultObject | Promise<boolean | ResultObject>;

declare type ValidationResult = {
  valid: boolean,
  error: ?MapObject,
  errors: ?Array<FieldError>
};

declare type FieldOptions = {
  name: string, // the name of the field (required)
  alias?: string, // the name that will be used in the error messages
  aria?: boolean, // if aria attributes should be set on the element (only for native HTML inputs)
  classNames?: { // the classes that will be applied depending on each flag if classes are enabled
    touched: string,
    untouched: string,
    valid: string,
    invalid: string,
    pristine: string,
    dirty: string
  },
  classes?: boolean, // if flags classes should be applied
  component?: any, // The vue component that is validated/watched by this field instance
  delay?: number, // the debounce time (ms) for the validation
  el?: HTMLElement, // The DOM element for this field
  events?: string, // a pipe seperated list of events that will be used to trigger validation
  getter?: () => any, // a getter function for the current field value, will be used to resolve the field value.
  initial?: boolean, // if it should be validated immediatly
  initialValue?: any, // the initial field value
  listen?: boolean, // if the validator should listen to any events (disables automatic validation if false)
  rules?: string | MapObject, // the field validation rules
  scope?: string | null, // the string name of the field scope
  targetOf?: string | null, // the id of the field that targets this one
  validity?: boolean, // if constrained validation API should be used (mdn)
  vm?: any // the vue instance that owns this field
};