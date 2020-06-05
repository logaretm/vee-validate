import { getSingleParam } from './utils';

const isValidator = (value: any, params?: any[] | Record<string, any>) => {
  const other = getSingleParam(params, 'other');

  return value === other;
};

export default isValidator;
