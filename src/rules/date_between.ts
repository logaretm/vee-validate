import { isValidDate } from '../utils';
import { RuleParamSchema } from '../types';

const validate = (value: any, { min, max, inclusivity }: any) => {
  // if any is not valid.
  if (!isValidDate(value) || !isValidDate(min) || !isValidDate(max)) {
    return false;
  }

  const minDate = min.getTime();
  const maxDate = max.getTime();
  const dateVal = value.getTime();

  if (inclusivity === '()') {
    return dateVal > minDate && dateVal < maxDate;
  }

  if (inclusivity === '(]') {
    return dateVal > minDate && dateVal <= maxDate;
  }

  if (inclusivity === '[)') {
    return dateVal >= minDate && dateVal < maxDate;
  }

  return dateVal >= minDate && dateVal <= maxDate;
};

const params: RuleParamSchema[] = [
  {
    name: 'min'
  },
  {
    name: 'max'
  },
  {
    name: 'inclusivity',
    default: '()'
  }
];

export { validate, params };

export default {
  validate,
  params
};
