import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Polje ${field} nije validno.`,
  after: (field, [target]) => `Polje ${field} mora biti posle ${target}.`,
  alpha: (field) => `Polje ${field} može sadržati samo slova.`,
  alpha_dash: (field) => `Polje ${field} može sadržati alfanumeričke karaktere i povlake.`,
  alpha_num: (field) => `Polje ${field} može sadržati samo alfanumeričke karaktere.`,
  alpha_spaces: (field) => `Polje ${field} može sadržati samo alfanumeričke karaktere i razmake.`,
  before: (field, [target]) => `Polje ${field} mora biti pre ${target}.`,
  between: (field, [min, max]) => `Polje ${field} mora biti između ${min} i ${max}.`,
  confirmed: (field) => `Potvrda polja ${field} se ne poklapa.`,
  credit_card: (field) => `Polje ${field} nije validno.`,
  date_between: (field, [min, max]) => `Polje ${field} mora biti između ${min} i ${max}.`,
  date_format: (field, [format]) => `Polje ${field} mora biti u formatu ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Polje ${field} mora biti broj i može sadržati ${decimals === '*' ? '' : decimals} decimalnih mesta.`,
  digits: (field, [length]) => `Polje ${field} mora biti broj i sadržati tačno ${length} cifara.`,
  dimensions: (field, [width, height]) => `Polje ${field} mora biti ${width} x ${height} piksela.`,
  email: (field) => `Polje ${field} mora biti validan imejl.`,
  excluded: (field) => `Polje ${field} mora imati validnu vrednost.`,
  ext: (field) => `Polje ${field} mora biti validan fajl.`,
  image: (field) => `Polje ${field} mora biti slika.`,
  included: (field) => `Polje ${field} mora biti validna vrednost.`,
  ip: (field) => `Polje ${field} mora biti validna "IP" adresa.`,
  max: (field, [length]) => `Polje ${field} ne sme biti duže od ${length} karaktera.`,
  max_value: (field, [max]) => `Polje ${field} ne sme biti veće od ${max}.`,
  mimes: (field) => `Polje ${field} mora biti validan tip fajla.`,
  min: (field, [length]) => `Polje ${field} mora sadržati najmanje ${length} karaktera.`,
  min_value: (field, [min]) => `Polje ${field} ne sme biti manje od ${min}.`,
  numeric: (field) => `Polje ${field} mora biti broj.`,
  regex: (field) => `Format polja ${field} nije validan.`,
  required: (field) => `Polje ${field} je obavezno.`,
  size: (field, [size]) => `Polje ${field} mora biti manje od ${formatFileSize(size)}.`,
  url: (field) => `Polje ${field} nije validna veb adresa.`
};

const locale = {
  name: 'sr_Latin',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
