let f11y = f11y || {};

/**
 * @property {Array.<string>} f11y.focusableElements - An array of selectors that defines the focusable elements within components
 */
f11y.focusableElements = [
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
];

/**      
 * Stores all the required information of the individual accordion items.
 * @typedef {Object} f11ySettings
 * @property {string} animatingClass - Global animating class
 * @property {string} animatingOpenClass - Global opening animation class
 * @property {string} animatingCloseClass - Global closing animation class
 * @property {string} awaitOpenAnimation - Should components globally await opening CSS animations
 * @property {string} awaitCloseAnimation - Should components globally await closing CSS animations
 * @property {string} openClass - Global open class
 */
/** @type {f11ySettings} */
f11y.globalSettings = {
    animatingClass: 'is-animating',
    animatingOpenClass: 'is-opening',
    animatingCloseClass: 'is-closing',
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    openClass: 'is-open',
}

/**      
 * Stores any required global information of components.
 * @typedef {Object} f11yStore
 * @property {Array.<string>} activeLayers - All currently active layers on the page
 * @property {string} activeLayer - the currently active layer
 */
/** @type {f11yStore} */
f11y.store = {
    activeLayers: [],
    activeLayer: ''
}

f11y.functions = f11y.functions || {};

f11y.functions.isset = function isset(node){
    return typeof node !== 'undefined' && node !== null;
}

/**
 * Description: For accordion, details/summary, disclosure & collapsible components
 *
 * @class Accordion
 */
f11y.Accordion = class Accordion {
    /**      
     * Stores all the required information of the individual accordion items.
     * @typedef {Object} AccordionItemObject
     * @property {number} index - The index of the item in the accordion group, beginning at 0
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

    /**
     * @param {HTMLElement | Element} domNode - The DOM element to initialise on
     * @param {Object} opts - Optional params to modify functionality
     */
    constructor(domNode, opts) {
        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            itemSelector: '[f11y-accordion-item]',
            showMultiple: true,
        };

        /** @type {AccordionDefault} Stores all configuration options */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element} The passed domNode */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        /** @type {Array.<AccordionItemObject>} */
        this.items = [];

        this.toggleBound = this.toggle.bind(this);
        this.toggleHandlers = [];

        const items = Array.from(this.domNode.querySelectorAll(this.options.itemSelector));
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const trigger = items[i].querySelector("[aria-controls]");

            if(f11y.functions.isset(trigger) === false){
                console.warn('Trigger is not defined in' + items[i]);
                continue;
            }
        
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));

            if(f11y.functions.isset(panel) === false){
                console.warn('Panel is not defined in' + items[i]);
                continue;
            }
            
            const itemArr = this.initItem(item, trigger, panel, i);

            const toggleHandler = (event) => this.toggle(itemArr, event);
            trigger.addEventListener("click", toggleHandler);

            this.toggleHandlers.push(toggleHandler);
        }
        
        this.domNode.classList.add('f11y-initialised');
    }

    /**
     * 
     * @param {Element} item 
     * @param {Element} trigger 
     * @param {Element} panel 
     * @param {index} i 
     * @returns 
     */
    initItem(item, trigger, panel, i){
        /** @type {AccordionItemObject} Stores item information */
        const itemArr = {
            index: i,
            item: item,
            panel: panel,
            trigger: trigger,
            isOpen: trigger.getAttribute("aria-expanded"),
        };

        itemArr.isOpen === "true" ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
        this.items.push(itemArr);

        return itemArr;
    }

    /**
     * Removes event listeners, clears member arrays and resets DOM changes e.g. class names
     */
    destroy(){
        for (let i = 0; i < this.toggleHandlers.length; i++) {
            const trigger = this.items[i].trigger;
            const toggleHandler = this.toggleHandlers[i];
            trigger.removeEventListener("click", toggleHandler);
        }
        this.items = [];
        this.toggleHandlers = [];
        this.domNode.classList.remove('f11y-initialised');
    }

    /**
     * Toggles passed accordion item.
     * @param  {AccordionItemObject} item Object that represents a singular accordion item.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    toggle(item, event = null) {
        if (this.options.showMultiple === false) this.closeAll(event);

        if (item.isOpen === "false") {
            this.openItem(item, event);
            return;
        }

        if (item.isOpen === "true") {
            this.closeItem(item, event);
            return;
        }
    }

    /**
     * Closes all accordion items.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    closeAll(event = null) {
        for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].isOpen == "true") {
                this.closeItem(this.items[i], event);
            }
        }
    }

    /**
     * Opens all accordion items.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    openAll(event = null) {
        if (this.options.showMultiple === false) return;

        for (let i = 0; i < this.items.length; i += 1) {
            this.openItem(this.items[i], event);
        }
    }

    /**
     * Opens the passed accordion item.
     * @param  {AccordionItemObject} item Object that represents a singular accordion item.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    openItem(item, event = null) {
        if(item.isOpen === "true") return;

        item.panel.removeAttribute("hidden");
        item.trigger.setAttribute("aria-expanded", "true");
        item.isOpen = "true";

        this.options.onOpen(item, this, event);
    }

    /**
     * Closes the passed accordion item.
     * @param  {AccordionItemObject} item Object that represents a singular accordion item.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    closeItem(item, event = null) {
        if(item.isOpen === "false") return;

        item.panel.setAttribute("hidden", "");
        item.trigger.setAttribute("aria-expanded", "false");
        item.isOpen = "false";

        this.options.onClose(item, this, event);
    }
}

/**
 * Description: For dropdown menu, combobox, popovers, and disclosure components
 *
 * @class Dropdown
 */
