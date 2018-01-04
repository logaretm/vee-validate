import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field}-feltet må være etter ${target}.`,
  alpha_dash: (field) => `${field}-feltet kan bare inneholde alfa-numeriske tegn, samt bindestrek og understrek.`,
  alpha_num: (field) => `${field} kan bare inneholde alfanumeriske tegn.`,
  alpha_spaces: (field) => `${field}-feltet kan bare inneholde alfa-numeriske teng og mellomrom.`,
  alpha: (field) => `${field}-feltet kan bare inneholde bokstaver.`,
  before: (field, [target]) => `${field}-feltet må være før ${target}.`,
  between: (field, [min, max]) => `${field}-feltet må være imellom ${min} og ${max}.`,
  confirmed: (field) => `${field}-feltet kan ikke bekreftes.`,
  credit_card: (field) => `${field}-feltet er ugyldig.`,
  date_between: (field, [min, max]) => `${field}-feltet må være imellom ${min} og ${max}.`,
  date_format: (field, [format]) => `${field}-feltet må være i følgende format: ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field}-feltet må være numerisk samt kan inneholde ${decimals === '*' ? '' : decimals} desimaler.`,
  digits: (field, [length]) => `${field}-feltet må være numerisk og inneholde nøyaktig ${length} siffer.`,
  dimensions: (field, [width, height]) => `${field}-feltet må være ${width} ganger ${height} piksler.`,
  email: (field) => `${field}-feltet må være en gyldig E-post adresse.`,
  ext: (field) => `${field}-feltet må være en gyldig fil.`,
  image: (field) => `${field}-feltet må være et bilde.`,
  in: (field) => `${field}-feltet må være en gyldig verdi.`,
  ip: (field) => `${field}-feltet må være en gyldig IP Adresse.`,
  max: (field, [length]) => `${field}-feltet kan ikke være lengre enn ${length} tegn.`,
  max_value: (field, [max]) => `${field}-feltet må være ${max} eller mindre.`,
  mimes: (field) => `${field}-feltet må ha en gyldig filtype.`,
  min: (field, [length]) => `${field}-feltet må være minst ${length} tegn.`,
  min_value: (field, [min]) => `${field}-feltet må være ${min} eller mer.`,
  not_in: (field) => `${field}-feltet må være en gyldig verdi.`,
  numeric: (field) => `${field}-feltet kan bare inneholde nummer.`,
  regex: (field) => `${field}-feltet sin formatering er ugyldig.`,
  required: (field) => `${field}-feltet er obligatorisk.`,
  size: (field, [size]) => `${field}-feltet må være mindre enn ${formatFileSize(size)}.`,
  url: (field) => `${field}-feltet er ikkje en gyldig URL.`
};

const locale = {
  name: 'nb_NO',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
