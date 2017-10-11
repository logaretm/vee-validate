import type Validator from '../src/core/validator';
import type ErrorBag from '../src/core/errorBag';

// @flow

declare type ResultObject = {
  valid: boolean,
  data: Object
};

declare type Rule = (value: any, params: any[]) => boolean | ResultObject | Promise<boolean | ResultObject>;

declare type MapObject = { [string]: any };


declare type ValidatingVM = {
  $validator: Validator
};

declare type PluginContext = {
  Validator: Validator,
  ErrorBag: ErrorBag,
  Rules: Object,
};
