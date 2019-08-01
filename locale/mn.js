import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field}-н утга буруу байна`,
  after: (field, [target, inclusion]) => `${field}-н утга ${target}-с бага ${inclusion ? 'эсвэл тэнцүү ' : ''}байх ёстой`,
  alpha: (field) => `${field}-н утга зөвхөн үсэг агуулах боломжтой`,
  alpha_dash: (field) => `${field}-н утга зөвхөн үсэг, дундуур зураас, доогуур зураас агуулах боломжтой`,
  alpha_num: (field) => `${field}-н утга зөвхөн тоо болон үсэг агуулах боломжтой`,
  alpha_spaces: (field) => `${field}-н утга зөвхөн үсэг болон зай агуулах боломжтой`,
  before: (field, [target, inclusion]) => `${field}-н утга ${target}-с өмнө ${inclusion ? 'эсвэл тэнцүү ' : ''}байх ёстой`,
  between: (field, [min, max]) => `${field}-н утга зөвхөн ${min}-с ${max} -ны хооронд байх ёстой`,
  confirmed: (field) => `${field}-н утга буруу байна`,
  credit_card: (field) => `${field}-н утга зөв картын дугаар байх ёстой`,
  date_between: (field, [min, max]) => `${field}-н утга ${min} болон ${max}-ы хооронд байх шаардлагатай`,
  date_format: (field, [format]) => `${field}-н утга ${format} форматтай байна`,
  decimal: (field, [decimals = '*'] = []) => `${field}-н утга зөвхөн тоо байх ба ${!decimals || decimals === '*' ? '' : decimals} бутархай тоо агуулах боломжтой`,
  digits: (field, [length]) => `${field}-н утга зөвхөн тоо байх ба яг  ${length} оронтой байна`,
  dimensions: (field, [width, height]) => `${field}-н хэмжээ ${width}x${height} пикселээс хэтрэх байх шаардлагатай`,
  email: (field) => `${field}-н утга бодит майл байх ёстой`,
  excluded: (field, [excluded]) => `${field}-н утга ${excluded} байж болохгүй`,
  ext: (field, [ext]) => `${field} заавал файл заавал ${ext} форматтай байх ёстой`,
  image: (field) => `${field} заавал зураг байх ёстой`,
  included: (field, [included]) => `${field}-н утга заавал дараахын нэг нь байна (${included})`,
  integer: (field) => `${field}-н утга тоо байх ёстой`,
  ip: (field) => `${field}-н утга зөвхөн IP хаяг байна`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field}-н урт нь ${length} болон ${max}-ны хооронд байна`;
    }

    return `${field}-н урт нь ${length} байна`;
  },
  max: (field, [length]) => `${field}-н урт нь хамгийн ихдээ ${length} байна`,
  max_value: (field, [max]) => `${field}-н утга ${max}-с хэтрэхгүй байна`,
  mimes: (field) => `${field} зөвшөөрөгдөөгүй файл форматтай байна`,
  min: (field, [length]) => `${field}-н урт нь хамгийн багадаа ${length} байна`,
  min_value: (field, [min]) => `${field}-н утга ${min}-с багагүй байна`,
  numeric: (field) => `${field}-н утга зөвхөн тоо байна`,
  regex: (field) => `${field}-н утга буруу форматтай байна`,
  required: (field) => `${field}-н утга заавал байх ёстой`,
  required_if: (field) => `${field}-н утга заавал байх ёстой`,
  size: (field, [size]) => `${field} хэмжээ ${formatFileSize(size)}-с хэтрэхгүй байна`,
  url: (field) => `${field} зөв URL хаяг биш байна`
};

const locale = {
  name: 'mn',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
