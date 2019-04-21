import { ensureArray } from '../utils';

const imageRegex = /\.(jpg|svg|jpeg|png|bmp|gif)$/i;

const validateImage = (file, width, height) => {
  const URL = window.URL || window.webkitURL;
  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve({ valid: false });
    image.onload = () => resolve({
      valid: image.width === Number(width) && image.height === Number(height)
    });

    image.src = URL.createObjectURL(file);
  });
};

const validate = (files, [width, height]) => {
  const images = ensureArray(files).filter(file => imageRegex.test(file.name));
  if (images.length === 0) {
    return false;
  }
  return Promise.all(images.map(image => validateImage(image, width, height)));
};

export {
  validate
};

export default {
  validate
};
