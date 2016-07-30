import Validator from './validator';
import debounce from './utils/debouncer.js';

const DEFAULT_DELAY = 250;

export default (Vue, options) => {
    // eslint-disable-next-line no-param-reassign
    Vue.prototype.$validator = Validator.create();

    Vue.mixin({
        data() {
            return {
                errors: []
            };
        },
        created() {
            this.$set('errors', this.$validator.errors);
        }
    });

    Vue.directive('validate', {
        params: ['rules', 'delay'],
        onInput() {
            this.vm.$validator.validate(this.fieldName, this.el.value);
        },
        attachValidator() {
            this.vm.$validator.attach(this.fieldName, this.params.rules);
        },
        bind() {
            const delay = options ? (options.delay || DEFAULT_DELAY) : (this.params.delay || DEFAULT_DELAY);
            this.fieldName = this.el.name;
            this.attachValidator();
            this.onInputRef = debounce(this.onInput.bind(this), delay);
            this.el.addEventListener('input', this.onInputRef);
        },
        unbind() {
            this.vm.$validator.detach(this.fieldName);
            this.el.removeEventListener('input', this.onInputRef);
        }
    });
};
