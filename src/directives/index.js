import validate from './validate';
import scope from './scope';

export default (Vue, options) => {
    Vue.directive('validate', validate(options));
    Vue.directive('scope', scope(options));
};
