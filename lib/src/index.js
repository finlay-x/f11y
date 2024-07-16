import './global/typedefs';
import Accordion from './components/accordion';
import Dropdown from './components/dropdown';
import Layer from './components/layer';
import Table from './components/table';
import TabList from './components/tablist';
import Tooltip from './components/tooltip';

import isSet from './utils/isSet';
import isFocusable from './utils/isFocusable';
import getFocusable from './utils/getFocusable';

/**
 * @module f11y
 */

/**
 * A function representing the f11y module.
 * @function
 */
const f11y = () => {
    if (typeof window !== 'undefined') {
        
        /** @type {f11y} */
        let f11y = {
            components: {
                Accordion,
                Dropdown,
                Layer,
                Table,
                TabList,
                Tooltip
            },
            focusableElements: [
                'a[href]:not([disabled]):not([hidden]):not([aria-hidden])',
                'area[href]:not([disabled]):not([hidden]):not([aria-hidden])',
                'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
                'select:not([disabled]):not([aria-hidden])',
                'textarea:not([disabled]):not([aria-hidden])',
                'button:not([disabled]):not([aria-hidden])',
                'iframe:not([disabled]):not([hidden]):not([aria-hidden])',
                'object:not([disabled]):not([hidden]):not([aria-hidden])',
                'embed:not([disabled]):not([hidden]):not([aria-hidden])',
                '[contenteditable]:not([disabled]):not([hidden]):not([aria-hidden])',
                '[tabindex]'
            ],
            settings: {
                initialisedClass: 'has-initialised',
                openClass: 'is-open',
                animatingClass: 'is-animating',
                animatingOpenClass: 'is-opening',
                animatingCloseClass: 'is-closing',
                awaitOpenAnimation: false,
                awaitCloseAnimation: false
            },
            store: {
                activeLayers: [],
                activeLayer: ''
            },
            utils : {
                isSet: isSet,
                isFocusable: isFocusable,
                getFocusable: getFocusable
            },
            events : {
                stateUpdate : new Event('f11ystateupdate')
            }
        }

        return f11y;
    }
}

if (typeof window !== 'undefined') {
    window.f11y = f11y;
}

export default f11y;