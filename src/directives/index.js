import validate from './validate';

export default (Vue, options) => {
  Vue.directive('validate', validate(options));
};
