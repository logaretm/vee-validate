import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Laukā ${field} ievadītā vērtība nav korekta.`,
  after: (field, [target, inclusion]) => `Lauka ${field} vērtībai jābūt lielākai par ${inclusion ? 'vai vienādai ar ' : ''}${target}.`,
  alpha: (field) => ` Laukā ${field} var ievadīt tikai burtus.`,
  alpha_dash: (field) => `Laukā ${field} var ievadīt tikai burtus, ciparus, domuzīmes un pasvītras.`,
  alpha_num: (field) => `Laukā ${field} var ievadīt tikai burtus un ciparus.`,
  alpha_spaces: (field) => `Laukā ${field} var ievadīt tikai burtus un atstarpes.`,
  before: (field, [target, inclusion]) => `Lauka ${field} vērtībai jābūt mazākai par ${inclusion ? 'vai vienādai ar ' : ''}${target}.`,
  between: (field, [min, max]) => `Lauka ${field} vērtībai jābūt intervālā starp ${min} un ${max}.`,
  confirmed: (field) => `Apstiprinājuma lauka ${field} vērtība nav korekta.`,
  credit_card: (field) => `Laukā ${field} ievadīta nekorekta vērtība.`,
  date_between: (field, [min, max]) => `Lauka ${field} vērtībai jābut intervālā starp ${min} un ${max}.`,
  date_format: (field, [format]) => `Laukam ${field} vērtībai jābūt formātā ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `Laukā ${field} var ievadīt ciparus un drīkst izmantot ${!decimals || decimals === '*' ? '' : decimals} decimālpunktus.`,
  digits: (field, [length]) => `Lauka ${field} vērtību veido precīzs ${length} ciparu skaits`,
  dimensions: (field, [width, height]) => `Lauka  ${field} izmērs ir ${width} pikseļu  platumā un ${height} pikseļu augstumā.`,
  email: (field) => `Lauka ${field} vērtībai jābūt derīgai e-pasta adresei.`,
  excluded: (field) => `Laukā ${field} jāievada derīga vērtība.`,
  ext: (field) => `Lauka ${field} vērtībai jābūt failam.`,
  image: (field) => `Lauka ${field} vērtībai jābūt attēlam.`,
  included: (field) => `Lauka ${field} vērtībai jābūt derīgai.`,
  integer: (field) => `Lauka ${field} vērtībai jābūt veselam skaitlim.`,
  ip: (field) => `Kā ${field} vērtībai jābūt IP adresei.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Lauka ${field} garumam jābūt intervālā starp ${length} un ${max}.`;
    }

    return `Lauka ${field} garumam jābūt ${length}.`;
  },
  max: (field, [length]) => `Laukā ${field} nevar ievadīt vairāk nekā ${length} rakstzīmes.`,
  max_value: (field, [max]) => `Lauka ${field} vērtībai jābūt ${max} vai mazākai.`,
  mimes: (field) => `Lauka ${field} vērtībai jābūt failam.`,
  min: (field, [length]) => `Laukā ${field} jāievada vismaz ${length} rakstzīmes.`,
  min_value: (field, [min]) => `Laukā ${field} izmanto minimālo vērtību ${min} vai lielāku.`,
  numeric: (field) => `Laukā ${field} var ievadīt tikai ciparus.`,
  regex: (field) => `Lauka ${field} formāts nav korekts.`,
  required: (field) => `Lauks ${field} ir obligāti aizpildāms.`,
  size: (field, [size]) => `Lauka ${field} lielumam jābut mazākam nekā ${formatFileSize(size)}.`,
  url: (field) => `Laukā ${field} ievadītā URL vērtība nav korekta.`
};

const locale = {
  name: 'lv',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
