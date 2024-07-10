import isFocusable from './isFocusable';

/**
 * Gets Focusable elements within an element
 * @param {HTMLElement} element Check within this element
 * @returns {Node[]}
 */
function getFocusable(element){
    function filter(node) {
        if (node.hasAttribute('hidden') || node.hasAttribute('aria-hidden') || getComputedStyle(node).display === 'none') {
            return NodeFilter.FILTER_REJECT;
        }

        if (isFocusable(node) === true) {
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