import { unregister } from './utils/maps';

export default (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag
        };
    },
    ready() {
        this.$nextTick(() => { this.$emit('validatorReady'); });
    },
    destroyed() {
        unregister(this);
    }
});
