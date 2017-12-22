import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `El camp ${field} no és vàlid.`,
  after: (field, [target]) => `El camp ${field} ha de ser posterior a ${target}.`,
  alpha_dash: (field) => `El camp ${field} només ha de contenir lletres, números i guions.`,
  alpha_num: (field) => `El camp ${field} només ha de contenir lletres i números.`,
  alpha_spaces: (field) => `El camp ${field} només ha de contenir lletres i espais.`,
  alpha: (field) => `El camp ${field} només ha de contenir lletres.`,
  before: (field, [target]) => `El camp ${field} ha de ser anterior a ${target}.`,
  between: (field, [min, max]) => `El camp ${field} ha d'estar entre ${min} i ${max}.`,
  confirmed: (field, [confirmedField]) => `El camp ${field} no coincideix amb el camp ${confirmedField}.`,
  credit_card: (field, [confirmedField]) => `El camp ${field} és invàlid.`,
  date_between: (field, [min, max]) => `El camp ${field} ha d'estar entre ${min} i ${max}.`,
  date_format: (field, [format]) => `El camp ${field} ha de tenir el format ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `El camp ${field} ha de ser numèric i contenir ${decimals === '*' ? '' : decimals} punts decimals.`,
  digits: (field, [length]) => `El camp ${field} ha de ser numèric i contenir exactament ${length} dígits.`,
  dimensions: (field, [width, height]) => `El camp ${field} ha de ser de ${width} píxels per ${height} píxels.`,
  email: (field) => `El camp ${field} ha de ser un correu electrònic vàlid.`,
  ext: (field) => `El camp ${field} ha de ser un fitxer vàlid.`,
  image: (field) => `El camp ${field} ha de ser una imatge.`,
  in: (field) => `El camp ${field} ha de ser un valor vàlid.`,
  ip: (field) => `El camp ${field} ha de ser una adreça ip vàlida.`,
  max: (field, [length]) => `El camp ${field} no ha de ser major a ${length} caràcters.`,
  max_value: (field, [length]) => `El camp ${field} ha de ser de ${length} o menys.`,
  mimes: (field) => `El camp ${field} ha de ser un tipus de fitxer vàlid.`,
  min: (field, [length]) => `El camp ${field} ha de tenir almenys ${length} caràcters.`,
  min_value: (field, [length]) => `El camp ${field} ha de ser de ${length} o superior.`,
  not_in: (field) => `El camp ${field} ha de ser un valor vàlid.`,
  numeric: (field) => `El camp ${field} ha de contenir només caràcters numèrics.`,
  regex: (field) => `El format del camp ${field} no és vàlid.`,
  required: (field) => `El camp ${field} és obligatori.`,
  size: (field, [size]) => `El camp ${field} ha de ser menor a ${formatFileSize(size)}.`,
  url: (field) => `El camp ${field} no és un URL vàlid.`
};

const locale = {
  name: 'ca',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
