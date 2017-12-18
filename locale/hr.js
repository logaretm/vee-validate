import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Vrijednost ${field} ne valja.`,
  after: (field, [target]) => `${field} mora biti poslje ${target}.`,
  alpha_dash: (field) => `${field} može sadržavati alfanumeričke znakove kao i crtice i podvlake.`,
  alpha_num: (field) => `${field} može sadržavati samo alfanumeričke znakove.`,
  alpha_spaces: (field) => `${field} može sadržavati samo abecedne znakove kao i razmake.`,
  alpha: (field) => `${field} može sadržavati samo abecedne znakove.`,
  before: (field, [target]) => `${field} mora biti prije ${target}.`,
  between: (field, [min, max]) => `${field} mora biti između ${min} i ${max}.`,
  confirmed: (field) => `Potvrda ${field} ne odgovara.`,
  credit_card: (field) => `${field} nije valjan.`,
  date_between: (field, [min, max]) => `${field} mora biti između ${min} i ${max}.`,
  date_format: (field, [format]) => `The ${field} mora biti u formatu ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} mora biti numerički i može sadržavati ${decimals === '*' ? '' : decimals} decimalne bodove.`,
  digits: (field, [length]) => `${field} mora biti numerički i točno sadrživati ${length} znamenke.`,
  dimensions: (field, [width, height]) => `${field} mora biti ${width} piksela za ${height} piksela.`,
  email: (field) => `${field} mora biti važeća e-pošta.`,
  ext: (field) => `${field} mora biti važeća datoteka.`,
  image: (field) => `${field} mora biti slika.`,
  in: (field) => `Vrijednost ${field} mora biti važeća vrijednost.`,
  ip: (field) => `${field} mora biti važeća IP adresa.`,
  max: (field, [length]) => `${field} ne smije biti veći od ${length} znakova.`,
  max_value: (field, [max]) => `Vrijednost ${field} mora biti ${max} ili manje.`,
  mimes: (field) => `${field} mora imati valjanu vrstu datoteke.`,
  min: (field, [length]) => `${field} mora biti barem ${length} znakova.`,
  min_value: (field, [min]) => `Vrijednost ${field} mora biti ${min} ili više.`,
  not_in: (field) => `Vrijednost ${field} mora biti važeća vrijednost.`,
  numeric: (field) => `${field} može sadrživati samo numeričke znakove`,
  regex: (field) => `Oblik ${field} nije važeći.`,
  required: (field) => `Polje ${field} je obavezno.`,
  size: (field, [size]) => `${field} mora biti manje od ${formatFileSize(size)}.`,
  url: (field) => `${field} nije važeći URL.`
};

const locale = {
  name: 'hr',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
