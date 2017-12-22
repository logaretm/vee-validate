import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `Il ${field} deve essere dopo ${target}.`,
  alpha_dash: (field) => `Il campo ${field} può contenere caratteri alfa-numerici così come lineette e trattini di sottolineatura.`,
  alpha_num: (field) => `Il campo ${field} può contenere solo caratteri alfanumerici.`,
  alpha: (field) => `Il campo ${field} può contenere solo caratteri alfabetici.`,
  before: (field, [target]) => `Il campo ${field} deve essere prima di ${target}.`,
  between: (field, [min, max]) => `Il campo ${field} deve essere compreso tra ${min} e ${max}.`,
  confirmed: (field, [confirmedField]) => `Il campo ${field} non corrisponde con ${confirmedField}.`,
  date_between: (field, [min, max]) => `La ${field} deve essere compresa tra ${min} e ${max}.`,
  date_format: (field, [format]) => `La ${field} deve essere nel formato ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Il campo ${field} deve essere numerico e può contenere  ${decimals === '*' ? 'cm' : decimals} punti decimali.`,
  digits: (field, [length]) => `Il campo ${field} deve essere numerico e contenere esattamente ${length} cifre.`,
  dimensions: (field, [width, height]) => `Il campo ${field} deve essere ${width} x ${height}.`,
  email: (field) => `Il campo ${field} deve essere un indirizzo email valido.`,
  ext: (field) => `Il campo ${field} deve essere un file valido.`,
  image: (field) => `Il campo ${field} deve essere un'immagine.`,
  in: (field) => `Il campo ${field} deve avere un valore valido.`,
  ip: (field) => `Il campo ${field} deve essere un indirizzo IP valido.`,
  max: (field, [length]) => `Il campo ${field} non può essere più lungo di ${length} caratteri.`,
  mimes: (field) => `Il campo ${field} deve avere un tipo di file valido.`,
  min: (field, [length]) => `Il campo ${field} deve avere almeno ${length} caratteri.`,
  not_in: (field) => `Il campo ${field} deve avere un valore valido.`,
  numeric: (field) => `Il campo ${field} può contenere solo caratteri numerici.`,
  regex: (field) => `Il campo ${field} non ha un formato valido.`,
  required: (field) => `Il campo ${field} è richiesto.`,
  size: (field, [size]) => `Il campo ${field} deve essere inferiore a ${formatFileSize(size)}.`,
  url: (field) => `Il campo ${field} non è un URL valido.`
};

const locale = {
  name: 'it',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
