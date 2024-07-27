/**
 * Checks if passed element is focusable (aka is within focusableElement array)
 * @param {HTMLElement} element 
 * @param {Array.<string>} filterSelectors 
 * @returns {boolean}
 */
// @ts-ignore
function isFocusable(element, filterSelectors = window.f11y.focusableElements){
    const focusable = filterSelectors.join(', ');
    return element.matches(focusable);
}

export default isFocusable