import { ValidationRuleFunction } from '@vee-validate/shared';
import { getSingleParam } from './utils';

const confirmedValidator: ValidationRuleFunction = (value: any, params) => {
  const target = getSingleParam(params, 'target');

  return String(value) === String(target);
};

export default confirmedValidator;
