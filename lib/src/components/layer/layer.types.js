/**
 * @typedef {Object} LayerDefault
 * @property {Function} onBeforeOpen
 * @property {Function} onAfterOpen
 * @property {Function} onBeforeClose
 * @property {Function} onAfterClose
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