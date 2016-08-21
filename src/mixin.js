import { unregister } from './utils/maps';

export default (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag
        };
    },
    ready() {
        this.$emit('validatorReady');
    },
    destroyed() {
        unregister(this);
    }
});
