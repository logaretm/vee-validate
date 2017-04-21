const messages = {
  after: (field, [target]) => `El campo ${field} debe ser posterior a ${target}.`,
  alpha_dash: (field) => `El campo ${field} solo debe contener letras, números y guiones.`,
  alpha_num: (field) => `El campo ${field} solo debe contener letras y números.`,
  alpha_spaces: (field) => `El campo ${field} solo debe contener letras y espacios.`,
  alpha: (field) => `El campo ${field} solo debe contener letras.`,
  before: (field, [target]) => `El campo ${field} debe ser anterior a ${target}.`,
  between: (field, [min, max]) => `El campo ${field} debe estar entre ${min} y ${max}.`,
  confirmed: (field, [confirmedField]) => `El campo ${field} no coincide con ${confirmedField}.`,
  credit_card: (field, [confirmedField]) => `El campo ${field} es inválido.`,
  date_between: (field, [min, max]) => `El campo ${field} debe estar entre ${min} y ${max}.`,
  date_format: (field, [format]) => `El campo ${field} debe tener formato formato ${format}.`,
  decimal: (field, [decimals] = ['*']) => `El campo ${field} debe ser númerico y contener ${decimals === '*' ? '' : decimals} puntos decimales.`,
  digits: (field, [length]) => `El campo ${field} debe ser númerico y contener exactamente ${length} dígitos.`,
  dimensions: (field, [width, height]) => `El campo ${field} debe ser de ${width} pixeles por ${height} pixeles.`,
  email: (field) => `El campo ${field} debe ser un correo electrónico válido.`,
  ext: (field) => `El campo ${field} debe ser un archivo válido.`,
  image: (field) => `El campo ${field} debe ser una imagen.`,
  in: (field) => `El campo ${field} debe ser un valor válido.`,
  ip: (field) => `El campo ${field} debe ser una dirección ip válida.`,
  max: (field, [length]) => `El campo ${field} no debe ser mayor a ${length} caracteres.`,
  max_value: (field, [length]) => `El campo ${field} debe de ser ${length} o menor.`,
  mimes: (field) => `El campo ${field} debe ser un tipo de archivo válido.`,
  min: (field, [length]) => `El campo ${field} debe tener al menos ${length} caracteres.`,
  min_value: (field, [length]) => `El campo ${field} debe ser ${length} o superior.`,
  not_in: (field) => `El campo ${field} debe ser un valor válido.`,
  numeric: (field) => `El campo ${field} debe contener solo caracteres númericos.`,
  regex: (field) => `El formato del campo ${field} no es válido.`,
  required: (field) => `El campo ${field} es obligatorio.`,
  size: (field, [size]) => `El campo ${field} debe ser menor a ${size} KB.`,
  url: (field) => `El campo ${field} no es una URL válida.`
};

const locale = {
  name: 'es',
  messages,
  attributes: {}
};

if (typeof VeeValidate !== 'undefined' && VeeValidate && typeof VeeValidate.Validator) {
  VeeValidate.Validator.addLocale(locale);
}

export default locale;
