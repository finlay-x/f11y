/**      
 * Stores all the required information of the individual accordion items.
 * @typedef {Object} AccordionItemObject
 * @property {Number} id - The index id of the item
 * @property {Element} item - The item element
 * @property {Element} panel - The panel element within the item
 * @property {Element} panelContent - The panel content element within the panel
 * @property {HTMLElement} trigger - The trigger element within the item
 * @property {boolean} isOpen - Is the item open?
 */

/**
 * @typedef {Object} AccordionDefault
 * @property {Function} onBeforeOpen - Function called once item is opened
 * @property {Function} onAfterOpen - Function called once item is opened
 * @property {Function} onBeforeClose - Function called once item is closed
 * @property {Function} onAfterClose - Function called once item is closed
 * @property {string} openClass - Class name added to item when opens
 * @property {string} itemSelector - The selector used for finding all accordion items
 * @property {string} contentSelector - The selector used for finding the content container within the items panel
 * @property {("single"|"multiple")} type - Decides if more than one item can be opened at once
 * @property {("vertical"|"horizontal")} orientation - Should the Accordion allow multiple items open at once
 * @property {boolean} keyboardNavigation - Should the Accordion Triggers be navigable by arrow keys
 * @property {boolean} collapsible - If type === "single", can the open item be collapsed?
 */