/**
 * Formats file size.
 */
export const formatFileSize = (size: number | string): string => {
  const units = ['Byte', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const threshold = 1024;
  size = Number(size) * threshold;
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(threshold));

  return `${(size / Math.pow(threshold, i)).toFixed(2)} ${units[i]}`;
};


/**
 * Checks if vee-validate is defined globally.
 */
export const isDefinedGlobally = () => {
  return typeof (window as any).VeeValidate !== 'undefined';
};
