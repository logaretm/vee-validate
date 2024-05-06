import { getSingleParam, isEmpty } from './utils';

const urlValidator = (value: unknown, params: [string | RegExp | undefined] | { pattern?: string | RegExp }) => {
  if (isEmpty(value)) {
    return true;
  }

  let pattern = getSingleParam(params, 'pattern');
  if (typeof pattern === 'string') {
    pattern = new RegExp(pattern);
  }

  try {
    new URL(value as string);
  } catch {
    return false;
  }

  return pattern?.test(value as string) ?? true;
};

export default urlValidator;
