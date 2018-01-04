import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} ist ungültig.`,
  after: (field, [target]) => `${field} muss nach ${target} liegen.`,
  alpha_dash: (field) => `${field} darf alphanumerische Zeichen sowie Striche und Unterstriche enthalten.`,
  alpha_num: (field) => `${field} darf nur alphanumerische Zeichen enthalten.`,
  alpha: (field) => `${field} darf nur alphabetische Zeichen enthalten.`,
  before: (field, [target]) => `${field} muss vor ${target} liegen.`,
  between: (field, [min, max]) => `${field} muss zwischen ${min} und ${max} liegen.`,
  confirmed: (field, [confirmedField]) => `${field} passt nicht zum Inhalt von ${confirmedField}.`,
  date_between: (field, [min, max]) => `${field} muss zwischen ${min} und ${max} liegen.`,
  date_format: (field, [format]) => `${field} muss das Format ${format} haben.`,
  decimal: (field, [decimals = '*'] = []) => `${field} muss numerisch sein und darf ${decimals === '*' ? '' : decimals} Dezimalpunkte enthalten.`,
  digits: (field, [length]) => `${field} muss numerisch sein und exakt ${length} Ziffern enthalten.`,
  dimensions: (field, [width, height]) => `${field} muss ${width} x ${height} Bildpunkte groß sein.`,
  email: (field) => `${field} muss eine gültige E-Mail-Adresse sein.`,
  ext: (field) => `${field} muss eine gültige Datei sein.`,
  image: (field) => `${field} muss eine Grafik sein.`,
  in: (field) => `${field} muss ein gültiger Wert sein.`,
  ip: (field) => `${field} muss eine gültige IP-Adresse sein.`,
  max: (field, [length]) => `${field} darf nicht länger als ${length} Zeichen sein.`,
  mimes: (field) => `${field} muss einen gültigen Dateityp haben.`,
  min: (field, [length]) => `${field} muss mindestens ${length} Zeichen lang sein.`,
  not_in: (field) => `${field} muss ein gültiger Wert sein.`,
  numeric: (field) => `${field} darf nur numerische Zeichen enthalten.`,
  regex: (field) => `Das Format von ${field} ist ungültig.`,
  required: (field) => `${field} ist ein Pflichtfeld.`,
  size: (field, [size]) => `${field} muss kleiner als ${formatFileSize(size)} sein.`,
  url: (field) => `${field} ist keine gültige URL.`,
};

const locale = {
  name: 'de',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
