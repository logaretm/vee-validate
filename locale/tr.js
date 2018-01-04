import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field} ${target} alanından ileri bir tarih olmalıdır.`,
  alpha_dash: (field) => `${field} alanı harf ve tire (-) yada alttan tire (_) içerebilir.`,
  alpha_num: (field) => `${field} yalnızca harf ve rakam içerebilir.`,
  alpha_spaces: (field) => `${field} yalnızca harf boşluk (space) içerebilir.`,
  alpha: (field) => `${field} yalnızca harf içerebilir.`,
  before: (field, [target]) => `${field} ${target} alanından önce bir tarih olmalıdır.`,
  between: (field, [min, max]) => `${field} ${min} ile ${max} aralığında olmalıdır.`,
  confirmed: (field) => `${field} doğrulaması hatalı.`,
  credit_card: (field) => `${field} numarası hatalı.`,
  date_between: (field, [min, max]) => `${field} ${min} ile ${max} tarihleri arasında olmalıdır.`,
  date_format: (field, [format]) => `${field} ${format} formatında olmalıdır.`,
  decimal: (field, [decimals = '*'] = []) => `${field} sayısal${decimals !== '*' ? `ve noktadan sonra ${decimals} basamaklı` : ''} olmalıdır.`,
  digits: (field, [length]) => `${field} sayısal ve ${length} basamaklı olmalıdır.`,
  dimensions: (field, [width, height]) => `${field} alanı ${width} piksel ile ${height} piksel arasında olmalıdır.`,
  email: (field) => `${field} alanının geçerli bir e-posta olması gerekir.`,
  ext: (field) => `${field} alanı geçerli bir dosya olmalıdır.`,
  image: (field) => `${field} alanı resim dosyası olmalıdır.`,
  in: (field) => `${field} alanına geçerli bir değer giriniz.`,
  ip: (field) => `${field} alanı geçerli bir ip adresi olmalıdır.`,
  max: (field, [length]) => `${field} alanı ${length} karakterden fazla olmamalıdır.`,
  max_value: (field, [max]) => `${field} alanı ${max} yada daha az bir değer olmalıdır.`,
  mimes: (field) => `${field} geçerli bir dosya olmalıdır.`,
  min: (field, [length]) => `${field} alanına en az ${length} karakter girilmelidir.`,
  min_value: (field, [min]) => `${field} alanı ${min} yada daha fazla bir değer olmalıdır.`,
  not_in: (field) => `${field} alanına geçerli bir değer giriniz.`,
  numeric: (field) => `${field} alanına sayısal bir değer giriniz.`,
  regex: (field) => `${field} formatı geçersiz.`,
  required: (field) => `${field} alanı gereklidir.`,
  size: (field, [size]) => `${field} alanı ${formatFileSize(size)}'dan daha az olmalıdır.`,
  url: (field) => `${field} geçersiz URL.`
};

const locale = {
  name: 'tr',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
