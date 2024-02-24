/**
 * Checks if something is set aka not null or undefined
 * @param {*} thing What do you want to check exists?
 * @returns {boolean}
 */
export const isSet = (thing) => {
    return typeof thing !== 'undefined' && thing !== null;
}