/**
 * Checks if a character is a printable string
 * @param {string} string 
 * @returns {boolean}
 */
function isPrintableChar(string) {
    if(string.length === 1 && string.match(/\S/)) return true;
    return false;
}

export default isPrintableChar