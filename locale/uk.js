import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `В полі ${field} повинна бути дата після ${target}.`,
  alpha_dash: (field) => `Поле ${field} може містити буквено-цифрові символи, а також тире та підкреслення.`,
  alpha_num: (field) => `Поле ${field} може містити тільки літери та цифри.`,
  alpha_spaces: (field) => `Поле ${field} може містити тільки літери та пробіли.`,
  alpha: (field) => `Поле ${field} може містити тільки літери.`,
  before: (field, [target]) => `В полі ${field} повинна бути дата до ${target}.`,
  between: (field, [min, max]) => `Поле ${field} повинно бути між ${min} та ${max}.`,
  confirmed: (field) => `Поле ${field} не співпадає з підтвердженням.`,
  credit_card: (field) => `Поле ${field} не вірне.`,
  date_between: (field, [min, max]) => `В полі ${field} повинна бути дата між ${min} та ${max}.`,
  date_format: (field, [format]) => `В полі ${field} повинна бути дата в форматі ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Поле ${field} повинно бути числовим та може містити ${decimals === '*' ? 'знакі' : decimals + ' знаків'} після коми.`,
  digits: (field, [length]) => `Поле ${field} повинно бути числовим та точно містити ${length} цифри.`,
  dimensions: (field, [width, height]) => `Поле ${field} повинно бути ${width} пікселів на ${height} пікселів.`,
  email: (field) => `В полі ${field} повинна бути адреса електронної пошти.`,
  ext: (field) => `Поле ${field} повинно бути дійсним файлом.`,
  image: (field) => `В полі ${field} має бути зображення.`,
  in: (field) => `Поле ${field} повинно бути допустимим значенням.`,
  ip: (field) => `Поле ${field} повинно бути IP адресою.`,
  max: (field, [length]) => `Поле ${field} не може бути більше, ніж ${length} символів.`,
  max_value: (field, [max]) => `Поле ${field} повинно бути ${max} або менше.`,
  mimes: (field) => `Поле ${field} повиннно мати дійсний тип файлу.`,
  min: (field, [length]) => `Поле ${field} має бути принаймні ${length} символів.`,
  min_value: (field, [min]) => `Поле ${field} повинно бути ${min} або більше.`,
  not_in: (field) => `Поле ${field} повинно мати допустиме значення.`,
  numeric: (field) => `Поле ${field} може містить лише цифри.`,
  regex: (field) => `Поле ${field} має невірний формат.`,
  required: (field) => `Поле ${field} повинно мати значення.`,
  size: (field, [size]) => `Поле ${field} повинно бути менше ${formatFileSize(size)}.`,
  url: (field) => `В полі ${field} повиннен бути URL.`
};

const locale = {
  name: 'uk',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
