import { getSingleParam } from './utils';

const confirmedValidator = (value: any, params?: any[] | Record<string, any>) => {
  const target = getSingleParam(params, 'target');

  return String(value) === String(target);
};

export default confirmedValidator;
