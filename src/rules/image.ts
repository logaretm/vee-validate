const validate = (files: File | File[]) => {
  const regex = /\.(jpg|svg|jpeg|png|bmp|gif|webp)$/i;
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.name));
  }

  return regex.test(files.name);
};

export { validate };

export default {
  validate
};
