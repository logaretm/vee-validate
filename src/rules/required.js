import { isObject } from '../utils/helpers';

export default (value) => {
    if (Array.isArray(value) || isObject(value)) {
        return !! value.length;
    }

    if (value === undefined || value === null) {
        return false;
    }

    return !! String(value).trim().length;
};
