import Validator from './validator';

export default (Vue) => {
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
        params: ['rules'],
        onKeydown() {
            this.vm.$validator.validate(this.fieldName, this.el.value);
        },
        attachValidator() {
            this.vm.$validator.attach(this.fieldName, this.params.rules);
        },
        bind() {
            this.fieldName = this.el.name;
            this.attachValidator();
            this.onKeydownRef = this.onKeydown.bind(this);
            this.el.addEventListener('keydown', this.onKeydownRef);
        },
        unbind() {
            this.vm.$validator.detach(this.fieldName);
            this.el.removeEventListener('keydown', this.onKeydownRef);
        }
    });
};
