export default {
  file: (name, type, size = 1) => ({
    name,
    type,
    size: size * 1024
  })
};
