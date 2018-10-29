import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Il valore del campo ${field} non è valido.`,
  after: (field, [target]) => `Il ${field} deve essere dopo ${target}.`,
  alpha: (field) => `Il campo ${field} può contenere solo caratteri alfabetici.`,
  alpha_dash: (field) => `Il campo ${field} può contenere caratteri alfa-numerici così come lineette e trattini di sottolineatura.`,
  alpha_num: (field) => `Il campo ${field} può contenere solo caratteri alfanumerici.`,
  alpha_spaces: (field) => `Il campo ${field} può contenere solo caratteri alfanumerici così come spazi.`,
  before: (field, [target]) => `Il campo ${field} deve essere prima di ${target}.`,
  between: (field, [min, max]) => `Il campo ${field} deve essere compreso tra ${min} e ${max}.`,
  confirmed: (field, [confirmedField]) => `Il campo ${field} non corrisponde con ${confirmedField}.`,
  credit_card: (field) => `Il campo ${field} non è valido.`,
  date_between: (field, [min, max]) => `La ${field} deve essere compresa tra ${min} e ${max}.`,
  date_format: (field, [format]) => `La ${field} deve essere nel formato ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Il campo ${field} deve essere numerico e può contenere  ${decimals === '*' ? 'cm' : decimals} punti decimali.`,
  digits: (field, [length]) => `Il campo ${field} deve essere numerico e contenere esattamente ${length} cifre.`,
  dimensions: (field, [width, height]) => `Il campo ${field} deve essere ${width} x ${height}.`,
  email: (field) => `Il campo ${field} deve essere un indirizzo email valido.`,
  excluded: (field) => `Il campo ${field} deve avere un valore valido.`,
  ext: (field) => `Il campo ${field} deve essere un file valido.`,
  image: (field) => `Il campo ${field} deve essere un'immagine.`,
  included: (field) => `Il campo ${field} deve avere un valore valido.`,
  ip: (field) => `Il campo ${field} deve essere un indirizzo IP valido.`,
  length: (field, [length, max]) => {
    if (max) {
      return `La lunghezza del campo ${field} deve essere compreso tra ${length} e ${max}.`;
    }

    return `La lunghezza del campo ${field} deve essere ${length}.`;
  },
  max: (field, [length]) => `Il campo ${field} non può essere più lungo di ${length} caratteri.`,
  max_value: (field, [max]) => `Il campo ${field} deve essere minore o uguale a ${max}`,
  mimes: (field) => `Il campo ${field} deve avere un tipo di file valido.`,
  min: (field, [length]) => `Il campo ${field} deve avere almeno ${length} caratteri.`,
  min_value: (field, [min]) => `Il campo ${field} deve essere maggiore o uguale a ${min}`,
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
