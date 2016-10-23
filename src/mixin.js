import { unregister } from './utils/maps';

export default (options) => ({
    data() {
        return {
            [options.errorBagName]: this.$validator.errorBag,
        };
    },
    computed: {
        [options.fieldsBagName]: {
            get() {
                return this.$validator.fieldBag;
            }
        }
    },
    mounted() {
        this.$emit('validatorReady');
    },
    destroyed() {
        unregister(this);
    }
});
