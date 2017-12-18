import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} waarde is ongeldig.`,
  after: (field, [target, inclusion]) => `${field} moet later zijn dan ${inclusion ? 'of gelijk aan ' : ''}${target}.`,
  alpha_dash: (field) => `${field} mag alleen letters, nummers, en streepjes bevatten.`,
  alpha_num: (field) => `${field} mag alleen letters en nummers bevatten.`,
  alpha_spaces: (field) => `${field} mag alleen letters en spaties bevatten.`,
  alpha: (field) => `${field} mag alleen letters bevatten.`,
  before: (field, [target, inclusion]) => `${field} moet eerder zijn dan ${inclusion ? 'of gelijk aan ' : ''}${target}.`,
  between: (field, [min, max]) => `${field} moet tussen ${min} en ${max} liggen.`,
  confirmed: (field) => `${field} bevestiging komt niet overeen.`,
  credit_card: (field) => `${field} is ongeldig.`,
  date_between: (field, [min, max]) => `${field} moet tussen ${min} en ${max} liggen.`,
  date_format: (field, [format]) => `${field} moet in het volgende formaat zijn: ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} moet een nummer zijn en mag ${decimals === '*' ? '' : decimals} decimalen bevatten.`,
  digits: (field, [length]) => `${field} moet een nummer zijn en exact ${length} tekens bevatten.`,
  dimensions: (field, [width, height]) => `${field} moet ${width} pixels breed zijn en ${height} pixels hoog.`,
  email: (field) => `${field} moet een geldig emailadres zijn`,
  ext: (field) => `${field} moet een geldig bestand zijn.`,
  image: (field) => `${field} moet een afbeelding zijn.`,
  in: (field) => `${field} moet een geldige waarde zijn.`,
  ip: (field) => `${field} moet een geldig IP-adres zijn.`,
  max: (field, [length]) => `${field} mag niet groter zijn dan ${length} karakters.`,
  max_value: (field, [max]) => `${field} mag maximaal ${max} zijn.`,
  mimes: (field) => `${field} moet een geldig bestandstype hebben.`,
  min: (field, [length]) => `${field} moet minimaal ${length} karakters zijn.`,
  min_value: (field, [min]) => `${field} moet minimaal ${min} zijn.`,
  not_in: (field) => `${field} is ongeldig.`,
  numeric: (field) => `${field} mag alleen nummers bevatten`,
  regex: (field) => `${field} formaat is ongeldig.`,
  required: (field) => `${field} is verplicht.`,
  size: (field, [size]) => `${field} mag niet groter zijn dan ${formatFileSize(size)}.`,
  url: (field) => `${field} is geen geldige URL.`
};

const locale = {
  name: 'nl',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
