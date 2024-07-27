/**
 * @typedef {Object} DropdownDefault
 * @property {Function} onBeforeOpen - Function called before dropdown is opened
 * @property {Function} onAfterOpen - Function called after dropdown is opened
 * @property {Function} onBeforeClose - Function called before dropdown is closed
 * @property {Function} onAfterClose - Function called after dropdown is closed
 * @property {string} openClass - Class added once dropdown is opened
 * @property {Array.<String>} focusableElements - Array of selectors that should be focusable within the dropdown
 * @property {boolean} updateOnItemClick - updated trigger||updateSelector with item content
 * @property {Array.<String>} updateSelectors - Selectors to be updated on item click
 * @property {boolean} focusOnItemMouseOver - Set focus to dropdown item on mouseover
 * @property {boolean} arrowNavigation - Make dropdown items navigable by arrow keys
 * @property {boolean} tabNavigation - Make dropdown items navigable by tabbing
 * @property {boolean} closeOnLastItemBlur - Close dropdown onBlur of last item 
 * @property {boolean} loopItemFocus - Loop the focus of focusableElements inside the dropdown
 * @property {boolean} closeOnBackgroundClick - Close dropdown when click occurs outside dropdown bounds
 * @property {boolean} closeOnItemClick - Close when a focusable, non text input is clicked
 * @property {boolean} awaitOpenAnimation - Await CSS animation before opening
 * @property {boolean} awaitCloseAnimation - Await CSS animation before closing
 * @property {boolean} openOnTriggerClick - Open Dropdown on trigger click
 * @property {boolean} openOnTriggerHover - Open Dropdown on trigger mouseover
 * @property {boolean} openOnArrowKeydown - Open Dropdown on when up||down arrows are pressed on trigger
 * @property {boolean} setFocusOnOpen - Auto focus into the dropdown
 */


/**
 * @typedef {Object} DropdownEvents
 * @property {CustomEvent} initialised
 * @property {CustomEvent} initialisedItems
 * @property {CustomEvent} destroyed
 * @property {CustomEvent} beforeOpen
 * @property {CustomEvent} afterOpen
 * @property {CustomEvent} beforeClose
 * @property {CustomEvent} afterClose
 */