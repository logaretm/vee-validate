import { StringOrNumber, RuleParamSchema } from '../types';

type Separators = 'dot' | 'comma';

interface Params {
  decimals?: string | 0;
  separator?: Separators;
}

const validate = (
  value: StringOrNumber | StringOrNumber[],
  { decimals = 0, separator = 'dot' }: Params = {}
): boolean => {
  const separators: Record<Separators, string> = {
    dot: '.',
    comma: ','
  };

  const regexPart = +decimals === 0 ? '+' : `{${decimals}}`;
  const regex = new RegExp(`^-?\\d+\\${separators[separator] || '.'}\\d${regexPart}$`);

  return Array.isArray(value) ? value.every(val => regex.test(String(val))) : regex.test(String(value));
};

const params: RuleParamSchema[] = [
  {
    name: 'decimals',
    default: 0
  },
  {
    name: 'separator',
    default: 'dot'
  }
];

export { validate, params };

export default {
  validate,
  params
};
