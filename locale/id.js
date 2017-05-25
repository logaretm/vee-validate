const messages = {
  after: (field, [target]) => `${field} harus sebelum ${target}.`,
  alpha_dash: (field) => `${field} boleh mengandung karakter alfanumerik, tanda hubung, dan garis bawah.`,
  alpha_num: (field) => `${field} hanya boleh mengandung karakter alfanumerik.`,
  alpha: (field) => `${field} hanya boleh mengandung karakter alfabet.`,
  before: (field, [target]) => `${field} harus setelah ${target}.`,
  between: (field, [min, max]) => `${field} harus di antara ${min} dan ${max}.`,
  confirmed: (field, [confirmedField]) => `${field} tidak cocok dengan ${confirmedField}.`,
  date_between: (field, [min, max]) => `${field} harus di antara ${min} dan ${max}.`,
  date_format: (field, [format]) => `${field} harus dalam format ${format}.`,
  decimal: (field, [decimals] = ['*']) => `${field} harus berupa angka dan boleh mengandung ${decimals === '*' ? '' : decimals} titik desimal.`,
  digits: (field, [length]) => `${field} harus berupa ${length} digit angka.`,
  dimensions: (field, [width, height]) => `${field} harus berdimensi lebar ${width} pixel dan tinggi ${height} pixel.`,
  email: (field) => `${field} harus berupa alamat surel yang benar.`,
  ext: (field) => `${field} harus berupa berkas yang benar.`,
  image: (field) => `${field} harus berupa gambar.`,
  in: (field) => `${field} harus berupa nilai yang sah.`,
  ip: (field) => `${field} harus berupa alamat ip yang sah.`,
  max: (field, [length]) => `${field} tidak boleh lebih dari ${length} karakter.`,
  max_value: (field, [size]) => `Nilai ${field} tidak boleh lebih dari ${size}.`,
  mimes: (field) => `Tipe berkas ${field} harus benar.`,
  min: (field, [length]) => `${field} minimal mengandung ${length} karakter.`,
  min_value: (field, [size]) => `Nilai ${field} tidak boleh kurang dari ${size}.`,
  not_in: (field) => `${field} harus berupa nilai yang sah.`,
  numeric: (field) => `${field} harus berupa angka.`,
  regex: (field) => `Format ${field} salah.`,
  required: (field) => `${field} harus diisi.`,
  size: (field, [size]) => `${field} harus lebih kecil dari ${size} KB.`,
  url: (field) => `${field} harus berupa tautan yang benar.`
};

const locale = {
  name: 'id',
  messages,
  attributes: {}
};

if (typeof VeeValidate !== 'undefined' && VeeValidate && typeof VeeValidate.Validator) {
  VeeValidate.Validator.addLocale(locale);
}

export default locale;
