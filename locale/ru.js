import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `В поле ${field} должна быть дата после ${target}.`,
  alpha_dash: (field) => `Поле ${field} может содержать только буквы, цифры и дефис.`,
  alpha_num: (field) => `Поле ${field} может содержать только буквы и цифры.`,
  alpha_spaces: (field) => `Поле ${field} может содержать только буквы и пробелы.`,
  alpha: (field) => `Поле ${field} может содержать только буквы.`,
  before: (field, [target]) => `В поле ${field} должна быть дата до ${target}.`,
  between: (field, [min, max]) => `Поле ${field} должно быть между ${min} и ${max}.`,
  confirmed: (field, [confirmedField]) => `Поле ${field} не совпадает с ${confirmedField}.`,
  credit_card: (field) => `Поле ${field} должно быть действительным номером карты`,
  date_between: (field, [min, max]) => `Поле ${field} должно быть между ${min} и ${max}.`,
  date_format: (field, [format]) => `Поле ${field} должно быть в формате ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Поле ${field} должно быть числовым и может содержать ${decimals === '*' ? '' : decimals} десятичных числа.`,
  digits: (field, [length]) => `Поле ${field} должно быть числовым и точно содержать ${length} цифры.`,
  dimensions: (field, [width, height]) => `Поле ${field} должно быть ${width} пикселей на ${height} пикселей.`,
  email: (field) => `Поле ${field} должно быть действительным электронным адресом.`,
  ext: (field, [...args]) => `Поле ${field} должно быть действительным файлом. (${args})`,
  image: (field) => `Поле ${field} должно быть изображением.`,
  in: (field) => `Поле ${field} должно быть допустимым значением.`,
  ip: (field) => `Поле ${field} должно быть действительным IP-адресом.`,
  max: (field, [length]) => `Поле ${field} не может быть более ${length} символов.`,
  max_value: (field, [max]) => `Поле ${field} должно быть ${max} или менее.`,
  mimes: (field, [...args]) => `Поле ${field} должно иметь действительный тип файла. (${args})`,
  min: (field, [length]) => `Поле ${field} должно быть не менее ${length} символов.`,
  min_value: (field, [min]) => `Поле ${field} должно быть ${min} или больше.`,
  not_in: (field) => `Поле ${field} должно быть допустимым значением.`,
  numeric: (field) => `Поле ${field} должно быть числом.`,
  regex: (field) => `Поле ${field} имеет ошибочный формат.`,
  required: (field) => `Поле ${field} обязательно для заполнения.`,
  size: (field, [size]) => `Поле ${field} должно быть меньше, чем ${formatFileSize(size)}.`,
  url: (field) => `Поле ${field} имеет ошибочный формат URL.`
};

const locale = {
  name: 'ru',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
