// f11y Global
    /**
     * @typedef {Window & f11yClass} CustomWindow
     */

    /**
     * @typedef {Object} f11yClass
     * @property {f11yComponents} components -
     * @property {Array.<string>} focusableElements - 
     * @property {f11ySettings} settings - 
     * @property {f11yStore} store - 
     * @property {f11yUtils} utils - 
     */

    /**
     * @typedef {Object} f11yComponents
     * @property {Function} Accordion - For accordion, details/summary, disclosure & collapsible components
     * @property {Function} Dropdown - For dropdown menu, combobox, popovers, and disclosure components
     * @property {Function} Layer - For modal, sheet, popovers, and dialog components
     * @property {Function} TabList - For tabbed interface (vertical & horizontal) components
     * @property {Function} Table - For ARIA defined responsive table components
     * @property {Function} Tooltip - 
     * @property {Function} [Context] - 
     * @property {Function} [datePicker] -
     * @property {Function} [Range] -
     * @property {Function} [Resizable] -
     * @property {Function} [Toast] -
     */


    /**
     * @typedef {Object} f11ySettings
     * @property {string} initialisedClass - Class added to any component when their init method is called
     * @property {string} openClass - Class added once component is opened
     * @property {string} animatingClass - Class added while component animation is occuring
     * @property {string} animatingOpenClass - Class added while component is animating opening
     * @property {string} animatingCloseClass - Class added while component is animating closing
     * @property {boolean} awaitOpenAnimation - Should the component await CSS animation before opening
     * @property {boolean} awaitCloseAnimation - Should the component await CSS animation before closing
     */

    /**
     * @typedef {Object} f11yStore
     * @property {Array.<string>} activeLayers - Array of id values that match the layers that are currently open/active
     * @property {string} activeLayer - id value of the most current actived layer
     */

    /**
     * @typedef {Object} f11yUtils
     * @property {Function} isSet - Checks if something is set aka not null or undefined
     * @property {Function} isFocusable - Gets Focusable elements within an element
     * @property {Function} getFocusable - Checks if passed element is focusable (aka is within focusableElement array)
     */


// Dropdown
    /**
     * @typedef {Object} DropdownDefault
     * @property {Function} onOpen - Function called once dropdown is opened
     * @property {Function} onClose - Function called once dropdown is closed
     * @property {string} openClass - Class added once dropdown is opened
     * @property {Array.<String>} focusableElements - Array of selectors that should be focusable within the layer
     * @property {boolean} updateOnSelect - Should the trigger be updated click of an focusableElement within dropdown
     * @property {string|null} updateSelector - Selector for a custom element to updateOnSelect
     * @property {boolean} focusOnMouseOver - Should the items within the dropdown receive focus on mouseover?
     * @property {boolean} arrowNavigation - Should the dropdown be navigable by up/down arrows
     * @property {boolean} tabNavigation - Should the dropdown be navigable by pressing tab
     * @property {boolean} closeOnBackgroundClick - Should the dropdown close when outside the dropdown is clicked
     * @property {boolean} closeOnSelect - Should the dropdown close when a focusableElement is clicked
     * @property {boolean} awaitOpenAnimation - Should the dropdown await CSS animation before opening
     * @property {boolean} awaitCloseAnimation - Should the dropdown await CSS animation before closing
     */


// Accordion
    /**      
     * Stores all the required information of the individual accordion items.
     * @typedef {Object} AccordionItemObject
     * @property {Element} item - The item element
     * @property {Element} panel - The panel element within the item
     * @property {Element} trigger - The trigger element within the item
     * @property {string} isOpen - Is the item open?
     */

    /**
     * @typedef {Object} AccordionDefault
     * @property {Function} onOpen - Function called once item is opened
     * @property {Function} onClose - Function called once item is closed
     * @property {string} itemSelector - The selector used for finding all accordion items
     * @property {boolean} showMultiple - Should the Accordion allow multiple items open at once
     */


// Layer
    /**
     * @typedef {Object} LayerDefault
     * @property {Function} onOpen - Function called once layer is opened
     * @property {Function} onClose - Function called once layer is closed
     * @property {string} openTriggerAttribute - The attribute used for finding the open triggers
     * @property {string} closeTriggerAttribute - The attribute used for finding the close triggers
     * @property {string} openClass - Class added once layer is opened
     * @property {Array.<string>} focusableElements - Array of selectors that should be focusable within the layer
     * @property {boolean} disableScroll - Should scroll be disabled when layer is opened
     * @property {boolean} closeOnBackgroundClick - Should layer close if click outside dialog
     * @property {boolean} closeOnEscClick - Should layer close if esc key is pressed
     * @property {boolean} awaitOpenAnimation - Should the layer await CSS animation before opening
     * @property {boolean} awaitCloseAnimation - Should the layer await CSS animation before closing
     */


// Table


// TabList
    /**
     * @typedef {Object} TabListDefault
     * @property {Function} onChange - Function called once item is opened
     * @property {string} orientation - Changes whether up/down or left/right arrows are used to navigate
     * @property {boolean} disableActiveTab - Add disabled attribute to active tab trigger?
     * @property {boolean} changeOnNavigation - Should the active tab change on keyboard navigation between tab triggers
     * @property {boolean} moveFocusOnSelect 
     */


// Toast
    /**
     * @typedef {Object} ToastDefault
     * @property {Function} onOpen 
     * @property {Function} onDismiss 
     * @property {Function} onClear
     * @property {string} openClass 
     * @property {string} closeToastAttribute 
     * @property {string} templateElementAttribute
     * @property {boolean} swipeTracking
     * @property {string} swipeDirection
     * @property {number} duration
     * @property {boolean} awaitCloseTransition 
     * @property {boolean} awaitOpenTransition 
     */


// Tooltip
    /**
     * @typedef {Object} TooltipDefault
     * @property {Function} onOpen - Function called once tooltip is opened
     * @property {Function} onClose - Function called once tooltip is opened
     * @property {string} positionAttributeName - Attribute name used to find the tooltip position value
     * @property {string} openClass - Class added once layer is opened
     * @property {number} leewayTiming - In ms, how much time is provided to the user when mouse leaves domNode before tooltip is closed 
     * @property {number} delayTiming - In ms, how much time should pass before the tooltip opens
     * @property {boolean} awaitOpenAnimation - Should the tooltip await CSS animation before opening
     * @property {boolean} awaitCloseAnimation - Should the tooltip await CSS animation before closing
     */