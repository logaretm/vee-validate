import Validator from './validator';

export default (Vue) => {
    Vue.mixin({
        // TODO: Maybe add errors bindable field or property.
    });

    Vue.directive('validate', {
        params: ['rules'],
        onChange() {
            this.vm.$validator.validate(this.fieldName, this.el.value);
        },
        attachValidator() {
            if (! this.vm.$validator) {
                this.vm.$validator = new Validator({
                    [this.fieldName]: this.params.rules
                });

                return;
            }

            this.vm.$validator.attach(this.fieldName, this.params.rules);
        },
        bind() {
            this.fieldName = this.el.name;
            this.attachValidator();
            this.onChangeRef = this.onChange.bind(this);
            this.el.addEventListener('change', this.onChangeRef);
        },
        unbind() {
            this.el.removeEventListener('change', this.onChangeRef);
        }
    });
};