f11y.Dropdown = class Dropdown {
    /**
     * @typedef {Object} DropdownDefault
     * @property {Function} onOpen - Function called once dropdown is opened
     * @property {Function} onClose - Function called once dropdown is closed
     * @property {string} openClass - Class added once dropdown is opened
     * @property {string} triggerSelector - The selector used for finding the dropdown trigger
     * @property {boolean} updateOnSelect - Should the trigger be updated click of an focusableElement within dropdown
     * @property {string} updateSelector - Selector for a custom element to updateOnSelect
     * @property {boolean} closeOnBackgroundClick - 
     * @property {boolean} closeOnSelect - Should the dropdown close when a focusableElement is clicked
     * @property {boolean} awaitOpenAnimation - Should the dropdown await CSS animation before closing
     * @property {boolean} awaitCloseAnimation - Should the dropdown await CSS animation before closing
     */

    /**
     * @param  {HTMLElement | Element} domNode The DOM element to initialise on
     * @param  {Object} opts Optional params to modify functionality
     */
    constructor(domNode, opts) {
        const DEFAULTS = {
            onOpen: () => {},
            onClose: () => {},
            openClass: f11y.globalSettings.openClass,
            triggerSelector: '[aria-controls]',
            updateOnSelect: false,
            updateSelector: null,
            closeOnBackgroundClick: true,
            closeOnSelect: false,
            arrowNavigation: true,
            tabNavigation: false,
            awaitOpenAnimation: false,
            awaitCloseAnimation: false
        }

        /** @type {DropdownDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        /** @type {Array.<Element|HTMLElement>} */
        this.dropdownItems = [];

        /** @type {Array.<String>} */
        this.firstChars = [];

        /** @type {Element} */
        this.triggerElm = this.domNode.querySelector(this.options.triggerSelector);

        if(f11y.functions.isset(this.triggerElm) === false){
            console.warn('Trigger element does not exist');
            return;
        }

        /** @type {Element} */
        this.dropdownElm = document.getElementById(this.triggerElm.getAttribute('aria-controls'));

        if(f11y.functions.isset(this.dropdownElm) === false){
            console.warn('Dropdown element does not exist');
            return;
        }

        this.triggerElm.addEventListener( 'keydown', this.#onTriggerKeydown.bind(this) );
        this.triggerElm.addEventListener( 'click', this.#onTriggerClick.bind(this) );

        this.options.updateSelector ? this.options.updateSelector : this.options.triggerSelector;
        /** @type {Element} */
        this.updateTargetNode = document.querySelector(this.options.updateSelector);

        const items = Array.from(this.dropdownElm.querySelectorAll(f11y.focusableElements));
        for (let i = 0; i < items.length; i++) {
            this.dropdownItems.push(items[i]);
            items[i].tabIndex = -1;
            this.firstChars.push(items[i].textContent.trim()[0].toLowerCase());

            items[i].addEventListener( 'keydown', this.#onItemKeydown.bind(this) );
            items[i].addEventListener( 'mouseover', this.#onItemMouseover.bind(this) );

            if (this.options.updateOnSelect === true) {
                items[i].addEventListener( 'click', this.#onItemClick.bind(this) );
            }

            if (!this.firstItem) this.firstItem = items[i];

            this.lastItem = items[i];
        }

        this.domNode.addEventListener( 'focusin', this.#onFocusin.bind(this) );
        this.domNode.addEventListener( 'focusout', this.#onFocusout.bind(this) );

        window.addEventListener('mousedown', this.#onBackgroundMousedown.bind(this), true);
        window.addEventListener('resize', this.checkBoundingBox.bind(this));
        document.addEventListener('scroll', this.checkBoundingBox.bind(this));

        this.domNode.classList.add('f11y-initialised');
    }


    destroy(){

    }

    /**
     * Checks whether the dropdown is open
     * @returns  {boolean}
     */
    isOpen() {
        return this.triggerElm.getAttribute('aria-expanded') === "true";
    }

    /**
     * Sets focus to a menu item.
     * @param  {HTMLElement} targetItem New target menu item
     */
    setFocusToItem(targetItem) {
        this.dropdownItems.forEach(function (item) {
            if (item === targetItem) {
                item.tabIndex = 0;
                targetItem.focus();
            } else {
                item.tabIndex = -1;
            }
        })
    }

    /**
     * Sets focus to the first item in the dropdown menu
     */
    setFocusToFirstItem() {
        this.setFocusToItem(this.firstItem);
    }

    /**
     * Sets focus to the last item in the dropdown menu
     */
    setFocusToLastItem() {
        this.setFocusToItem(this.lastItem);
    }

    /**
     * Sets focus to the previous menu item
     * @param    {HTMLElement | Element} currentItem The currently focused item within the dropdown menu
     * @returns  {HTMLElement | Element} The newly focused item within the dropdown menu
     */
    #setFocusToPreviousItem(currentItem) {
        let newItem, index;

        if (currentItem === this.firstItem) {
            newItem = this.lastItem;
        } else {
            index = this.dropdownItems.indexOf(currentItem);
            newItem = this.dropdownItems[index - 1];
        }

        this.setFocusToItem(newItem);

        return newItem;
    }

    /**
     * Sets focus to the next menu item
     * @param    {HTMLElement | Element} currentItem Currently focused item within the dropdown menu
     * @returns  {HTMLElement | Element} The newly focused item within the dropdown menu
     */
    #setFocusToNextItem(currentItem) {
        let newItem, index;

        if (currentItem === this.lastItem) {
            newItem = this.firstItem;
        } else {
            index = this.dropdownItems.indexOf(currentItem);
            newItem = this.dropdownItems[index + 1];
        }
        this.setFocusToItem(newItem);

        return newItem;
    }

    /**
     * Sets focus by the the first character of a menu item
     * @param  {HTMLElement | Element} currentItem Currently focused item within the dropdown menu
     * @param  {string} char The character to base the focus on
     */
    #setFocusByFirstChar(currentItem, char) {
        if (char.length > 1) return;

        let start, index;

        char = char.toLowerCase();

        start = this.dropdownItems.indexOf(currentItem) + 1;

        if (start >= this.dropdownItems.length) start = 0;

        index = this.firstChars.indexOf(char, start);

        if (index === -1) index = this.firstChars.indexOf(char, 0);

        if (index > -1) this.setFocusToItem(this.dropdownItems[index]);
    }

    /**
     * Opens the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    openDropdown(e = null) {
        const domNode = this.domNode;
        const dropdownElm = this.dropdownElm;
        const triggerElm = this.triggerElm;
        const openClass = this.options.openClass;
        const animatingClass = f11y.globalSettings.animatingClass;
        const animatingOpenClass = f11y.globalSettings.animatingOpenClass;

        triggerElm.setAttribute('aria-expanded', 'true');
        dropdownElm.setAttribute('aria-hidden', 'false');
        domNode.classList.add(openClass);

        if (this.options.awaitOpenAnimation) {
            domNode.addEventListener('animationend', handler );
            domNode.classList.add(animatingClass, animatingOpenClass);

            function handler() {
                domNode.classList.remove(animatingClass, animatingOpenClass);

                domNode.removeEventListener(
                    'animationend', 
                    handler
                );
            }
        }

        this.options.onOpen(this, e);
    }

    /**
     * Closes the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    closeDropdown(e = null) {
        if (this.isOpen()) {
            const domNode = this.domNode;
            const dropdownElm = this.dropdownElm;
            const triggerElm = this.triggerElm;
            const openClass = this.options.openClass;
            const animatingClass = f11y.globalSettings.animatingClass;
            const animatingCloseClass = f11y.globalSettings.animatingCloseClass;

            dropdownElm.setAttribute('aria-hidden', 'true');

            if (this.options.awaitCloseAnimation) {
                domNode.addEventListener( 'animationend', handler );
                domNode.classList.add(animatingCloseClass, animatingCloseClass);

                function handler() {
                    domNode.classList.remove(animatingClass, animatingCloseClass);
                    domNode.classList.remove(openClass);

                    domNode.removeEventListener(
                        'animationend', 
                        handler
                    );
                }
            } else{
                domNode.classList.remove(openClass);
            }

            triggerElm.removeAttribute('aria-expanded');
            this.options.onClose(this, e);
        }

        this.resetBoundingBox();
    }

    /**
     * Handles focus of Dropdown
     */
    #onFocusin() {
        this.domNode.classList.add('has-focus');
    }

    /**
     * Handles lose of focus on Dropdown
     */
    #onFocusout() {
        this.domNode.classList.remove('has-focus');
    }

    /**
     * Handles all Trigger toggle keyboard events
     * @param  {Event|KeyboardEvent|null} event The event that triggered this method
     */
    #onTriggerKeydown(event = null) {
        const key = event.key;
        let flag = false;

        switch (key) {
            case ' ':
            case 'Enter':
            case 'ArrowDown':
            case 'Down':
                this.openDropdown(event);
                this.checkBoundingBox();
                this.setFocusToFirstItem();
                flag = true;
                break;

            case 'Esc':
            case 'Escape':
                if(this.isOpen()){
                    this.closeDropdown(event);
                    this.triggerElm.focus();
                    flag = true;
                }else{
                    flag = false;
                }
                break;

            case 'Up':
            case 'ArrowUp':
                this.openDropdown(event);
                this.checkBoundingBox();
                this.setFocusToLastItem();
                flag = true;
                break;

            case 'Tab':
                if(this.isOpen()){
                    this.closeDropdown(event);
                }
                flag = false;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Handles Trigger toggle click event
     * @param  {Event|KeyboardEvent|null} event The event that triggered this method
     */
    #onTriggerClick(event = null) {
        if (this.isOpen()) {
            this.closeDropdown(event);
            this.triggerElm.focus();
        } else {
            this.openDropdown(event);
            this.checkBoundingBox();
            this.setFocusToFirstItem();
        }

        event.stopPropagation();
        event.preventDefault();
    }

    /**
     * Handles all keyboard events on the menu items
     * @param  {KeyboardEvent|null} e The event that triggered this method
     */
    #onItemKeydown(e = null) {
        const tgt = e.currentTarget;
        const key = e.key;
        let flag = false;

        function isPrintableChar(str) {
            return str.length === 1 && str.match(/\S/);
        }

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.shiftKey) {
            if (isPrintableChar(key)) {
                this.#setFocusByFirstChar(tgt, key);
                flag = true;
            }

            if (e.key === 'Tab') {
                if(this.options.tabNavigation){
                    this.#setFocusToPreviousItem(tgt);
                } else {
                    this.triggerElm.focus();
                    this.closeDropdown(e);
                }
                flag = true;
            }
        } else {
            switch (key) {
                case ' ':
                    window.location.href = tgt.href;
                    break;

                case 'Esc':
                case 'Escape':
                    this.closeDropdown(e);
                    this.triggerElm.focus();
                    flag = true;
                    break;

                case 'Up':
                case 'ArrowUp':
                    if(this.options.arrowNavigation) this.#setFocusToPreviousItem(tgt);
                    flag = true;
                    break;

                case 'ArrowDown':
                case 'Down':
                    if(this.options.arrowNavigation) this.#setFocusToNextItem(tgt);
                    flag = true;
                    break;

                case 'Home':
                case 'PageUp':
                    this.setFocusToFirstItem();
                    flag = true;
                    break;

                case 'End':
                case 'PageDown':
                    this.setFocusToLastItem();
                    flag = true;
                    break;

                case 'Tab':
                    if(this.options.tabNavigation){
                        this.#setFocusToNextItem(tgt);
                    } else {
                        this.closeDropdown(e);
                        this.triggerElm.focus();
                    }
                    flag = true;
                    break;
                
                case 'Enter':
                    this.#onItemClick(e);
                    break;

                default:
                    if (isPrintableChar(key)) {
                        this.#setFocusByFirstChar(tgt, key);
                        flag = true;
                    }
                    break;
            }
        }
        if (flag) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /**
     * Handles hover event for menu items
     * @param  {Event|KeyboardEvent} e The event that triggered this method
     */
    #onItemMouseover(e) {
        const tgt = e.currentTarget;
        tgt.focus();
    }

    /**
     * Handles click events on menu items
     * @param  {Event|KeyboardEvent} e The event that triggered this method
     */
    #onItemClick(e) {
        if (this.options.updateOnSelect === true) {
            const itemTextContent = e.currentTarget.textContent;
            this.updateTargetNode.textContent = itemTextContent;
            this.updateTargetNode.value = itemTextContent;
        }
        if(this.options.closeOnSelect === true) {
            this.closeDropdown(e);
        }
    }

    /**
     * Checks the bounding box of the dropdown element against the window bounds
     */
    checkBoundingBox() {
        let dropdownBounds = this.dropdownElm.getBoundingClientRect();

        if (dropdownBounds.bottom > window.innerHeight) {
            this.domNode.classList.add('out-of-bounds--bottom');
            this.domNode.classList.remove('out-of-bounds--top');
            return;
        }
    
        if (dropdownBounds.top < 0) {
            this.domNode.classList.add('out-of-bounds--top');
            this.domNode.classList.remove('out-of-bounds--bottom');
            return;
        }
    }

    /**
     * Resets any class name changes by checkBoundingBox()
     */
    resetBoundingBox() {
        this.domNode.classList.remove('out-of-bounds--top', 'out-of-bounds--bottom');
    }

    /**
     * Handles click events that are outside of the dropdown remit
     * @param  {Object} e The event that triggered this method
     */
    #onBackgroundMousedown(e) {
        if (!this.domNode.contains(e.target) && this.options.closeOnBackgroundClick) {
            if (this.isOpen()) {
                this.closeDropdown(e);
                this.triggerElm.focus();
            }
        }
    }
}

