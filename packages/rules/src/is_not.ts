import { getSingleParam } from './utils';

const isNotValidator = (value: unknown, params: [unknown] | { other: unknown }) => {
  const other = getSingleParam(params, 'other');

  return value !== other;
};

export default isNotValidator;
