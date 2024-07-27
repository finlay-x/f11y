/**
 * @typedef {Window & f11y} CustomWindow
 *
 * 
 * @typedef {Object} f11y
 * @property {f11yComponents} components -
 * @property {Array.<string>} focusableElements - 
 * @property {f11ySettings} settings - 
 * @property {f11yStore} store - 
 * @property {f11yUtils} utils - 
 * @property {f11yEvents} events - 
 *
 * 
 * @typedef {Object} f11yComponents
 * @property {Function} Accordion - For accordion, details/summary, disclosure & collapsible components
 * @property {Function} Dropdown - For dropdown menu, combobox, popovers, and disclosure components
 * @property {Function} Layer - For modal, sheet, popovers, and dialog components
 * @property {Function} TabList - For tabbed interface (vertical & horizontal) components
 * @property {Function} Table - For ARIA defined responsive table components
 * @property {Function} Tooltip - 
 *
 * 
 * @typedef {Object} f11ySettings
 * @property {string} initialisedClass - Class added to any component when their init method is called
 * @property {string} openClass - Class added once component is opened
 * @property {string} animatingClass - Class added while component animation is occuring
 * @property {string} animatingOpenClass - Class added while component is animating opening
 * @property {string} animatingCloseClass - Class added while component is animating closing
 * @property {boolean} awaitOpenAnimation - Should the component await CSS animation before opening
 * @property {boolean} awaitCloseAnimation - Should the component await CSS animation before closing
 *
 * 
 * @typedef {Object} f11yStore
 * @property {Array.<string>} activeLayers - Array of id values that match the layers that are currently open/active
 * @property {string} activeLayer - id value of the most current actived layer
 *
 * 
 * @typedef {Object} f11yUtils
 * @property {Function} isSet - Checks if something is set aka not null or undefined
 * @property {Function} isFocusable - Gets Focusable elements within an element
 * @property {Function} getFocusable - Checks if passed element is focusable (aka is within focusableElement array)
 * @property {Function} nextFocusable - Retrieves next item to focus on
 *
 * 
 * @typedef {Object} f11yEvents
 */