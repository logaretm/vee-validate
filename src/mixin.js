import { unregister } from './validator';

const DEFAULT_BAG_NAME = 'errors';

export default (options) => {
    const errorBagName = (options && options.errorBagName) || DEFAULT_BAG_NAME;

    return {
        data() {
            return {
                [errorBagName]: this.$validator.errorBag
            };
        },
        destroyed() {
            unregister(this);
        }
    };
};
