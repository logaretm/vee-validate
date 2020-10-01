/**
 * Slugifies a given string
 */
export function slugify(str) {
  // eslint-disable-next-line no-useless-escape
  const slug = str.replace(/\s|\.|\?|\!|'/g, '-').toLowerCase();

  return slug;
}
