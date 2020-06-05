const extValidator = (files: File | File[], extensions: any[]) => {
  if (!extensions) {
    extensions = [];
  }

  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.name));
  }

  return regex.test(files.name);
};

export default extValidator;
