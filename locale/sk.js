import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target, inclusion]) => `Položka ${field} musí byť vačšia ${inclusion ? 'alebo rovná ' : ''} ako položka ${target}.`,
  alpha_dash: (field) => `${field} môže obsahovať len písmená, číslice, bodky a podčiarknutie.`,
  alpha_num: (field) => `${field} môže obsahovať len písmená a číslice.`,
  alpha_spaces: (field) => `${field} môže obsahovať len písmená, číslice a medzery.`,
  alpha: (field) => `${field} môže obsahovať len písmená.`,
  before: (field, [target, inclusion]) => `Položka ${field} musí byť menšia ${inclusion ? 'alebo rovná ' : ''} ako položka ${target}.`,
  between: (field, [min, max]) => `Položka ${field} musí byť medzi ${min} a ${max}.`,
  confirmed: (field) => `Hodnota položky ${field} nie je rovnaká.`,
  credit_card: (field) => `Položka ${field} je neplatná.`,
  date_between: (field, [min, max]) => `${field} musí byť medzi ${min} a ${max}.`,
  date_format: (field, [format]) => `${field} musí byť vo formáte ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Položka ${field} musí byť číselná a smie obsahovať ${decimals === '*' ? '' : decimals} desatinné miesta.`,
  digits: (field, [length]) => `Položka ${field} musí obsahovať ${length} ${length < 5 ? 'čísla' : 'čísiel'}.`,
  dimensions: (field, [width, height]) => `Položka ${field} musí mať ${width} x ${height} pixlov.`,
  email: (field) => `Položka ${field} musí obsahovať správnu emailovú adresu.`,
  ext: (field) => `${field} nie je platný súbor.`,
  image: (field) => `${field} nie je obrázok.`,
  in: (field) => `Položka ${field} má nesprávnu hodnotu.`,
  ip: (field) => `Položka ${field} nie je platná IP adresa.`,
  max: (field, [length]) => `Položka ${field} môže obsahovať najviac ${length} znakov.`,
  max_value: (field, [max]) => `Položka ${field} musí byť maximálne ${max}.`,
  mimes: (field) => `Položka ${field} obsahuje nesprávny typ súboru.`,
  min: (field, [length]) => `Položka ${field} musí obsahovať minimálne ${length} ${length < 4 ? 'znaky' : 'znakov'}.`,
  min_value: (field, [min]) => `Položka ${field} musí byť minimálne ${min}.`,
  not_in: (field) => `Položka ${field} má nesprávnu hodnotu.`,
  numeric: (field) => `Položka ${field} môže obsahovať len číslice.`,
  regex: (field) => `Formát položky ${field} je nesprávny.`,
  required: (field) => `Položka ${field} je povinná.`,
  size: (field, [size]) => `Položka ${field} musí byť menej ako ${formatFileSize(size)}.`,
  url: (field) => `Položka ${field} neobsahuje platnú URL.`,
};

const locale = {
  name: 'sk',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
