const windows = process.platform === 'win32';

export function slashes(path) {
  return path.replace(/\\/g, '/');
}

export function normalizePath(path) {
  if (!windows) return path;
  const normalized = slashes(path);
  // check for absolute path: C:/...
  return /^\w:\//.test(normalized) ? `file:///${normalized}` : normalized;
}
