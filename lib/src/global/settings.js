import { f11y } from '../main/f11y';

/**
 * Initialises the global settings object
 * @param {f11yClass} f11yObj The global f11y window object
 */
export const initSettings = (f11yObj = f11y) => {
    /** @type {f11ySettings} */
    f11yObj.settings = {
        initialisedClass: 'has-initialised',
        openClass: 'is-open',
        animatingClass: 'is-animating',
        animatingOpenClass: 'is-opening',
        animatingCloseClass: 'is-closing',
        awaitOpenAnimation: false,
        awaitCloseAnimation: false
    };
};