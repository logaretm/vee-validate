const extValidator = (files: unknown, extensions: string[]) => {
  if (!extensions) {
    extensions = [];
  }

  if (!files) {
    return true;
  }

  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test((file as File).name));
  }

  return regex.test((files as File).name);
};

export default extValidator;
