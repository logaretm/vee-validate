/**
 * Determines the input field scope.
 */
export const getScope = (el) => {
    return el.dataset.scope || (el.form && el.form.dataset.scope) || undefined;
};
