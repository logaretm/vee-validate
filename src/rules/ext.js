const validate = (files, extensions) => {
  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');

  return files.every(file => regex.test(file.name));
};

export {
  validate
};

export default {
  validate
};