/**
 * Description: For modal, sheet, popovers, and dialog components
 *
 * @class Layer
 */
f11y.Layer = class Layer {
    /**
     * @param {HTMLElement | Element} domNode 
     * @param {Object} opts 
     */
    constructor (domNode, opts) {
        /**
         * @typedef {Object} LayerDefault
         * @property {Function} onOpen - Function called once layer is opened
         * @property {Function} onClose - Function called once layer is closed
         * @property {string} openTriggerAttribute - The attribute used for finding the open triggers
         * @property {string} closeTriggerAttribute - The attribute used for finding the close triggers
         * @property {string} openClass - Class added once layer is opened
         * @property {boolean} disableScroll - Should scroll be disabled when layer is opened
         * @property {boolean} trapFocus - Should layer trap focus
         * @property {boolean} closeOnBackgroundClick - Should layer close if click outside dialog
         * @property {boolean} awaitOpenAnimation - Should the layer await CSS animation before opening
         * @property {boolean} awaitCloseAnimation - Should the layer await CSS animation before closing
         */

        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            openTriggerAttribute: 'f11y-layer-open',
            closeTriggerAttribute: 'f11y-layer-close',
            openClass: f11y.globalSettings.openClass,
            disableScroll: true,
            closeOnBackgroundClick: false,
            awaitCloseAnimation: false,
            awaitOpenAnimation: false,
        }

        /** @type {LayerDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        /** @type {string} */
        this.id = '';

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        this.id = this.domNode.id;
        this.dialog = this.domNode.querySelector('[role="dialog"]');
        this.triggerElms = document.querySelectorAll('[' + this.options.openTriggerAttribute + '="' + this.id + '"]');
        this.closeElms = document.querySelectorAll('[' + this.options.closeTriggerAttribute + '="' + this.id + '"]');
        this.focusableElms = Array.from(this.domNode.querySelectorAll(f11y.focusableElements));
        if(f11y.functions.isset(this.dialog) === false){
            console.warn('Dialog element is not defined in passsed domNode');
            return;
        }

        this.filterFocusableElms();

        for (let i = 0; i < this.triggerElms.length; i++) {
            this.triggerElms[i].addEventListener( 'click', this.openLayer.bind(this), true);
        }

        for (let i = 0; i < this.closeElms.length; i++) {
            this.closeElms[i].addEventListener( 'click', this.closeLayer.bind(this), true);
        }

        for (let i = 0; i < this.focusableElms.length; i++) {
            if (!this.firstElm) {
                this.firstElm = this.focusableElms[i];
            }
            this.lastElm = this.focusableElms[i];
        }

        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);
        this.onWindowKeydownBound = this.#onWindowKeydown.bind(this);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh(){
        this.init();
    }

    /**
     * Removes (mutates) any [aria-hidden] elements from this.focusableElms array
     */
    filterFocusableElms(){
        let i = this.focusableElms.length;

        while(i--){
            const elm = this.focusableElms[i];
            const closestHidden = elm.closest('[aria-hidden]');

            if(closestHidden != this.domNode){
                this.focusableElms.splice(i, 1);
            }
        }
    }

    /**
     * Checks whether the layer is open
     * @returns  {boolean}
     */
    isOpen() {
        return this.domNode.getAttribute('aria-hidden') === 'false';
    }

    /**
     * Checks whether the layer is open
     * @param {Element | HTMLElement}  newElm Element Node to move focus to
     */
    setFocusToElm(newElm) {
        newElm.focus();
    }

    /**
     * Sets Focus to the first focusable item inside the layer
     */
    setFocusToFirstElm() {
        this.setFocusToElm(this.firstElm);
    }

    /**
     * Sets Focus to the last focusable item inside the layer
     */
    setFocusToLastElm() {
        this.setFocusToElm(this.lastElm);
    }

    /**
     * Sets Focus to the previous focusable item inside the layer
     * @param {Element | HTMLElement}  currentElm the currently focused element within the layer
     */
    #setFocusToPrevElm(currentElm){
        let newElm;

        if (currentElm === this.firstElm) {
            newElm = this.lastElm;
        } else {
            let i = this.focusableElms.indexOf(currentElm);
            newElm = this.focusableElms[i - 1];
        }

        this.setFocusToElm(newElm);

        return newElm;
    }

    /**
     * Sets Focus to the next focusable item inside the layer
     * @param {Element | HTMLElement}  currentElm the currently focused element within the layer
     */
    #setFocusToNextElm(currentElm) {
        let newElm;

        if (currentElm === this.lastElm) {
            newElm = this.firstElm;
        } else {
            let i = this.focusableElms.indexOf(currentElm);
            newElm = this.focusableElms[i + 1];
        }

        this.setFocusToElm(newElm);

        return newElm;
    }

    /**
     * Opens the layer
     * @param {Event|KeyboardEvent|null}  e The event object that triggered the method
     */
    openLayer (e = null) {
        this.activeElm = document.activeElement;

        const domNode = this.domNode;
        const docBody = document.querySelector('body');
        const openClass = this.options.openClass;
        const animatingClass = f11y.globalSettings.animatingClass;
        const animatingOpenClass = f11y.globalSettings.animatingOpenClass;

        domNode.setAttribute('aria-hidden', 'false');
        domNode.classList.add(openClass);
        domNode.addEventListener('click', this.onLayerClick);

        this.options.disableScroll ? docBody.style.setProperty('overflow', 'hidden') : '';

        if(this.options.awaitOpenAnimation){
            domNode.addEventListener('animationend', handler);
            domNode.classList.add(animatingClass, animatingOpenClass);

            function handler(){
                domNode.classList.remove(animatingClass, animatingOpenClass);
                domNode.removeEventListener('animationend', handler);
            }
        }

        this.setFocusToFirstElm();
        this.addGlobalListeners();
        f11y.store.activeLayer = this.id;
        f11y.store.activeLayers.push(this.id);
        this.options.onOpen(this, e);
    }

    /**
     * Closes the layer
     * @param {Event | KeyboardEvent | null} e The event object that triggered the method
     */
    closeLayer(e = null){
        if(this.isOpen()){
            if(this.id != f11y.store.activeLayer) return;

            const domNode = this.domNode;
            const docBody = document.querySelector('body');
            const openClass = this.options.openClass;
            const animatingClass = f11y.globalSettings.animatingClass;
            const animatingCloseClass = f11y.globalSettings.animatingCloseClass;

            const i = f11y.store.activeLayers.indexOf(this.id);
            f11y.store.activeLayers.splice(i, 1);
            f11y.store.activeLayer = f11y.store.activeLayers[f11y.store.activeLayers.length - 1];

            domNode.setAttribute('aria-hidden', 'true');
            domNode.removeEventListener('click', this.onLayerClick);

            if(this.activeElm && this.activeElm.focus) this.activeElm.focus();

            if(this.options.awaitCloseAnimation){
                domNode.addEventListener('animationend', handler);
                domNode.classList.add(animatingClass, animatingCloseClass);

                function handler() {
                    domNode.classList.remove(animatingClass, animatingCloseClass);
                    domNode.classList.remove(openClass);

                    if(f11y.store.activeLayers <= 0) docBody.style.removeProperty('overflow');
                
                    domNode.removeEventListener('animationend', handler);
                }
            } else {
                domNode.classList.remove(openClass);
                f11y.store.activeLayers <= 0 ? docBody.style.removeProperty('overflow') : '';
            }
        }
        this.removeGlobalListeners();
        this.options.onClose(this, e);
    }

    /**
     * Adds bound method window events 
     */
    addGlobalListeners() {
        window.addEventListener('keydown', this.onWindowKeydownBound);
        if(this.options.closeOnBackgroundClick) window.addEventListener('mousedown', this.onBackgroundMousedownBound);
    }

    /**
     * Removes bound methods window events 
     */
    removeGlobalListeners() {
        window.removeEventListener('keydown', this.onWindowKeydownBound);
        if(this.options.closeOnBackgroundClick) window.removeEventListener('mousedown', this.onBackgroundMousedownBound);
    }

    /**
     * Closes a layer by id attribute
     * @param {string} targetLayer id of the layer to be closed
     */
    closeLayerById (targetLayer) {
        if (this.id === targetLayer){
            this.closeLayer();
        }
    }

    /**
     * Implements window keydown events functionality
     * @param {KeyboardEvent} e The event object that triggered the method
     */
    #onWindowKeydown(e) {
        let flag = false;
        const tgt = e.target || e.currentTarget;

        if (e.shiftKey) {
            if (e.key === 'Tab') {
                this.#setFocusToPrevElm(tgt);
                flag = true;
            }
        }else {
            switch(e.key) {
                case 'Escape':
                case 'Esc':
                    this.closeLayer(e);
                    flag = true;
                    break;
                case 'Tab':
                    this.#setFocusToNextElm(tgt);
                    flag = true;
                    break;

                case 'Home':
                case 'PageUp':
                    this.setFocusToFirstElm();
                    flag = true;
                    break;

                case 'End':
                case 'PageDown':
                    this.setFocusToLastElm();
                    flag = true;
                    break;
                default:
                    break;
            }
        }

        if (flag) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /**
     * Handles click events that are outside of the layer dialog remit
     * @param  {Event} e The event that triggered this method
     */
    #onBackgroundMousedown(e) {
        if (!this.dialog.contains(e.target)) {
            if (this.isOpen()) {
                this.closeLayer(e);
                this.activeElm.focus();
            }
        }
    }
}

