import { ValidationRuleResult } from "../types";

const validateImage = (file: File, width: number, height: number): Promise<boolean> => {
  const URL = window.URL || (window as any).webkitURL;

  return new Promise(resolve => {
    const image = new Image();
    image.onerror = () => resolve(false);
    image.onload = () => resolve(image.width === Number(width) && image.height === Number(height));

    image.src = URL.createObjectURL(file);
  });
};

const validate = (files: File[], [width, height]: any) => {
  const list = [];
  for (let i = 0; i < files.length; i++) {
    // if file is not an image, reject.
    if (! /\.(jpg|svg|jpeg|png|bmp|gif)$/i.test(files[i].name)) {
      return Promise.resolve(false);
    }

    list.push(files[i]);
  }

  return Promise.all(list.map(file => validateImage(file, width, height))).then(values => {
    return values.every(v => v)
  });
};

export {
  validate
};

export default {
  validate
};
