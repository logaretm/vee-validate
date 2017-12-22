import { formatFileSize, isDefinedGlobally } from './utils';

const messages = {
  _default: (field) => `${field} tidak sah.`,
  after: (field, [target, inclusion]) => `${field} perlulah selepas ${inclusion ? 'atau sama dengan ' : ''}${target}.`,
  alpha_dash: (field) => `${field} boleh mempunyai karakter angka-abjad, sengkang dan garis bawah.`,
  alpha_num: (field) => `${field} hanya boleh mempunyai karakter angka-abjad.`,
  alpha_spaces: (field) => `${field} hanya boleh mempunyai karakter abjad termasuklah aksara ruang.`,
  alpha: (field) => `${field} hanya boleh mempunyai karakter abjad sahaja.`,
  before: (field, [target, inclusion]) => `${field} perlulah sebelum ${inclusion ? 'atau sama dengan ' : ''}${target}.`,
  between: (field, [min, max]) => `${field} perlulah di antara ${min} dan ${max}.`,
  confirmed: (field) => `${field} pengesahan tidak sepadan.`,
  credit_card: (field) => `${field} tidak sah.`,
  date_between: (field, [min, max]) => `${field} perlulah di antara ${min} dan ${max}.`,
  date_format: (field, [format]) => `${field} perlulah dalam format ${format}.`,
  decimal: (field, [decimals = '*'] = []) => `${field} perlulah dalam bentuk angka dan boleh mempunyai ${!decimals || decimals === '*' ? '' : decimals} titik perpuluhan.`,
  digits: (field, [length]) => `${field} perlulah dalam bentuk angka dan mempunyai ${length} digit.`,
  dimensions: (field, [width, height]) => `${field} perlulah berdimensi ${width} pixel darab ${height} pixels.`,
  email: (field) => `${field} perlulah dalam format emel yang sah.`,
  ext: (field) => `${field} perlulah dalam format fail yang sah.`,
  image: (field) => `${field} perlulah dalam bentuk imej.`,
  in: (field) => `${field} perlulah dalam nilai yang sah.`,
  integer: (field) => `${field} perlulah dalam bentuk integer.`,
  ip: (field) => `${field} perlulah dalam format alamat ip yang sah.`,
  length: (field, [length, max]) => {
    if (max) {
      return `Panjang ${field} perlulah bernilai di antara ${length} dan ${max}.`;
    }

    return `Panjang ${field} perlulah bernilai ${length}.`;
  },
  max: (field, [length]) => `${field} perlulah tidak melebihi ${length} karakter.`,
  max_value: (field, [max]) => `${field} perlulah bernilai ${max} atau kurang.`,
  mimes: (field) => `${field} perlulah mempunyai jenis fail yang sah.`,
  min: (field, [length]) => `${field} perlulah sekurang-kurangnya mempunyai ${length} karakter.`,
  min_value: (field, [min]) => `${field} perlulah bernilai ${min} atau lebih.`,
  not_in: (field) => `${field} perlulah sah.`,
  numeric: (field) => `${field} perlulah mempunyai hanya karakter angka sahaja.`,
  regex: (field) => `Format ${field} tidak sah.`,
  required: (field) => `${field} adalah wajib.`,
  size: (field, [size]) => `Saiz ${field} perlulah kurang daripada ${formatFileSize(size)}.`,
  url: (field) => `${field} bukan URL yang sah.`
};

const locale = {
  name: 'ms_MY',
  messages,
  attributes: {}
};

if (isDefinedGlobally()) {
  // eslint-disable-next-line
  VeeValidate.Validator.localize({ [locale.name]: locale });
}

export default locale;
