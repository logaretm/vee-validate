import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Fusha ${field} nuk është valide.`,
  after: (field, [target]) => `${field} duhet të jetë pas ${target}.`,
  alpha_dash: (field) => `${field} mund të përmbaj karaktere alfanumerike, shenja si viza dhe shenja të pikësimit.`, 
  alpha_num: (field) => `${field} mund të përmbaj vetëm shenja alfanumerike.`,
  alpha_spaces: (field) => `${field} mund të përmbaj vetëm shkronja dhe hapësira.`,
  alpha: (field) => `${field} mund të përmbaj vetëm shkronja.`,
  before: (field, [target]) => `${field} duhet të jetë para ${target}.`,
  between: (field, [min, max]) => `${field} duhet të jetë në mes ${min} dhe ${max}.`,
  confirmed: (field) => `${field} e konfirmimit nuk përputhet.`,
  credit_card: (field) => `${field} nuk është valide.`,
  date_between: (field, [min, max]) => `${field} duhet të jetë në mes ${min} dhe ${max}.`,
  date_format: (field, [format]) => `${field} duhet të jetë në formatin ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} duhet të jetë numerike dhe të përmbaj ${decimals === '*' ? '' : decimals} presje dhjetore.`,
  digits: (field, [length]) => `${field} duhet të jetë numerike dhe të përmbaj saktësisht ${length} shifra.`,
  dimensions: (field, [width, height]) => `${field} duhet të jetë ${width} piksela me ${height} piksela.`,
  email: (field) => `${field} duhet të jetë e-mail valid.`,
  ext: (field) => `${field} duhet të jetë fajll valid.`,
  image: (field) => `${field} duhet të jetë fotografi.`,
  in: (field) => `Vlera ${field} duhet të jetë vlerë valide.`,
  ip: (field) => `${field} duhet të jetë IP adresë valide.`,
  max: (field, [length]) => `${field} nuk duhet të jetë më i gjatë se ${length} karaktere.`,
  max_value: (field, [max]) => `Vlera ${field} duhet të jetë ${max} ose më e vogël.`,
  mimes: (field) => `${field} duhet të përmbaj llojin e fajllit valid.`,
  min: (field, [length]) => `${field} duhet të jetë së paku ${length} karakter.`,
  min_value: (field, [min]) => `Vlera ${field} duhet të jetë së paku ${min} ose më shume.`,
  not_in: (field) => `Vlera ${field} duhet të jetë vlerë valide.`,
  numeric: (field) => `${field} mund të përmbaj vetëm numra.`,
  regex: (field) => `Formati ${field} nuk është valid.`,
  required: (field) => `Fusha ${field} nuk duhet të jetë e zbrazët.`,
  size: (field, [size]) => `${field} duhet të jetë më e vogël se ${formatFileSize(size)}.`,
  url: (field) => `${field} nuk është URL valid.`
};

const locale = {
  name: 'sq',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
