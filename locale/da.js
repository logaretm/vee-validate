import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} er ikke gyldig.`,
  after: (field, [target]) => `${field} skal være efter ${target}.`,
  alpha_dash: (field) => `${field} må kun indeholde tal, bogstaver, bindestreger og underscores.`,
  alpha_num: (field) => `${field} må kun indeholde tal og bogstaver.`,
  alpha_spaces: (field) => `${field} må kun indeholde bogstaver og mellemrum.`,
  alpha: (field) => `${field} må kun indeholde bogstaver.`,
  before: (field, [target]) => `${field} skal være før ${target}.`,
  between: (field, [min, max]) => `${field} skal være mellem ${min} og ${max}.`,
  confirmed: (field, [confirmedField]) => `${field} skal matche ${confirmedField}.`,
  date_between: (field, [min, max]) => `${field} skal være mellem ${min} og ${max}.`,
  date_format: (field, [format]) => `${field} skal være i formatet: ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} skal være numerisk og må maksimalt indeholde ${decimals === '*' ? '' : decimals} decimaler.`,
  digits: (field, [length]) => `${field} skal være et tal på ${length} cifre.`,
  dimensions: (field, [width, height]) => `${field} skal være ${width} pixels gange ${height} pixels.`,
  email: (field) => `${field} skal være en gyldig email.`,
  ext: (field) => `${field} skal være en gyldig filtype.`,
  image: (field) => `${field} skal være et billede.`,
  in: (field) => `${field} skal være en gyldig værdi.`,
  ip: (field) => `${field} skal være en gyldig ip-adresse.`,
  max: (field, [length]) => `${field} må maksimalt være ${length} karakterer.`,
  mimes: (field) => `${field} skal være en gyldig filtype.`,
  min: (field, [length]) => `${field} skal minimum være ${length} karakterer.`,
  not_in: (field) => `${field} skal være en gyldig værdi.`,
  numeric: (field) => `${field} skal være numerisk.`,
  regex: (field) => `${field} skal have et gyldigt format.`,
  required: (field) => `${field} skal udfyldes.`,
  size: (field, [size]) => `${field} må maksimalt have en størrelse på ${formatFileSize(size)}.`,
  url: (field) => `${field} skal være en gyldig URL.`
};

const locale = {
  name: 'da',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
