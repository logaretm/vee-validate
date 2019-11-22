const validate = (files: File | File[], extensions: string[] | Record<string, any>) => {
  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');
  if (Array.isArray(files)) {
    return files.every(file => regex.test(file.name));
  }

  return regex.test(files.name);
};

export { validate };

export default {
  validate
};
