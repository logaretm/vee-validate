import { unregister } from './utils/maps';

export default (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag
        };
    },
    destroyed() {
        unregister(this);
    }
});
