import { f11y } from '../main/f11y';

/**
 * Initialises the global store object
 * @param {f11yClass} f11yObj The global f11y window object
 */
export const initStore = (f11yObj = f11y) => {
    /** @type {f11yStore} */
    f11yObj.store = {
        activeLayers: [],
        activeLayer: ''
    };
};


/**
 * Retrieve the global store object
 * @param {f11yClass} f11yObj The global f11y window object
 * @returns {f11yStore}
 */
export const getStore = (f11yObj = f11y) => ({ ...f11yObj.store });


/**
 * Update the global store object with new values
 * @param {f11yStore} newStore 
 * @param {f11yClass} f11yObj The global f11y window object
 */
export const updateStore = (newStore, f11yObj = f11y) => {
    f11yObj.store = { ...f11yObj.store, ...newStore };
};