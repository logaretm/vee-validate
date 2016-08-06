export default (files, mimes) => {
    const regex = new RegExp(`${mimes.join('|').replace('*', '.+')}$`, 'i');
    for (let i = 0; i < files.length; i++) {
        if (! files[i].type.match(regex)) {
            return false;
        }
    }

    return true;
};
