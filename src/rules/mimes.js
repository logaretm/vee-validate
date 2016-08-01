export default {
    msg(name) {
        return `The ${name} must be a valid file.`;
    },
    validate(files, mimes) {
        const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
        for (let i = 0; i < files.length; i++) {
            if (! files[i].type.match(regex)) {
                return false;
            }
        }

        return true;
    }
};
