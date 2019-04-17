const validate = (files, extensions) => {
  const regex = new RegExp(`.(${extensions.join('|')})$`, 'i');

  return (Array.isArray(files) ? files : [files]).every(file => regex.test(file.name));
};

export {
  validate
};

export default {
  validate
};
