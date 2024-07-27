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