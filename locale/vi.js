import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `Giá trị của ${field} không đúng.`,
  after: (field, [target]) => `${field} phải xuất hiện sau ${target}.`,
  alpha_dash: (field) => `${field} có thể chứa các kí tự chữ (A-Z a-z), số (0-9), gạch ngang (-) và gạch dưới (_).`,
  alpha_num: (field) => `${field} chỉ có thể chứa các kí tự chữ và số.`,
  alpha_spaces: (field) => `${field} chỉ có thế chứa các kí tự và khoảng trắng`,
  alpha: (field) => `${field} chỉ có thể chứa các kí tự chữ.`,
  before: (field, [target]) => `${field} phải xuất hiện trước ${target}.`,
  between: (field, [min, max]) => `${field} phải có giá trị nằm trong khoảng giữa ${min} và ${max}.`,
  confirmed: (field, [confirmedField]) => `${field} khác với ${confirmedField}.`,
  credit_card: (field) => `Đã điền ${field} không chính xác.`,
  date_between: (field, [min, max]) => `${field} phải có giá trị nằm trong khoảng giữa  ${min} và ${max}.`,
  date_format: (field, [format]) => `${field} phải có giá trị dưới định dạng ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} chỉ có thể chứa các kí tự số và dấu thập phân ${decimals === '*' ? '' : decimals}.`,
  digits: (field, [length]) => `Trường ${field} chỉ có thể chứa các kí tự số và bắt buộc phải có độ dài là ${length}.`,
  dimensions: (field, [width, height]) => `${field} phải có chiều rộng ${width} pixels và chiều cao ${height} pixels.`,
  email: (field) => `${field} phải là một địa chỉ email hợp lệ.`,
  ext: (field) => `${field} phải là một tệp.`,
  image: (field) => `Trường ${field} phải là một ảnh.`,
  in: (field) => `${field} phải là một giá trị.`,
  ip: (field) => `${field} phải là một địa chỉ ip hợp lệ.`,
  max: (field, [length]) => `${field} không thể có nhiều hơn ${length} kí tự.`,
  max_value: (field, [max]) => `${field} phải nhỏ hơn hoặc bằng ${max}.`,
  mimes: (field) => `${field} phải chứa kiểu tệp phù hợp.`,
  min: (field, [length]) => `${field} phải chứa ít nhất ${length} kí tự.`,
  min_value: (field, [min]) => `${field} phải lớn hơn hoặc bằng ${min}.`,
  not_in: (field) => `${field} phải chứa một giá trị hợp lệ.`,
  numeric: (field) => `${field} chỉ có thể có các kí tự số.`,
  regex: (field) => `${field} có định dạng không đúng.`,
  required: (field) => `${field} là bắt buộc.`,
  size: (field, [size]) => `${field} chỉ có thể chứa tệp nhỏ hơn ${formatFileSize(size)}.`,
  url: (field) => `${field} không phải là một địa chỉ URL hợp lệ.`
};

const locale = {
  name: 'vi',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
