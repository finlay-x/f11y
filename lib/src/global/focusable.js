import { f11y } from '../main/init';

/**
 * Initialises the global array of focusable elements
 * @param {f11yClass} f11yObj The global f11y window object
 */
export const initFocusableElements = (f11yObj = f11y) => {
    f11yObj.focusableElements = [
        'a[href]:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        'area[href]:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        'input:not([disabled]):not([type="hidden"]):not([aria-hidden]):not([tabindex^="-"])',
        'select:not([disabled]):not([aria-hidden]):not([tabindex^="-"])',
        'textarea:not([disabled]):not([aria-hidden]):not([tabindex^="-"])',
        'button:not([disabled]):not([aria-hidden]):not([tabindex^="-"])',
        'iframe:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        'object:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        'embed:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        '[contenteditable]:not([disabled]):not([hidden]):not([aria-hidden]):not([tabindex^="-"])',
        '[tabindex]:not([tabindex^="-"])'
    ];
};