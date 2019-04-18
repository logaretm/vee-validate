const validate = (files: File[]) => files.every(file => /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name));

export {
  validate
};

export default {
  validate
};
