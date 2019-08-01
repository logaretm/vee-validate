import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} göstəricisi yalnışdır`,
  after: (field, [target, inclusion]) => `${field} yalnız ${target} tarixindən sonra${inclusion ? `, və ya ${target} tarixində ` : ' '}ola bilər`,
  alpha: (field) => `${field} yalnız hərflərdən ibarət olmalıdır`,
  alpha_dash: (field) => `${field} yalnız hərflər, rəqəmlər və defisdən ibarət ola bilər`,
  alpha_num: (field) => `${field} yalnız rəqəmlərdən ibarət ola bilər`,
  alpha_spaces: (field) => `${field} yalnız rəqəmlərdən və ara simvolundan (space) ibarət ola bilər`,
  before: (field, [target, inclusion]) => `${field} yalnız ${target} tarixindən öncə${inclusion ? `, və ya ${target} tarixində ` : ' '}ola bilər`,
  between: (field, [min, max]) => `${field} yalnız ${min} və ${max} arası ola bilər`,
  confirmed: (field) => `${field} təsdiqləməsi yalnışdır`,
  credit_card: (field) => `${field} göstəriciləri düzgün daxil olunmayıb`,
  date_between: (field, [min, max]) => `${field} ${min} və ${max} arası olmalıdır`,
  date_format: (field, [format]) => `${field} ${format} formatında olmalıdır`,
  decimal: (field, [decimals = '*'] = []) => `${field} yalnız rəqəmlərdən${!decimals || decimals === '*' ? '' : ` və nöqtədən sonra ${decimals} onluq ədəddən`} ibarət ola bilər`,
  digits: (field, [length]) => `${field} ${length} rəqəmdən ibarət olmalıdır`,
  dimensions: (field, [width, height]) => `${field} ölçüsü ${width}x${height} piksel olmalıdır`,
  email: (field) => `${field} düzgün formatda daxil olunmalıdır`,
  excluded: (field) => `${field} göstəricisi yalnışdır`,
  ext: (field) => `${field} düzgün fayl formatında olmalıdır`,
  image: (field) => `${field} şəkil olmalıdır`,
  included: (field) => `${field} göstəricisi yalnışdır`,
  integer: (field) => `${field} göstəricisi tam ədəd olmalıdır`,
  ip: (field) => `${field} IP ünvanı düzgün formatda daxil olunmayıb`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field} uzunluğu ${length} və ${max} arası olmalıdır`;
    }

    return `${field} uzunluğu ${length} olmalıdır`;
  },
  max: (field, [length]) => `${field} uzunluğu ən çox ${length} simvoldan ibarət ola bilər`,
  max_value: (field, [max]) => `${field} göstəricisi ən çox ${max} və ya daha az olmalıdır`,
  mimes: (field) => `${field} formatı yalnışdır`,
  min: (field, [length]) => `${field} uzunluğu ən az ${length} simvoldan ibarət olmalıdır`,
  min_value: (field, [min]) => `${field} göstəricisi minimum ${min} və ya daha çox olmalıdır`,
  numeric: (field) => `${field} yalnız rəqəmlərdən ibarət olmalıdır`,
  regex: (field) => `${field} formatı yalnışdır`,
  required: (field) => `${field} əlavə etmək zəruridir`,
  size: (field, [size]) => `${field} həcmi ${formatFileSize(size)} və daha az olmalıdır`,
  url: (field) => `${field} düzgün URL formatında daxil olunmalıdır`
};

const locale = {
  name: 'az',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;