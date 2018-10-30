import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `ข้อมูล ${field} ไม่ถูกต้อง`,
  after: (field, [target]) => `${field} ต้องเป็นวันที่หลังจาก ${target}`,
  alpha: (field) => `${field} ต้องเป็นตัวอักษรเท่านั้น`,
  alpha_dash: (field) => `${field} สามารถมีตัวอักษร ตัวเลข เครื่องหมายขีดกลาง (-) และเครื่องหมายขีดล่าง (_)`,
  alpha_num: (field) => `${field} ต้องเป็นตัวอักษร และตัวเลขเท่านั้น`,
  alpha_spaces: (field) => `${field} ต้องเป็นตัวอักษร และช่องว่างเท่านั้น`,
  before: (field, [target]) => `${field} ต้องเป็นวันที่ก่อน ${target}`,
  between: (field, [min, max]) => `${field} ต้องเป็นค่าระหว่าง ${min} และ ${max}`,
  confirmed: (field) => `การยืนยันข้อมูลของ ${field} ไม่ตรงกัน`,
  credit_card: (field) => `หมายเลขบัตรเครดิตของ ${field} ไม่ถูกต้อง`,
  date_between: (field, [min, max]) => `วันที่ ${field} ต้องอยู่ระหว่าง ${min} และ ${max}`,
  date_format: (field, [format]) => `วันที่ ${field} ต้องเป็นรูปแบบ ${format}`,
  decimal: (field, [decimals = '*'] = []) => `${field} ต้องเป็นตัวเลข และสามารถมีจุดทศนิยม ${decimals === '*' ? '' : decimals + ' จุด'}`,
  digits: (field, [length]) => `${field} ต้องเป็นตัวเลขจำนวน ${length} หลักเท่านั้น`,
  dimensions: (field, [width, height]) => `${field} ต้องมีขนาด ${width}x${height} px`,
  email: (field) => `${field} ต้องเป็นรูปแบบอีเมล`,
  excluded: (field) => `${field} ต้องเป็นค่าที่กำหนดเท่านั้น`,
  ext: (field) => `${field} สกุลไฟล์ไม่ถูกต้อง`,
  image: (field) => `${field} ต้องเป็นรูปภาพเท่านั้น`,
  included: (field) => `${field} ต้องเป็นค่าที่กำหนดเท่านั้น`,
  integer: (field) => `${field} ต้องเป็นเลขจำนวนเต็ม`,
  ip: (field) => `${field} ไม่ถูกต้องตามรูปแบบ IP address`,
  length: (field, [length, max]) => {
    if (max) {
      return `${field} ต้องมีความยาวระหว่าง ${length} และ ${max}`;
    }

    return `${field} ต้องมีความยาว ${length}`;
  },
  max: (field, [length]) => `${field} ต้องมีความยาวไม่เกิน ${length} ตัวอักษร`,
  max_value: (field, [max]) => `${field} ต้องมีค่าไม่เกิน ${max}`,
  mimes: (field) => `${field} ประเภทไฟล์ไม่ถูกต้อง`,
  min: (field, [length]) => `${field} ต้องมีความยาวอย่างน้อย ${length} ตัวอักษร`,
  min_value: (field, [min]) => `${field} ต้องมีค่าตั้งแต่ ${min} ขึ้นไป`,
  numeric: (field) => `${field} ต้องเป็นตัวเลขเท่านั้น`,
  regex: (field) => `รูปแบบ ${field} ไม่ถูกต้อง`,
  required: (field) => `กรุณากรอก ${field}`,
  size: (field, [size]) => `${field} ต้องมีขนาดไฟล์ไม่เกิน ${formatFileSize(size)}`,
  url: (field) => `${field} ไม่ใช่รูปแบบของ URL ที่ถูกต้อง`
};

const locale = {
  name: 'th',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
