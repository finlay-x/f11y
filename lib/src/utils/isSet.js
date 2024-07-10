/**
 * Checks if something is set aka not null or undefined
 * @param {*} thing What do you want to check exists?
 * @returns {boolean}
 */
function isSet(thing) {
    return typeof thing !== 'undefined' && thing !== null;
}

export default isSet