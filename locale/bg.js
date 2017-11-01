import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Полето ${field} е с невалидна стойност.`,
  alpha_dash: (field) => `Полето ${field} може да съдържа буквено-цифрови знаци, както и тирета и долни черти.`,
  alpha_num: (field) => `Полето ${field} може да съдържа само буквено-цифрови символи.`,
  alpha_spaces: (field) => `Полето ${field} може да съдържа само азбучни знаци, както и интервали.`,
  alpha: (field) => `Полето ${field} може да съдържа само азбучни знаци.`,
  between: (field, [min, max]) => `Полето ${field} може да е между ${min} и ${max}.`,
  confirmed: (field) => `Потвърждението не съвпада за полето ${field}.`,
  credit_card: (field) => `Полето ${field} е навалидно.`,
  decimal: (field, [decimals = '*'] = []) => `Полето ${field} трябва да е числено ${!decimals || decimals === '*' ? '' : 'и може да съдържа ${decimals} знака'}`,
  digits: (field, [length]) => `Полето ${field} трябва да е цифрово и да съдържа точно ${length} цифри.`,
  dimensions: (field, [width, height]) => `Полето ${field} трябва да е ${width} пиксела по ${height} пиксела.`,
  email: (field) => `Полето ${field} трябва да е коректен Email адрес.`,
  ext: (field) => `Полето ${field} трябва да е валиден файл.`,
  image: (field) => `Полето ${field} трябва да е снимка.`,
  in: (field) => `Полето ${field} трябва да е валидна стойност.`,
  integer: (field) => `Полето ${field} трябва да е цяло число.`,
  ip: (field) => `Полето ${field} трябва да е валиден IP адрес.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Полето ${field} трябва да е между ${length} и ${max}.`;
    }

    return `Полето ${field} трябва да е ${length}.`;
  },
  max: (field, [length]) => `Полето ${field} не може да бъде по-голямо от ${length} знака.`,
  max_value: (field, [max]) => `Полето ${field} трябва да бъде ${max} или по-малко.`,
  mimes: (field) => `Полето ${field} трябва да е валиден тип файл.`,
  min: (field, [length]) => `Полето ${field} трябва да съдържа минимум ${length} символа.`,
  min_value: (field, [min]) => `Полето ${field} трябва да бъде минимум ${min} или повече.`,
  not_in: (field) => `Полето ${field} трябва да е с валидна стойност.`,
  numeric: (field) => `Полето ${field} може да съдържа само цифри.`,
  regex: (field) => `Полето ${field} съдържа невалиден формат.`,
  required: (field) => `Полето ${field} е задължително.`,
  size: (field, [size]) => `Размерът на файла за полето ${field} трябва да е под ${formatFileSize(size)}.`,
  url: (field) => `Полето ${field} не съдържа валиден URL адрес.`
};

const locale = {
  name: 'bg',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.addLocale(locale);
}

export default locale;
