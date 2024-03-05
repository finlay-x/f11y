import Accordion from './components/accordion';
import Dropdown from './components/dropdown';
import Layer from './components/layer';
import Table from './components/table';
import TabList from './components/tablist';
import Tooltip from './components/tooltip';

/** @type {f11yClass} */
let f11y = {
    Accordion,
    Dropdown,
    Layer,
    Table,
    TabList,
    Tooltip,
    focusableElements: [
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
    }
};

if (typeof window !== 'undefined') {
    window.f11y = f11y;
}

export default f11y;
export { f11y };