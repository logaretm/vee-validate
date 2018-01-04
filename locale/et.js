import { formatFileSize, isDefinedGlobally } from './utils';

// http://stackoverflow.com/a/1026087/1470607
function capitalizeFirstLetter (string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const messages = {
  _default: (field) => `${capitalizeFirstLetter(field)} ei oma sobivat väärtust.`,
  after: (field, [target]) => `${capitalizeFirstLetter(field)} peab olema hiljem kui ${target}.`,
  alpha_dash: (field) => `${capitalizeFirstLetter(field)} võib sisaldada ainult tähti, numbreid, kriipse ja alakriipse.`,
  alpha_num: (field) => `${capitalizeFirstLetter(field)} võib sisaldada ainult tähti ja numbreid.`,
  alpha_spaces: (field) => `${capitalizeFirstLetter(field)} võib sisaldada ainult tähti ja tühikuid.`,
  alpha: (field) => `${capitalizeFirstLetter(field)} võib sisaldada ainult tähti.`,
  before: (field, [target]) => `${capitalizeFirstLetter(field)} peab olema varem kui ${target}.`,
  between: (field, [min, max]) => `${capitalizeFirstLetter(field)} peab jääma vahemikku ${min} kuni ${max}.`,
  confirmed: (field) => `${capitalizeFirstLetter(field)} on kontrollist erinev.`,
  credit_card: (field) => `${capitalizeFirstLetter(field)} ei oma sobivat väärtust.`,
  date_between: (field, [min, max]) => `${capitalizeFirstLetter(field)} peab olema vahemikus ${min} kuni ${max}.`,
  date_format: (field, [format]) => `${capitalizeFirstLetter(field)} peab olema kujul ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${capitalizeFirstLetter(field)} peab olema number ja võib sisaldada ${decimals === '*' ? 'komakohta' : `${decimals} numbrit pärast koma`}.`,
  digits: (field, [length]) => `${capitalizeFirstLetter(field)} peab koosnema täpselt ${length}-st numbrist.`,
  dimensions: (field, [width, height]) => `${capitalizeFirstLetter(field)} peab olema ${width} korda ${height} pikslit suur.`,
  email: (field) => `${capitalizeFirstLetter(field)} peab olema e-maili aadress.`,
  ext: (field) => `${capitalizeFirstLetter(field)} peab olema sobiv fail.`,
  image: (field) => `${capitalizeFirstLetter(field)} peab olema pilt.`,
  in: (field) => `${capitalizeFirstLetter(field)} ei oma sobivat väärtust.`,
  ip: (field) => `${capitalizeFirstLetter(field)} peab olema IP-aadress.`,
  max: (field, [length]) => `${capitalizeFirstLetter(field)} ei tohi olla pikem kui ${length} tähemärki.`,
  max_value: (field, [max]) => `${capitalizeFirstLetter(field)} peab olema ${max} või väisem.`,
  mimes: (field) => `${capitalizeFirstLetter(field)} peab olema sobivat tüüpi fail.`,
  min: (field, [length]) => `${capitalizeFirstLetter(field)} peab olema vähemalt ${length} tähemärki pikk.`,
  min_value: (field, [min]) => `${capitalizeFirstLetter(field)} peab olema ${min} või suurem.`,
  not_in: (field) => `${capitalizeFirstLetter(field)} ei oma sobivat väärtust.`,
  numeric: (field) => `${capitalizeFirstLetter(field)} võib sisaldada ainult numbreid.`,
  regex: (field) => `${capitalizeFirstLetter(field)} pole sobival kujul.`,
  required: (field) => `${capitalizeFirstLetter(field)} on nõutud väli.`,
  size: (field, [size]) => `${capitalizeFirstLetter(field)} peab olema väiksem kui ${formatFileSize(size)}.`,
  url: (field) => `${capitalizeFirstLetter(field)} peab olema URL.`
};

const locale = {
  name: 'et',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
