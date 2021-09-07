import { StringOrNumber, RuleParamSchema } from '../types';

type Separator = 'dot' | 'comma';

const validate = (value: StringOrNumber | StringOrNumber[], params: Record<string, any>): boolean => {
  const { decimals = 0, separator = 'dot' } = params || {};
  const separators: Record<Separator, string> = {
    dot: '.',
    comma: ','
  };

  const regexPart = +decimals === 0 ? '+' : `{${decimals}}`;
  const regex = new RegExp(`^-?\\d+\\${separators[separator as Separator] || '.'}\\d${regexPart}$`);

  let valueTemp = value;
  if (params.separator == "comma") {
    valueTemp = value.toString().replace(",", ".");
  }
  if (!isNaN(value) || !isNaN(valueTemp)) {
    let valueParsed = parseFloat(valueTemp);
    if (!Number.isNaN(valueParsed)) {
      if (!Number.isInteger(valueParsed)) {
        return Array.isArray(value) ? value.every(val => regex.test(String(val))) : regex.test(String(value));
      } else {
        return true;
      }
    }
  }
  return false;
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
