import { getSingleParam } from './utils';

const isNotValidator = (value: any, params?: any[] | Record<string, any>) => {
  const other = getSingleParam(params, 'other');

  return value !== other;
};

export default isNotValidator;
