const imageValidator = (files: unknown) => {
  const regex = /\.(jpg|svg|jpeg|png|bmp|gif|webp)$/i;
  if (!files) {
    return true;
  }

  if (Array.isArray(files)) {
    return files.every(file => regex.test((file as File).name));
  }

  return regex.test((files as File).name);
};

export default imageValidator;
