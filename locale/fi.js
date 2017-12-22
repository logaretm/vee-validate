import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field} tulee olla jälkeen ${target}.`,
  alpha_dash: (field) => `${field} voi sisältää vain kirajimia, numeroita, ja tavu-, tai alaviivoja.`,
  alpha_num: (field) => `${field} voi sisältää vain kirjaimia ja numeroita.`,
  alpha: (field) => `${field} voi sisältää vain kirjaimia.`,
  before: (field, [target]) => `${field} tulee olla ennen ${target}.`,
  between: (field, [min, max]) => `Kentän ${field} tulee olla ${min} ja ${max} väliltä.`,
  confirmed: (field, [confirmedField]) => `${field} ei vastannut ${confirmedField}.`,
  date_between: (field, [min, max]) => `${field} tulee olla ${min} ja ${max} väliltä.`,
  date_format: (field, [format]) => `${field} tulee olla muodossa ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} tulee olla numeerinen ja voi sisältää ${decimals === '*' ? '' : decimals} desimaalia.`,
  digits: (field, [length]) => `${field} tulee olla numeerinen ja tarkalleen ${length} merkkiä.`,
  dimensions: (field, [width, height]) => `${field} tulee olla ${width} pikseliä kertaa ${height} pikseliä.`,
  email: (field) => `${field} tulee olla kelvollinen sähköpostiosoite.`,
  ext: (field) => `${field} tulee olla kelvollinen tiedosto.`,
  image: (field) => `${field} tulee olla kelvollinen kuva.`,
  in: (field) => `${field} tulee olla kelvollinen arvo.`,
  ip: (field) => `${field} tulee olla kelvollinen IP-osoite.`,
  max: (field, [length]) => `${field} ei saa olle pidempi kuin ${length} merkkiä.`,
  mimes: (field) => `${field} tulee olla kelvollinen tiedostotyyppi.`,
  min: (field, [length]) => `${field} tulee olla vähintään ${length} merkkiä.`,
  not_in: (field) => `${field} tulee olla kelvollinen arvo.`,
  numeric: (field) => `${field} voi sisältää vain numeroita.`,
  regex: (field) => `${field} tulee olla kelvollinen säännöllinen lauseke.`,
  required: (field) => `${field} on pakollinen kenttä.`,
  size: (field, [size]) => `${field} tulee olla vähemmän kuin ${formatFileSize(size)}.`,
  url: (field) => `${field} tulee olla kelvollinen URL-osoite.`
};

const locale = {
  name: 'fi',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
