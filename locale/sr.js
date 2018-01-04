import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Поље ${field} није валидно.`,
  after: (field, [target]) => `Поље ${field} мора бити после ${target}.`,
  alpha_dash: (field) => `Поље ${field} може садржати алфанумеричке карактере и повлаке.`,
  alpha_num: (field) => `Поље ${field} може садржати само алфанумеричке карактере.`,
  alpha_spaces: (field) => `Поље ${field} може садржати само алфанумеричке карактере и размаке.`,
  alpha: (field) => `Поље ${field} може садржати само слова.`,
  before: (field, [target]) => `Поље ${field} мора бити пре ${target}.`,
  between: (field, [min, max]) => `Поље ${field} мора бити између ${min} и ${max}.`,
  confirmed: (field) => `Потврда поља ${field} се не поклапа.`,
  credit_card: (field) => `Поље ${field} није валидно.`,
  date_between: (field, [min, max]) => `Поље ${field} мора бити између ${min} и ${max}.`,
  date_format: (field, [format]) => `Поље ${field} мора бити у формату ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Поље ${field} мора бити број и може садржати ${decimals === '*' ? '' : decimals} децималних места.`,
  digits: (field, [length]) => `Поље ${field} мора бити број и садржати тачно ${length} цифара.`,
  dimensions: (field, [width, height]) => `Поље ${field} мора бити ${width} x ${height} пиксела.`,
  email: (field) => `Поље ${field} мора бити валидан имејл.`,
  ext: (field) => `Поље ${field} мора бити валидан фајл.`,
  image: (field) => `Поље ${field} мора бити слика.`,
  in: (field) => `Поље ${field} мора бити валидна вредност.`,
  ip: (field) => `Поље ${field} мора бити валидна "ај пи" адреса.`,
  max: (field, [length]) => `Поље ${field} не сме бити дуже од ${length} карактера.`,
  max_value: (field, [max]) => `Поље ${field} не сме бити веће од ${max}.`,
  mimes: (field) => `Поље ${field} мора бити валидан тип фајла.`,
  min: (field, [length]) => `Поље ${field} мора садржати најмање ${length} карактера.`,
  min_value: (field, [min]) => `Поље ${field} не сме бити мање од ${min}.`,
  not_in: (field) => `Поље ${field} мора имати валидну вредност.`,
  numeric: (field) => `Поље ${field} мора бити број.`,
  regex: (field) => `Формат поља ${field} није валидан.`,
  required: (field) => `Поље ${field} је обавезно.`,
  size: (field, [size]) => `Поље ${field} мора бити мање од ${formatFileSize(size)}.`,
  url: (field) => `Поље ${field} није валидна веб адреса.`
};

const locale = {
  name: 'sr',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
