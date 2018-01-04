import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} baliogabea da.`,
  after: (field, [target, inclusion]) => `${field}(e)k honen ondoren egon behar du ${inclusion ? 'edo honen berdina izan ' : ''}${target}.`,
  alpha_dash: (field) => `${field} eremuak karaktere alfanumerikoak, marrak eta azpimarrak eduki ditzake.`,
  alpha_num: (field) => `${field} eremuak soilik karaktere alfanumerikoak eduki ditzake.`,
  alpha_spaces: (field) => `${field} eremuak soilik karaktere alfanumerikoak eta zuriuneak eduki ditzake.`,
  alpha: (field) => `${field} eremuak soilik karaktere alfabetikoak eduki ditzake.`,
  before: (field, [target, inclusion]) => `${field}(e)k honen aurretik egon behar du ${inclusion ? 'edo honen berdina izan ' : ''}${target}.`,
  between: (field, [min, max]) => `${field} eremuak ${min} eta ${max} artean egon behar du.`,
  confirmed: (field) => `${field} berrespenak ez datoz bat.`,
  credit_card: (field) => `${field} eremua baliogabea da.`,
  date_between: (field, [min, max]) => `${field}(e)k ${min} eta ${max} artean egon behar du.`,
  date_format: (field, [format]) => `${field}(e)k ${format} formatuan egon behar du.`,
  decimal: (field, [decimals = '*'] = []) => `${field} eremuak zenbakizkoa izan behar du eta ${!decimals || decimals === '*' ? '' : decimals} dezimal izan ditzake.`,
  digits: (field, [length]) => `${field} eremuak zenbakizkoa izan behar du eta zehazki ${length} digitu izan behar ditu.`,
  dimensions: (field, [width, height]) => `${field} eremuak ${width} pixel bider ${height} pixel izan behar du.`,
  email: (field) => `${field} eremuak baliozko helbide elektroniko bat izan behar du.`,
  ext: (field) => `${field} eremuak baliozko fitxategi bat izan behar du.`,
  image: (field) => `${field} eremuak irudi bat izan behar du.`,
  in: (field) => `${field} eremuak baliozko balio bat izan behar du.`,
  integer: (field) => `${field} eremuak zenbaki oso bat izan behar du.`,
  ip: (field) => `${field} eremuak baliozko IP helbide bat izan behar du.`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field}(r)en luzerak ${length} eta ${max} artean egon behar du.`;
    }

    return `${field}(r)en luzerak ${length} izan behar du.`;
  },
  max: (field, [length]) => `${field} eremuak ezin ditu ${length} karaktere baino gehiago izan.`,
  max_value: (field, [max]) => `${field} eremuak ${max} edo gutxiago izan behar du.`,
  mimes: (field) => `${field} eremuak baliozko fitxategi-mota bat izan behar du.`,
  min: (field, [length]) => `${field} eremuak gutxienez ${length} karaktere izan behar ditu.`,
  min_value: (field, [min]) => `${field} eremuak ${min} edo gehiago izan behar du.`,
  not_in: (field) => `${field} eremuak baliozko balio bat izan behar du.`,
  numeric: (field) => `${field} eremuak zenbakizko karaktereak soilik izan ditzake.`,
  regex: (field) => `${field} eremuaren formatua baliogabea da.`,
  required: (field) => `${field} eremua derrigorrezkoa da.`,
  size: (field, [size]) => `${field}(e)n tamainak ${formatFileSize(size)} baino txikiagoa izan behar du.`,
  url: (field) => `${field} eremua ez da baliozko URL bat.`
};

const locale = {
  name: 'eu',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