/**
 * Description: For ARIA defined responsive table components
 *
 * @class Table
 */
f11y.Table = class Table {
    constructor (domNode) {
        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        this.tableId = this.domNode.getAttribute('id');

        this.tableGroups = Array.from(this.domNode.querySelectorAll('thead, tbody, tfoot'));
        this.tableRows = Array.from(this.domNode.querySelectorAll('tr'));
        this.tableHeaderCells = Array.from(this.domNode.querySelectorAll('th'));
        this.tableDataCells = Array.from(this.domNode.querySelectorAll('td'));

        this.styleElm = document.createElement("style");
        document.head.appendChild(this.styleElm);
        this.stylesheet = this.styleElm.sheet;

        this.insertCellHeaders();
        this.insertTableAria();
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh(){
        this.init();
    }

    /**
     * Inserts Header td values as psuedo ::before content into stylesheet element
     */
    insertCellHeaders(){
        for (let i = 0; i < this.tableHeaderCells.length; i += 1) {
            this.stylesheet.insertRule(
                "#" + this.tableId + " td:nth-child(" + (i + 1) +  ")::before {" +
                    "content:'" + this.tableHeaderCells[i].innerText + "';" + 
                "}",
                this.stylesheet.cssRules.length
            );
        }
    }

    /**
     * Inserts required aria into table for it to still be accessible if display style is change in order to make table repsonsive
     */
    insertTableAria(){
        this.domNode.setAttribute('role','table');

        for (let i = 0; i < this.tableGroups.length; i++) {
            this.tableGroups[i].setAttribute('role','rowgroup');
        }

        for (let i = 0; i < this.tableRows.length; i++) {
            this.tableRows[i].setAttribute('role','row');
        }

        for (let i = 0; i < this.tableHeaderCells.length; i++) {
            this.tableHeaderCells[i].setAttribute('role','columnheader');
        }

        for (let i = 0; i < this.tableDataCells.length; i++) {
            this.tableDataCells[i].setAttribute('role','cell');
        }
    }
}

/**
 * Description: For tabbed interface (vertical & horizontal) components
 *
 * @class TabList
 */
f11y.TabList = class TabList {
    /**
     * @param {HTMLElement | Element} domNode 
     * @param {Object} opts 
     */
    constructor(domNode, opts) {
        /**
         * @typedef {Object} TabListDefault
         * @property {Function} onChange - Function called once item is opened
         * @property {string} orientation - Changes whether up/down or left/right arrows are used to navigate
         * @property {boolean} disableActiveTab - Add disabled attribute to active tab trigger?
         * @property {boolean} changeOnNavigation - Should the active tab change on keyboard navigation between tab triggers 
         */

        const DEFAULTS = {
            onChange: () => { },
            orientation: 'horizontal',
            disableActiveTab: false,
            changeOnNavigation: true
        }

        /** @type {TabListDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    init(){
        this.tabs = Array.from(this.domNode.querySelectorAll('[role=tab]'));
        this.activeTabs = Array.from(this.domNode.querySelectorAll('[role=tab]:not([disabled])'));

        /** @type {Array<HTMLElement>} */
        this.tabpanels = [];

        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];
            const tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

            tab.tabIndex = -1;

            if(!this.selected && tab.getAttribute('aria-selected') === 'true'){
                this.selected = tab;
            }else{
                tab.setAttribute('aria-selected', 'false');
            }

            this.tabpanels.push(tabpanel);

            tab.addEventListener('keydown', this.onKeydown.bind(this));
            tab.addEventListener('click', this.onClick.bind(this));

            if (!this.firstTab) {
                this.firstTab = tab;
            }

            this.lastTab = tab;
        }

        (this.selected) ? this.setSelectedTab(this.selected) : this.setSelectedTab(this.firstTab);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh() {
        this.init();
    }

    /**
     * Handles changing a tab
     * @param {HTMLElement} targetTab 
     * @param {Event | KeyboardEvent} event 
     */
    handleTabChange(targetTab, event) {
        this.setSelectedTab(targetTab);
        this.options.onChange(this, event);
    }

    /**
     * 
     */
    setActiveTabs(){
        this.activeTabs = Array.from(this.domNode.querySelectorAll('[role=tab]:not([disabled])'));
        this.firstActiveTab = null;

        for (let i = 0; i < this.activeTabs.length; i += 1) {
            const tab = this.activeTabs[i];

            if (!this.firstActiveTab) this.firstActiveTab = tab;

            this.lastActiveTab = tab;
        }
        
        this.nextTab = this.getNextTab();
        this.prevTab = this.getPrevTab();
    }

    /**
     * Sets the passed tab and corresponding panel to be selected
     * @param {Element} targetTab 
     */
    setSelectedTab(targetTab){
        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];

            if (targetTab.id === tab.id) {
                this.selected = this.tabs[i];
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                this.tabpanels[i].removeAttribute('hidden');

                if(this.options.disableActiveTab === true){
                    tab.setAttribute('disabled', '');
                    tab.tabIndex = -1;

                }
            }else{
                tab.setAttribute('aria-selected', 'false');
                tab.removeAttribute('disabled');
                tab.tabIndex = -1;
                this.tabpanels[i].setAttribute('hidden', '');
            }
        }

        this.setActiveTabs();
    }

    getNextTab(tab = null){
        let nextTab;
        let tabList;
        const currentTab = tab ?? this.selected;
        

        if(this.options.disableActiveTab){
            tabList = this.activeTabs;
        } else {
            tabList = this.tabs;
        }

        const i = tabList.indexOf(currentTab);

        if(currentTab.id === this.lastActiveTab.id){
            nextTab = this.firstActiveTab;
        }else{
            nextTab = tabList[i + 1];
        }
        return nextTab;
    }

    getPrevTab(tab = null){
        let prevTab;
        let tabList;
        const currentTab = tab ?? this.selected;

        if(this.options.disableActiveTab){
            tabList = this.activeTabs;
        } else {
            tabList = this.tabs;
        }

        const i = tabList.indexOf(currentTab);
        if(currentTab.id === this.firstActiveTab.id){
            prevTab = this.lastActiveTab;
        }else{
            prevTab = tabList[i - 1];
        }
        return prevTab;
    }

    /**
     * Moves focus to passed tab
     * @param {Element} targetTab 
     */
    moveFocusToTab(targetTab) {
        targetTab.focus();
    }

    /**
     * Handles keydown events on tabs
     * @param {KeyboardEvent} event 
     */
    onKeydown(event) {
        const tgt = event.currentTarget;
        const change = this.options.changeOnNavigation;
        const orientation = this.options.orientation;
        let flag = false;

        switch (event.key) {
            case 'ArrowLeft':
                if(orientation === 'horizontal'){
                    if(change){
                        this.handleTabChange(this.prevTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getPrevTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowRight':
                if(orientation === 'horizontal'){
                    if(change){
                        this.handleTabChange(this.nextTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getNextTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowUp':
                if(orientation === 'vertical'){
                    if(change){
                        this.handleTabChange(this.prevTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getPrevTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowDown':
                if(orientation === 'vertical'){
                    if(change){
                        this.handleTabChange(this.nextTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getNextTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'Home':
                if(change){
                    this.handleTabChange(this.firstActiveTab);
                    this.moveFocusToTab(this.selected);
                }else{
                    this.moveFocusToTab(this.firstActiveTab);
                }
                flag = true;
                break;

            case 'End':
                if(change){
                    this.handleTabChange(this.lastActiveTab);
                    this.moveFocusToTab(this.selected);
                }else{
                    this.moveFocusToTab(this.lastActiveTab);
                }
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Handles click events on tabs
     * @param {Event} event 
     */
    onClick(event) {
        this.handleTabChange(event.currentTarget, event);
        this.moveFocusToTab(this.nextTab);
    }
}

/**
 * Description: 
 *
 * @class Tooltip
 */
f11y.Tooltip = class Tooltip {

    /**
     * @param {HTMLElement | Element} domNode 
     * @param {Object} opts 
     */
    constructor(domNode, opts) {
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

        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            positionAttributeName: 'f11y-tooltip-position',
            openClass: f11y.globalSettings.openClass,
            leewayTiming: 750,
            delayTiming: 500,
            awaitCloseAnimation: false,
            awaitOpenAnimation: false 
        }

        /** @type {TooltipDefault} */
        this.options = Object.assign(DEFAULTS, opts);
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        this.leeway = 0;
        this.delay = 0;
        this.trigger = this.domNode.querySelector('[aria-labelledby]');
        this.tooltip = this.domNode.querySelector('[role=tooltip]');
        this.tooltipPos = this.getTooltipPos();
        this.onTooltipKeydownBound = this.#onTooltipKeydown.bind(this);
        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);

        this.domNode.addEventListener('mouseenter', this.openTooltip.bind(this));
        this.trigger.addEventListener('touchstart', this.openTooltip.bind(this));
        this.domNode.addEventListener('focusin', this.onFocusin.bind(this));
        this.trigger.addEventListener('focusin', this.openTooltip.bind(this));

        this.domNode.addEventListener('mouseleave', this.closeTooltip.bind(this));
        this.domNode.addEventListener('touchend', this.closeTooltip.bind(this));
        this.domNode.addEventListener('focusout', this.onFocusout.bind(this));
        this.trigger.addEventListener('focusout', this.closeTooltip.bind(this));

        document.addEventListener('scroll', this.checkBoundingBox.bind(this));
        window.addEventListener('resize', this.checkBoundingBox.bind(this));
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh() {
        this.init();
    }

    /**
     * Checks whether the layer is open
     * @returns  {boolean}
     */
    isOpen() {
        return this.domNode.classList.contains(this.options.openClass) === true;
    }

    /**
     * Opens the tooltip
     */
    openTooltip() {
        const domNode = this.domNode;
        const tooltip = this.tooltip;
        const openClass = this.options.openClass;
        const animatingClass = f11y.globalSettings.animatingClass;
        const animatingOpenClass = f11y.globalSettings.animatingOpenClass;

        if (!this.isOpen() && this.options.awaitOpenAnimation) {
            domNode.addEventListener('animationend', handler );
            domNode.classList.add(animatingClass, animatingOpenClass);

            function handler() {
                domNode.classList.remove(animatingClass, animatingOpenClass);
                domNode.classList.add(openClass);
                tooltip.classList.add(openClass);
                clearTimeout(this.leeway);

                domNode.removeEventListener(
                    'animationend', 
                    handler
                );
            }
        }else{
            domNode.classList.add(openClass);
            tooltip.classList.add(openClass);
            clearTimeout(this.leeway);
        }

        this.checkBoundingBox();
        this.addGlobalListeners();
    }

    /**
     * Closes the tooltip
     */
    closeTooltip() {
        if(this.isOpen()) {
            const domNode = this.domNode;
            const tooltip = this.tooltip;
            const openClass = this.options.openClass;
            const leeway = this.options.leewayTiming;
            const animatingClass = f11y.globalSettings.animatingClass;
            const animatingCloseClass = f11y.globalSettings.animatingCloseClass;

            if (this.options.awaitCloseAnimation) {
                this.leeway = setTimeout(function(){
                    domNode.addEventListener('animationend', handler);
                    domNode.classList.add(animatingClass, animatingCloseClass);

                    function handler() {
                        domNode.classList.remove(animatingClass, animatingCloseClass);
                        domNode.classList.remove(openClass);
                        tooltip.classList.remove(openClass);

                        domNode.removeEventListener(
                            'animationend', 
                            handler
                        );
                    }
                }, leeway);
            } else {
                this.leeway = setTimeout(function(){
                    domNode.classList.remove(openClass);
                    tooltip.classList.remove(openClass);
                }, leeway);
            }
        }
        
        this.resetBoundingBox();
        this.removeGlobalListeners();
    }

    /**
     * Registers global event listeners
     */
    addGlobalListeners() {
        document.addEventListener('keydown', this.onTooltipKeydownBound)
        window.addEventListener('mousedown', this.onBackgroundMousedownBound, true)
    }

    /**
     * Removes global event listeners
     */
    removeGlobalListeners() {
        document.removeEventListener('keydown', this.onTooltipKeydownBound)
        window.removeEventListener('mousedown', this.onBackgroundMousedownBound, true)
    }

    /**
     * Handles the domNode receiving focus
     */
    onFocusin() {
        this.domNode.classList.add('has-focus');
    }

    /**
     * Handles the domNode losing focus
     */
    onFocusout() {
        this.domNode.classList.remove('has-focus');
    }

    /**
     * Handles a keydown event on the tooltip target
     * @param  {KeyboardEvent} e The event object that triggered the method
     */
    #onTooltipKeydown(e) {
        const key = e.key;
        let flag = false;

        switch (key) {
            case 'Escape':
            case 'Esc':
                this.closeTooltip();
                flag = true;
                break;
            default:
                break;
        }

        if (flag) {
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /**
     * Handles a mouse click event outside the domNode
     * @param  {Event} e The event object that triggered the method
     */
    #onBackgroundMousedown(e){
        if (!this.domNode.contains(e.target)) {
            if (this.isOpen()) {
                this.closeTooltip();
            }
        }
    }

    /**
     * Returns the position value from the attribute or a default if one is not set
     * @return  {string} the position value
     */
    getTooltipPos() {
        let setting = 'bottom';
    
        if (this.domNode.getAttribute(this.options.positionAttributeName)) {
          setting = this.domNode.getAttribute(this.options.positionAttributeName);
        }
    
        return setting;
    }

    /** 
     * Checks the bounding box of the tooltip element against the window bounds
     */
    checkBoundingBox() {
        let bounds = this.tooltip.getBoundingClientRect();

        this.checkHorizontalBounding(bounds);
        this.checkVerticalBounding(bounds);
    }

    /**
     * Checks the bounds of the tooltip against the window and sets offset css var
     * @param {DOMRect} bounds the bounding box values of the tooltip
     */
    checkHorizontalBounding(bounds) {
        let windowWidth = window.innerWidth;
        let translateAmount;

        if (bounds.right > windowWidth && bounds.left < 0) {
            console.warn('Tooltip width too wide for the window');
            return;
        }
    
        if (bounds.right > windowWidth) { //move it left
            translateAmount = (windowWidth - Math.round(bounds.right) - (Math.round(bounds.width) / 1.6))
            this.domNode.style.setProperty('--f11y-tooltip-offset', translateAmount);
        }
    
        if (bounds.left < 0 ) { // move it right
            translateAmount = Math.floor(bounds.width / 2);
            this.domNode.style.setProperty('--f11y-tooltip-offset', translateAmount);
        }

        
    }

    /**
     * Checks the bounds of the tooltip against the window and change the position attribute
     * @param {DOMRect} bounds the bounding box values of the tooltip
     */
    checkVerticalBounding(bounds) {
        let windowHeight = window.innerHeight;

        if (bounds.bottom > windowHeight && bounds.top < 0) {
            console.warn('Tooltip height too high for the window');
            return;
        }

        if (bounds.bottom > windowHeight) { // move it up
            this.domNode.setAttribute(this.options.positionAttributeName, 'top');
            return;
        }

        if (bounds.top < 0) { //move it down
            this.domNode.setAttribute(this.options.positionAttributeName, 'bottom');
            return;
        }
    }

    /**
     * Resets any changes made by checkBoundingBox()
     */
    resetBoundingBox() {
        this.domNode.style.removeProperty('--f11y-tooltip-offset');
        this.domNode.setAttribute(this.options.positionAttributeName, this.tooltipPos);
    }
}

/** 
 * For toast components
 * 
 * @class Toast
*/
f11y.Toast = class Toast {

    /**
     * @param {HTMLElement | Element} domNode 
     * @param {HTMLElement | Element} toastTemplate 
     * @param {Object} opts 
     */
    constructor(domNode, toastTemplate, opts) {
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

        const DEFAULTS = {
            onOpen: () => { },
            onDismiss: () => { },
            onClear: () => { },
            openClass: f11y.globalSettings.openClass,
            closeToastAttribute: 'f11y-toast-close',
            templateElementAttribute: 'f11y-toast-message',
            swipeTracking: false,
            swipeDirection: 'down',
            duration: -1,
            awaitCloseTransition: false,
            awaitOpenTransition: false 
        }

        /** @type {ToastDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        /** @type {Element | HTMLElement} */
        this.toastTemplate = toastTemplate;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        this.timer = 0;
        this.activeToasts = [];
        this.onPointerMoveBound = this.onPointerMove.bind(this);
        this.swipeThreshold = 50;
        window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
        this.domNode.addEventListener( 'focusin', this.#onFocusIn.bind(this) );
        this.domNode.addEventListener( 'focusout', this.#onFocusOut.bind(this) );
        //this.domNode.addEventListener('keydown', this.onKeydown.bind(this) );
    }

    refresh() {
        this.init();
    }

    /**
     * Opens the toast
     * @param {string} templateString String that populates the templatable element templateElementAttribute
     * @param {Element | HTMLElement | null} customToastTemplate Custom template element to be used as a custom template for this particular toast
     */
    openToast(templateString, customToastTemplate = null) {
        let toastTemplate = this.toastTemplate;
        if(customToastTemplate != null) toastTemplate = customToastTemplate;
        const builtToast = this.#createToast(toastTemplate, templateString);
        const toast = this.domNode.insertAdjacentElement('afterbegin', builtToast.firstChild);

        toast.addEventListener( 'mouseenter', this.#onHoverIn.bind(this) );
        toast.addEventListener( 'mouseleave', this.#onHoverOut.bind(this) );

        toast.addEventListener('click', (event) => {
            const closeButton = event.target.closest('[f11y-toast-close]');
            if (closeButton) {
                this.dismissToast(toast.id);
            }
        });

        toast.style.setProperty('--f11y-toast-height', toast.offsetHeight);
        toast.style.setProperty('--f11y-toast-before', this.activeToasts.length);

        if(this.options.swipeTracking){
            toast.addEventListener( 'pointerdown', this.onPointerDown.bind(this) );
            toast.addEventListener( 'pointerup', this.onPointerUp.bind(this) );
        }

        const openClass = this.options.openClass;
        if (this.options.awaitOpenTransition) {
            toast.addEventListener('transitionend', handler);
            toast.classList.remove('will-animate');

            function handler() {
                toast.removeEventListener( 'transitionend', handler );
                toast.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);
                toast.classList.add(openClass);
            }
        }

        const toastObj = { id: toast.id, toastElm: toast, height:toast.offsetHeight};
        this.activeToasts.push(toastObj);
        this.updateToasts();
        this.domNode.classList.add('has-toasts');

        this.options.onOpen(toast, this);

        const duration = this.options.duration;

        if(duration === -1) return;

        toastObj.timer = setTimeout(() => {
            this.dismissToast(toast.id);
        }, duration);

        toast.addEventListener('mouseenter', () => {
            clearTimeout(toastObj.timer);
        });

        toast.addEventListener('mouseleave', () => {
            toastObj.timer = setTimeout(() => {
                this.dismissToast(toast.id);
            }, duration);
        });
    }

    /**
     * Dismisses a specified toast
     * @param {string} id The id attribute of the toast to dismiss
     */
    dismissToast(id) {
        const toast = this.domNode.querySelector('[f11y-toast-id="' + id + '"]');
        this.activeToasts = this.activeToasts.filter(obj => obj.id !== id);
        this.updateToasts();
        toast.remove();
        if(!this.activeToasts.length){
            this.domNode.classList.remove('.is-hovered', 'has-toasts');
        }

        this.options.onDismiss(toast, this);
    }

    /**
     * Builds the toast dom element form the passed template element
     * @param {Element | HTMLElement} template Template element to build the toast from
     * @param {string} templateString String that populates the templatable element templateElementAttribute
     * @returns 
     */
    #createToast(template, templateString) {
        const toastInstance = template.content.cloneNode(true);
        const toast = new DocumentFragment();
        const toastContainer = document.createElement('div');
        const array = new Uint32Array(10);
        const toastId = 'toast-' + crypto.getRandomValues(array)[0];

        if(templateString){
            const templatableElm = toastInstance.querySelector('[f11y-toast-message]');
            templatableElm.textContent = templateString;
        }

        if (template.hasAttributes()) {
            for (const attr of template.attributes) {
                if (attr.name !== 'id') {
                    toastContainer.setAttribute(attr.name, attr.value);
                }
            }
        }

        toastContainer.setAttribute("f11y-toast-id", toastId);
        toastContainer.id = toastId;

        if (this.options.awaitOpenTransition) {
            toastContainer.classList.add('will-animate', f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);
        }else{
            toastContainer.classList.add(this.options.openClass);
        }

        toastContainer.append(toastInstance);
        toast.append(toastContainer);
        return toast;
    }

    /**
     * Clears all toasts
     */
    clearToasts(){
        if(!this.activeToasts.length) return;
        this.activeToasts.slice().forEach(toast => this.dismissToast(toast.id));

        this.options.onClear(this);
    }

    /**
     * Updates toast properties and css variable values
     */
    updateToasts(){
        let offset = 0;
        for(let i = 0; i < this.activeToasts.length; i++){
            const toast = this.activeToasts[i];
            toast.toastElm.style.setProperty('--f11y-toast-index', i);
            toast.toastElm.style.setProperty('--f11y-toast-before', this.activeToasts.length - i - 1);

            this.domNode.style.setProperty('--f11y-toast-first', toast.height);
        }
        this.activeToasts.slice().reverse().forEach(function(toast) { // dumb shit
            toast.toastElm.style.setProperty('--f11y-toast-offset', offset);
            offset = offset + toast.height;
        });
    }

    /**
     * Method called when pointer down on a toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerDown(e){
        this.dragStartTime = new Date();
        e.currentTarget.setPointerCapture(e.pointerId);
        if(e.target.tagName === 'BUTTON') return;
        this.dragStartRef = { x: e.clientX, y: e.clientY};
        e.currentTarget.addEventListener('pointermove', this.onPointerMoveBound);
    }

    /**
     * Method called when pointer up on a toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerUp(e){
        const dir = this.options.swipeDirection;
        const prop = dir === 'left' || dir === 'right' ? '--f11y-toast-swipe-x' : '--f11y-toast-swipe-y';
        const swipeAmount = Number(e.currentTarget.style.getPropertyValue(prop) || 0);
        const timeTaken = new Date().getTime() - this.dragStartTime.getTime();
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if(Math.abs(swipeAmount) >= this.swipeThreshold || velocity > 0.25){
            this.dismissToast(e.currentTarget.id);
            return;
        }
        e.currentTarget.removeEventListener('pointermove', this.onPointerMoveBound);
        e.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0); //up-down
        e.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0); //left-right
        e.currentTarget.removeAttribute('f11y-toast-swiping');
    }

    /**
     * Method called when pointer move happens on toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerMove(e){
        e.currentTarget.setAttribute('f11y-toast-swiping', true);
        const yPos = e.clientY - this.dragStartRef.y;
        const xPos = e.clientX - this.dragStartRef.x;

        const isAllowedToSwipe = this.#checkSwiping(e, yPos, xPos);

        if (!isAllowedToSwipe) {
            e.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0);
            e.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0);
        }
    }

    /**
     * Compares the swiping direction with the swipeDirection option to decide if swiping is allowed
     * @param {Event} e The event object that triggered the method
     * @param {number} yPos 
     * @param {number} xPos 
     * @returns {boolean} Is swipipng allowed?
     */
    #checkSwiping(e, yPos, xPos){
        const dir = this.options.swipeDirection;

        let clamp, threshold;

        switch(dir){
            case 'up':
                clamp = Math.min(0, yPos);
                threshold = e.pointerType === 'touch' ? -10 : -2;
                if(clamp < threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                    return true;
                }
                break;
            case 'down':
                clamp = Math.max(0, yPos);
                threshold = e.pointerType === 'touch' ? 10 : 2;
                if(clamp > threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                    return true;
                }
                break;
            case 'left':
                clamp = Math.min(0, xPos);
                threshold = e.pointerType === 'touch' ? -10 : -2;
                if(clamp < threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                    return true;
                }
                break;
            case 'right':
            default:
                clamp = Math.max(0, xPos);
                threshold = e.pointerType === 'touch' ? 10 : 2;
                if(clamp > threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                    return true;
                }
                break;
        }
    }

    /**
     * Called when hover occurs on toast container domNode
     */
    #onHoverIn() {
        let timer = this.timer;
        clearTimeout(timer);
        this.domNode.classList.add('is-hovered');
        this.domNode.classList.add('has-attention');
    }

    /**
     * Called when hover leaves toast container domNode
     */
    #onHoverOut() {
        const domNode = this.domNode;
        this.timer = setTimeout(function(){
            domNode.classList.remove('is-hovered');
            domNode.classList.remove('has-attention');
        }, 750);
    }

    /**
     * Called when hover occurs on toast container domNode
     */
    #onFocusIn() {
        let timer = this.timer;
        clearTimeout(timer);
        this.domNode.classList.add('has-focus');
        this.domNode.classList.add('has-attention');
    }
    
    /**
     * Called when hover leaves toast container domNode
     */
    #onFocusOut() {
        const domNode = this.domNode;
        this.timer = setTimeout(function(){
            domNode.classList.remove('has-focus');
            domNode.classList.remove('has-attention');
        }, 750);
    }

    /**
     * Handles click events that are outside of the toast domNode remit
     * @param  {Object} e The event that triggered this method
     */
    onBackgroundMousedown(e) {
        if (!this.domNode.contains(e.target)) {
            this.domNode.classList.remove('is-hovered');
            this.domNode.classList.remove('has-focus');
            this.domNode.classList.remove('has-attention');
        }
    }
}

export default f11y

if (typeof window !== 'undefined') {
    window.f11y = f11y
}