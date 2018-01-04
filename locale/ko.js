import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  after: (field, [target]) => `${field}항목은 ${target}항목 뒤에 와야 합니다.`,
  alpha_dash: (field) => `${field}항목은 문자와 숫자 그리고 대시, 언더스코어를 사용할 수 있습니다.`,
  alpha_num: (field) => `${field}항목은 영문자와 숫자만 사용할 수 있습니다.`,
  alpha_spaces: (field) => `${field}항목은 영문자와 공백만 사용할 수 있습니다.`,
  alpha: (field) => `${field}항목은 영문자만 사용할 수 있습니다.`,
  before: (field, [target]) => `${field}항목은 ${target}항목의 앞에 와야 합니다.`,
  between: (field, [min, max]) => `${field}항목은 ${min} 와 ${max} 사이 값이어야 합니다.`,
  confirmed: (field, [confirmedField]) => `${field}의 항목이 ${confirmedField}항목과 일치하지 않습니다.`,
  date_between: (field, [min, max]) => `${field}항목은 ${min}와 ${max} 사이의 날짜이어야 합니다.`,
  date_format: (field, [format]) => `${field}항목은 ${format} 형식이어야 합니다.`,
  decimal: (field, [decimals = '*'] = []) => `${field}항목은 숫자이어야 하고 ${decimals === '*' ? '' : decimals} 소숫점을 가질 수 있습니다.`,
  digits: (field, [length]) => `${field}항목은 숫자이며 ${length}글자를 필요합니다.`,
  dimensions: (field, [width, height]) => `${field}의 사진 크기는 ${width}px과 ${height}px 이어야 합니다.`,
  email: (field) => `${field}항목은 올바른 이메일 형식이어야 합니다.`,
  ext: (field) => `${field}항목은 올바른 파일 형식이어야 합니다.`,
  image: (field) => `${field}항목은 이미지 파일이어야 합니다.`,
  in: (field) => `${field}항목은 올바른 값이어야 합니다.`,
  ip: (field) => `${field}항목은 올바른 IP 주소이어야 합니다.`,
  max: (field, [length]) => `${field}항목은 ${length}글자보다 작아야 합니다.`,
  max_value: (field, [max]) => `${field}는 최대한 ${max} 보다 작어야 합니다.`,
  mimes: (field) => `${field}는 올바른 파일이어야 합니다.`,
  min: (field, [length]) => `${field}는 최소한 ${length}글자보다 커야 합니다.`,
  min_value: (field, [min]) => `${field} ${min} 보다 커야합니다.`,
  not_in: (field) => `${field}항목은 올바른 값이어야 합니다.`,
  numeric: (field) => `${field}항목은 숫자이어야 합니다.`,
  regex: (field) => `${field}항목은 형식에 맞지 않습니다.`,
  required: (field) => `${field}항목이 필요합니다.`,
  size: (field, [size]) => `${field}항목의 크기는 ${formatFileSize(size)} 보다 작아야 합니다.`,
  url: (field) => `${field}항목은 올바른 주소(URL)가 아닙니다.`
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
