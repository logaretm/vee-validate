import Validator from './validator';
import debounce from './utils/debouncer.js';

const DEFAULT_DELAY = 0;

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
            this.fieldName = this.el.name;
            this.attachValidator();

            const delay = this.params.delay || (options && options.delay) || DEFAULT_DELAY;
            this.onInputRef = delay ?
            debounce(this.onInput.bind(this), delay) : this.onInput.bind(this);

            this.el.addEventListener('input', this.onInputRef);
        },
        unbind() {
            this.vm.$validator.detach(this.fieldName);
            this.el.removeEventListener('input', this.onInputRef);
        }
    });
};
