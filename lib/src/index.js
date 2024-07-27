import './global/f11y.types';

//Import Utils
import isSet from './utils/isSet';
import isFocusable from './utils/isFocusable';
import getFocusable from './utils/getFocusable';
import isPrintableChar from './utils/isPrintableChar';
import nextFocusable from './utils/nextFocusable';
import isInputable from './utils/isInputable';

//Import Components
import Accordion from './components/accordion/accordion';
import './components/accordion/accordion.types';

import Dropdown from './components/dropdown/dropdown';
import './components/dropdown/dropdown.types';

import Layer from './components/layer/layer';
import './components/layer/layer.types';

import TabList from './components/tablist/tablist';
import './components/tablist/tablist.types';

import Tooltip from './components/tooltip/tooltip';
import './components/tooltip/tooltip.types';

import Table from './components/table/table';
import './components/table/table.types';


/**
 * @module f11y
 */

/**
 * Represents the f11y module.
 * @namespace f11y
 */
const createF11y = () => ({
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
    utils: {
        isSet: isSet,
        isFocusable: isFocusable,
        getFocusable: getFocusable,
        isPrintableChar: isPrintableChar,
        nextFocusable: nextFocusable,
        isInputable: isInputable
    },
    events: {
        stateUpdate: new Event('f11ystateupdate'),
        componentClose: new Event('f11ycomponentclose'),
        componentOpen: new Event('f11ycomponentopen'),
        componentInitialised: new Event('f11ycomponentinitialised'),
    }
});

// Create a default instance of f11y
const defaultF11y = createF11y();

/**
 * Initialises the f11y module and attaches it to the window object.
 */
const initialiseF11y = () => {
    if (typeof window !== 'undefined') {
        // @ts-ignore
        window.f11y = defaultF11y;
    }
};

initialiseF11y();

export { createF11y };
export default defaultF11y;