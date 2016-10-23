import { unregister } from './utils/maps';

export default (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag,
            [options.fieldsBagName]: this.$validator.fieldBag
        };
    },
    ready() {
        this.$nextTick(() => { this.$emit('validatorReady'); });
    },
    destroyed() {
        unregister(this);
    }
});
