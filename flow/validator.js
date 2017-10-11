import type Validator from '../src/core/validator';
import type ErrorBag from '../src/core/errorBag';

declare type ResultObject = {
  valid: boolean,
  data: Object
};

declare type Rule = (value: any, params: any[]) => boolean | ResultObject | Promise<boolean | ResultObject>;
