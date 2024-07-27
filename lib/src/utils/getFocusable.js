import isFocusable from './isFocusable';

/**
 * Gets Focusable elements within an element
 * @param {HTMLElement} element Check within this element
 * @param {Array.<string>} focusableSelectors 
 * @returns {Node[]}
 */
// @ts-ignore
function getFocusable(element, focusableSelectors = window.f11y.focusableElements){
    /**
     * 
     * @param {HTMLElement} node 
     * @returns 
     */
    function filter(node) {
        if (node.hasAttribute('disabled') || node.hasAttribute('hidden') || node.hasAttribute('aria-hidden') || getComputedStyle(node).display === 'none') {
            return NodeFilter.FILTER_REJECT;
        }

        if (isFocusable(node, focusableSelectors) === true) {
            return NodeFilter.FILTER_ACCEPT;
        }

        return NodeFilter.FILTER_SKIP;
    }

    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_ELEMENT,
        { acceptNode: filter }
    );

    let list = [];

    while (walker.nextNode()) {
        list.push(walker.currentNode);
    }

    return list
}

export default getFocusable