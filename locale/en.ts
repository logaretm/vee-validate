import { isDefinedGlobally } from './utils';
import { ValidationMessageTemplate } from '../src/types';

const messages: { [k: string]: ValidationMessageTemplate } = {
  _default: `The {_field_} value is not valid.`,
  alpha: `The {_field_} may only contain alphabetic characters.`,
  alpha_dash: `The {_field_} may contain alpha-numeric characters as well as dashes and underscores.`,
  alpha_num: `The {_field_} may only contain alpha-numeric characters.`,
  alpha_spaces: `The {_field_} may only contain alphabetic characters as well as spaces.`,
  between: `The {_field_} must be between {min} and {max}.`,
  confirmed: `The {_field_} confirmation does not match.`,
  decimal: (field, { decimals }: any) =>
    `The ${field} must be numeric and may contain ${!decimals || decimals === '*' ? '' : decimals} decimal points.`,
  digits: `The {_field_} must be numeric and exactly contain {length} digits.`,
  dimensions: `The {_field_} must be {width} pixels by {height} pixels.`,
  email: `The {_field_} must be a valid email.`,
  excluded: `The {_field_} is not a valid value.`,
  ext: `The {_field_} is not a valid file.`,
  image: `The {_field_} must be an image.`,
  oneOf: `The {_field_} is not a valid value.`,
  integer: `The {_field_} must be an integer.`,
  length: (field, { length, max }: any) => {
    if (max) {
      return `The ${field} length must be between ${length} and ${max}.`;
    }

    return `The ${field} length must be ${length}.`;
  },
  max: `The {_field_} may not be greater than {length} characters.`,
  max_value: `The {_field_} must be {max} or less.`,
  mimes: `The {_field_} must have a valid file type.`,
  min: `The {_field_} must be at least {length} characters.`,
  min_value: `The {_field_} must be {min} or more.`,
  numeric: `The {_field_} may only contain numeric characters.`,
  regex: `The {_field_} format is invalid.`,
  required: `The {_field_} is required.`,
  required_if: `The {_field_} is required when the {targetName} has this value.`,
  size: `The {_field_} size must be less than {size}KB.`
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
