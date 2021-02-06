import { getSingleParam } from './utils';

const confirmedValidator = (value: unknown, params: [string] | { target: string }) => {
  const target = getSingleParam(params, 'target');

  return String(value) === String(target);
};

export default confirmedValidator;
