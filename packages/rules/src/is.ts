import { getSingleParam } from './utils';

const isValidator = (value: unknown, params: [unknown] | { other: unknown }) => {
  const other = getSingleParam(params, 'other');

  return value === other;
};

export default isValidator;
