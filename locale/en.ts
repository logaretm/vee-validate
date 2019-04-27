import { formatFileSize, isDefinedGlobally } from './utils';
import { ValidationMessageGenerator } from '../src/types';

const messages: { [k: string]: ValidationMessageGenerator } = {
  _default: (field) => `The ${field} value is not valid.`,
  after: (field, { inclusion }: any, { targetName }: any) => `The ${field} must be after ${inclusion ? 'or equal to ' : ''}${targetName}.`,
  alpha: (field) => `The ${field} field may only contain alphabetic characters.`,
  alpha_dash: (field) => `The ${field} field may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: (field) => `The ${field} field may only contain alpha-numeric characters.`,
  alpha_spaces: (field) => `The ${field} field may only contain alphabetic characters as well as spaces.`,
  before: (field, { inclusion }: any, { targetName }: any) => `The ${field} must be before ${inclusion ? 'or equal to ' : ''}${targetName}.`,
  between: (field, { min, max }: any) => `The ${field} field must be between ${min} and ${max}.`,
  confirmed: (field) => `The ${field} confirmation does not match.`,
  credit_card: (field) => `The ${field} field is invalid.`,
  date_between: (field, { min, max }: any) => `The ${field} must be between ${min} and ${max}.`,
  decimal: (field, { decimals }: any) => `The ${field} field must be numeric and may contain ${!decimals || decimals === '*' ? '' : decimals} decimal points.`,
  digits: (field, { length }: any) => `The ${field} field must be numeric and exactly contain ${length} digits.`,
  dimensions: (field, { width, height }: any) => `The ${field} field must be ${width} pixels by ${height} pixels.`,
  email: (field) => `The ${field} field must be a valid email.`,
  excluded: (field) => `The ${field} field must be a valid value.`,
  ext: (field) => `The ${field} field must be a valid file.`,
  image: (field) => `The ${field} field must be an image.`,
  included: (field) => `The ${field} field must be a valid value.`,
  integer: (field) => `The ${field} field must be an integer.`,
  length: (field, { length, max }: any) => {
    if (max) {
      return `The ${field} length must be between ${length} and ${max}.`;
    }

    return `The ${field} length must be ${length}.`;
  },
  max: (field, { length }) => `The ${field} field may not be greater than ${length} characters.`,
  max_value: (field, { max }: any) => `The ${field} field must be ${max} or less.`,
  mimes: (field) => `The ${field} field must have a valid file type.`,
  min: (field, { length }: any) => `The ${field} field must be at least ${length} characters.`,
  min_value: (field, { min }: any) => `The ${field} field must be ${min} or more.`,
  numeric: (field) => `The ${field} field may only contain numeric characters.`,
  regex: (field) => `The ${field} field format is invalid.`,
  required: (field) => `The ${field} field is required.`,
  required_if: (field, _, { targetName }) => `The ${field} field is required when the ${targetName} field has this value.`,
  size: (field, { size }: any) => `The ${field} size must be less than ${formatFileSize(size)}.`,
};

const locale = {
  name: 'en',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  (window as any).VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
