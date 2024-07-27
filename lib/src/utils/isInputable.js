/**
 * Inputable elements are elements the user may interact with through printable keyboard characters
 * @param {HTMLElement} element 
 * @returns 
 */
function isInputable(element){
    return element.tagName === "INPUT" || element.tagName === "SELECT" || element.tagName === "TEXTAREA";
}

export default isInputable