import { isValidDate } from '../utils';
import { RuleParamSchema } from '../types';


// required to convert from a list of array values to an object.
const params: RuleParamSchema[] = [
  {
    name: 'target',
    isTarget: true
  },
  {
    name: 'allowEqual',
    default: false
  }
];

const afterValidator = (value: any, { target, allowEqual }: any) => {
  // if either is not valid.
  if (!isValidDate(value) || !isValidDate(target)) {
    return false;
  }

  if (allowEqual) {
    return value.getTime() >= target.getTime();
  }

  return value.getTime() > target.getTime();
};


export {
  afterValidator as validate,
  params
};

export default {
  validate: afterValidator,
  params,
};
