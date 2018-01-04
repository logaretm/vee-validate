import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field}-feltet må vere etter ${target}.`,
  alpha_dash: (field) => `${field}-feltet kan berre innehalde alfa-numeriske tegn, samt bindestrek og understrek.`,
  alpha_num: (field) => `${field} kan berre innehalde alfanumeriske tegn.`,
  alpha_spaces: (field) => `${field}-feltet kan berre innehalde alfanumeriske teng og mellomrom.`,
  alpha: (field) => `${field}-feltet kan berre innehalde bokstaver.`,
  before: (field, [target]) => `${field}-feltet må vere før ${target}.`,
  between: (field, [min, max]) => `${field}-feltet må vere mellom verdiane ${min} og ${max}.`,
  confirmed: (field) => `${field}-feltet samsvarer ikkje.`,
  credit_card: (field) => `${field}-feltet er ugyldig.`,
  date_between: (field, [min, max]) => `${field}-feltet må vere imellom ${min} og ${max}.`,
  date_format: (field, [format]) => `${field}-feltet må vere i følgende format: ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field}-feltet må vere numerisk, og kan innehalde ${decimals === '*' ? '' : decimals} desimaler.`,
  digits: (field, [length]) => `${field}-feltet må vere numerisk og innehalde nøyaktig ${length} siffer.`,
  dimensions: (field, [width, height]) => `${field}-feltet må vere ${width} gonger ${height} piksler.`,
  email: (field) => `${field}-feltet må innehalde ein gyldig E-post adresse.`,
  ext: (field) => `${field}-feltet må innehalde ei gyldig fil.`,
  image: (field) => `${field}-feltet må vere eit bilete.`,
  in: (field) => `${field}-feltet må vere ein gyldig verdi.`,
  ip: (field) => `${field}-feltet må vere ei gyldig IP Adresse.`,
  max: (field, [length]) => `${field}-feltet kan ikkje vere lengre enn ${length} tegn.`,
  max_value: (field, [max]) => `${field} kan ikkje vere lengre enn ${max} tegn.`,
  mimes: (field) => `${field}-feltet må ha ein gyldig filtype.`,
  min: (field, [length]) => `${field}-feltet må innehalde minst ${length} tegn.`,
  min_value: (field, [min]) => `${field}-feltet må vere ${min} eller mer.`,
  not_in: (field) => `${field}-feltet må ha ein gyldig verdi.`,
  numeric: (field) => `${field}-feltet kan berre innehalde nummer.`,
  regex: (field) => `${field} har ugyldig formatering.`,
  required: (field) => `${field} er eit obligatorisk felt.`,
  size: (field, [size]) => `${field}-feltet må vere mindre enn ${formatFileSize(size)}.`,
  url: (field) => `${field} er ikkje ein gyldig URL.`
};

const locale = {
  name: 'nn_NO',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
