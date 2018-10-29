import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field}항목의 값이 유효하지 않습니다.`,
  after: (field, [target, inclusion]) => `${field}항목의 값은 ${target}항목의 값 이후${inclusion ? '거나 같은 날이어야' : '여야'} 합니다.`,
  alpha: (field) => `${field}항목에는 영문자만 사용 가능합니다.`,
  alpha_dash: (field) => `${field}항목에는 영문자, 숫자와 특수기호(-),(_)만 사용 가능합니다.`,
  alpha_num: (field) => `${field}항목에는 영문자와 숫자만 사용 가능합니다.`,
  alpha_spaces: (field) => `${field}항목에는 영문자와 공백만 사용 가능합니다.`,
  before: (field, [target, inclusion]) => `${field}항목의 값은 ${target}항목의 값 이전${inclusion ? '이거나 같은 날' : ''}이어야 합니다.`,
  between: (field, [min, max]) => `${field}항목의 값은 ${min}에서 ${max} 사이여야 합니다.`,
  confirmed: (field) => `${field}항목의 값이 일치하지 않습니다.`,
  credit_card: (field) => `${field}항목의 값이 유효하지 않습니다.`,
  date_between: (field, [min, max]) => `${field}항목의 값은 ${min}과 ${max} 사이의 날짜이어야 합니다.`,
  date_format: (field, [format]) => `${field}항목의 값은 ${format}형식이어야 합니다.`,
  decimal: (field, [decimals = '*'] = []) => `${field}항목의 값은 숫자이어야 하며, 소수점 이하 ${!decimals || decimals === '*' ? '' : decimals}자리까지 사용 가능합니다.`,
  digits: (field, [length]) => `${field}항목의 값은 ${length}자리의 숫자이어야 합니다.`,
  dimensions: (field, [width, height]) => `${field}항목의 크기는 가로 ${width}픽셀, 세로 ${height}픽셀이어야 합니다.`,
  email: (field) => `${field}항목의 값은 유효한 이메일 형식이어야 합니다.`,
  excluded: (field) => `${field}항목은 유효한 값이어야 합니다.`,
  ext: (field) => `${field}항목은 유효한 파일이어야 합니다.`,
  image: (field) => `${field}항목은 이미지 파일이어야 합니다.`,
  included: (field) => `${field}항목의 값은 유효한 값이어야 합니다.`,
  integer: (field) => `${field}항목의 값은 정수이어야 합니다.`,
  ip: (field) => `${field}항목의 값은 유효한 IP(ipv4) 주소이어야 합니다.`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field}항목의 값은 ${length}자에서 ${max}자이어야 합니다.`;
    }
    return `${field}항목의 값은 ${length}자이어야 합니다.`;
  },
  max: (field, [length]) => `${field}항목의 값은 최대 ${length}글자이어야 합니다.`,
  max_value: (field, [max]) => `${field}항목의 값은 ${max} 이하이어야 합니다.`,
  mimes: (field) => `${field}는 유효한 파일 형식의 파일이어야 합니다.`,
  min: (field, [length]) => `${field}항목의 값은 최소 ${length}글자이어야 합니다.`,
  min_value: (field, [min]) => `${field}항목의 값은 ${min} 이상이어야 합니다.`,
  numeric: (field) => `${field}항목에는 숫자만 사용 가능합니다.`,
  regex: (field) => `${field}항목은 형식에 맞지 않습니다.`,
  required: (field) => `${field}항목은 필수 정보입니다.`,
  size: (field, [size]) => `${field}항목의 크기는 ${formatFileSize(size)}보다 작아야 합니다.`,
  url: (field) => `${field}항목의 값은 유효한 주소(URL)가 아닙니다.`
};

const locale = {
  name: 'ko',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
