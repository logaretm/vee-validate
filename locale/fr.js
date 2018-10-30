import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Le champ ${field} n'est pas valide.`,
  after: (field, [target]) => `Le champ ${field} doit être postérieur à ${target}.`,
  alpha: (field) => `Le champ ${field} ne peut contenir que des lettres.`,
  alpha_dash: (field) => `Le champ ${field} ne peut contenir que des caractères alpha-numériques, tirets ou soulignés.`,
  alpha_num: (field) => `Le champ ${field} ne peut contenir que des caractères alpha-numériques.`,
  alpha_spaces: (field) => `Le champ ${field} ne peut contenir que des lettres ou des espaces.`,
  before: (field, [target]) => `Le champ ${field} doit être antérieur à ${target}.`,
  between: (field, [min, max]) => `Le champ ${field} doit être compris entre ${min} et ${max}.`,
  confirmed: (field, [confirmedField]) => `Le champ ${field} ne correspond pas à ${confirmedField}.`,
  credit_card: (field) => `Le champ ${field} est invalide.`,
  date_between: (field, [min, max]) => `Le champ ${field} doit être situé entre ${min} et ${max}.`,
  date_format: (field, [format]) => `Le champ ${field} doit être au format ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Le champ ${field} doit être un nombre et peut contenir ${decimals === '*' ? 'des' : decimals} décimales.`,
  digits: (field, [length]) => `Le champ ${field} doit être un nombre entier de ${length} chiffres.`,
  dimensions: (field, [width, height]) => `Le champ ${field} doit avoir une taille de ${width} pixels par ${height} pixels.`,
  email: (field) => `Le champ ${field} doit être une adresse e-mail valide.`,
  excluded: (field) => `Le champ ${field} doit être une valeur valide.`,
  ext: (field) => `Le champ ${field} doit être un fichier valide.`,
  image: (field) => `Le champ ${field} doit être une image.`,
  included: (field) => `Le champ ${field} doit être une valeur valide.`,
  integer: (field) => `Le champ ${field} doit être un entier.`,
  ip: (field) => `Le champ ${field} doit être une adresse IP.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Le champ ${field} doit contenir entre ${length} et ${max} caractères.`;
    }

    return `Le champ ${field} doit contenir ${length} caractères.`;
  },
  max: (field, [length]) => `Le champ ${field} ne peut pas contenir plus de ${length} caractères.`,
  max_value: (field, [max]) => `Le champ ${field} doit avoir une valeur de ${max} ou moins.`,
  mimes: (field) => `Le champ ${field} doit avoir un type MIME valide.`,
  min: (field, [length]) => `Le champ ${field} doit contenir au minimum ${length} caractères.`,
  min_value: (field, [min]) => `Le champ ${field} doit avoir une valeur de ${min} ou plus.`,
  numeric: (field) => `Le champ ${field} ne peut contenir que des chiffres.`,
  regex: (field) => `Le champ ${field} est invalide.`,
  required: (field) => `Le champ ${field} est obligatoire.`,
  size: (field, [size]) => `Le champ ${field} doit avoir un poids inférieur à ${formatFileSize(size)}.`,
  url: (field) => `Le champ ${field} n'est pas une URL valide.`
};

const locale = {
  name: 'fr',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
