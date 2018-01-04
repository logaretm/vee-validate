export default (files) => files.every(file =>
  /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(file.name)
);
