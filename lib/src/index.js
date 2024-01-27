let f11y = f11y || {};

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
    '[tabindex]:not([tabindex^="-"])',
    '[role="menuitem"]:not([disabled]):not([hidden]):not([aria-hidden])'
];

f11y.globalSettings = {
    animatingClass: 'is-animating',
    animatingOpenClass: 'is-opening',
    animatingCloseClass: 'is-closing',
    awaitOpenAnimation: false,
    awaitCloseAnimation: false,
    openClass: 'is-open',
}


/**      
 * Stores all the required information of the individual accordion items.
 * @typedef {Object} Store
 * @property {Array.<string>} activeLayers - All currently active layers on the page
 * @property {string} activeLayer - the currently active layer
 */
f11y.store = {
    activeLayers: [],
    activeLayer: '',
}


/**
 * Description: For accordion, details/summary and disclosure components
 *
 * @class Accordion
 */
    f11y.Accordion = class Accordion {
        /**      
         * Stores all the required information of the individual accordion items.
         * @typedef {Object} AccordionItemObject
         * @property {number} index - The index of the item in the accordion group, beginning at 0
         * @property {Element} item - The item node/element
         * @property {Element} itemPanel - The panel node/element within the item
         * @property {Element} itemTrigger - The trigger node/element within the item
         * @property {string} isOpen - Is the item open?
         */

        /**
         * @typedef {Object} AccordionDefault
         * @property {Function} onOpen - Function called once item is opened
         * @property {Function} onClose - Function called once item closed
         * @property {string} itemClass - The classname targeted for finding all accordion items
         * @property {boolean} showMultiple - Should the Accordion allow multiple items open at once
         */

        /**
         * @param {HTMLElement | Element} domNode 
         * @param {Object} opts 
         */
        constructor(domNode, opts) {
            const DEFAULTS = {
                onOpen: () => { },
                onClose: () => { },
                itemClass: 'f11y--accordion__item',
                showMultiple: true,
            };

            /** @type {AccordionDefault} Stores all configuration options */
            this.options = Object.assign(DEFAULTS, opts);
            
            /** @type {HTMLElement | Element} The passed domNode */
            this.accordionGroupNode = domNode;

            /** @type {Array.<AccordionItemObject>} */
            this.accordionItems = [];

            this.init();
        }

        /**
         * Initialises the class component
         */
        init(){
            const items = Array.from(this.accordionGroupNode.querySelectorAll(".f11y--accordion__item"));
            for (let i = 0; i < items.length; i += 1) {
                const itemNode = items[i];
                const itemPanelNode = itemNode.querySelector('[role="region"]');
                const itemTriggerNode = itemNode.querySelector("[aria-controls]");

                const itemArr = {
                    index: i,
                    item: itemNode,
                    itemPanel: itemPanelNode,
                    itemTrigger: itemTriggerNode,
                    isOpen: itemTriggerNode.getAttribute("aria-expanded"),
                };

                this.accordionItems.push(itemArr);
            }

            for (let i = 0; i < this.accordionItems.length; i += 1) {
                this.accordionItems[i].itemTrigger.addEventListener(
                    "click",
                    this.toggle.bind(this, this.accordionItems[i])
                );
            }
        }

        /**
         * Refreshes the class component and calls init() and does any necessary resets
         */
        refresh(){
            this.accordionItems = [];
            this.init();
        }

        /**
         * Toggles passed accordion item.
         * @param  {AccordionItemObject}  accordionItemObj  Object that represents a singular accordion item.
         * @param  {Event|KeyboardEvent}  event             The event that triggered this function method.
         */
        toggle(accordionItemObj, event) {
            let openState = accordionItemObj.isOpen;

            if (this.options.showMultiple === false) {
                this.closeAll(event);
            }

            if (openState == "false") {
                this.openItem(event, accordionItemObj);
                return;
            }

            if (openState == "true") {
                this.closeItem(event, accordionItemObj);
                return;
            }
        }


        /**
         * Closes all accordion items.
         * @param  {Event|KeyboardEvent}  event  The event that triggered this function method.
         */
        closeAll(event) {
            for (let i = 0; i < this.accordionItems.length; i += 1) {
                let openState = this.accordionItems[i].isOpen;
                if (openState == "true") {
                    this.closeItem(event, this.accordionItems[i]);
                }
            }
        }


        /**
         * Opens all accordion items.
         * @param  {Event|KeyboardEvent}  event  The event that triggered this function method.
         */
        openAll(event) {
            if (this.options.showMultiple === false) {
                return;
            }
            for (let i = 0; i < this.accordionItems.length; i += 1) {
                this.openItem(event, this.accordionItems[i]);
            }
        }


        /**
         * Opens the passed accordion item.
         * @param  {Event|KeyboardEvent}  event             The event that triggered this function method.
         * @param  {AccordionItemObject}  accordionItemObj  Object that represents a singular accordion item.
         */
        openItem(event, accordionItemObj) {
            let openState = accordionItemObj.isOpen;

            if(openState == "true"){
                return;
            }

            accordionItemObj.itemPanel.removeAttribute("hidden");
            accordionItemObj.itemTrigger.setAttribute("aria-expanded", "true");
            accordionItemObj.isOpen = "true";

            this.options.onOpen(accordionItemObj, event, this);
        }


        /**
         * Closes the passed accordion item.
         * @param  {Event|KeyboardEvent}  event             The event that triggered this function method.
         * @param  {AccordionItemObject}  accordionItemObj  Object that represents a singular accordion item.
         */
        closeItem(event, accordionItemObj) {
            let openState = accordionItemObj.isOpen;
            
            if(openState == "true"){
                accordionItemObj.itemPanel.setAttribute("hidden", "");
                accordionItemObj.itemTrigger.setAttribute("aria-expanded", "false");
                accordionItemObj.isOpen = "false";

                this.options.onClose(accordionItemObj, event, this);
            }
        }
    }




/**
 * Description: For dropdown menu, combobox, popovers,  and disclosure components
 *
 * @class Dropdown
 */
    f11y.Dropdown = class Dropdown {

        /**
         * @typedef {Object} DropdownDefault
         * @property {Function} onOpen - Function called once item is opened
         * @property {Function} onClose - Function called once item closed
         * @property {string} openClass - 
         * @property {string} triggerNodeSelector - 
         * @property {string} dropdownNodeSelector - 
         * @property {boolean} updateOnSelect - 
         * @property {string} updateTargetSelector - 
         * @property {boolean} closeOnSelect - 
         * @property {boolean} awaitCloseAnimation - 
         * @property {boolean} awaitOpenAnimation - 
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
                triggerNodeSelector: 'button[aria-controls]',
                dropdownNodeSelector: '[role="menu"]',
                updateOnSelect: false,
                updateTargetSelector: '',
                closeOnSelect: false,
                awaitCloseAnimation: false,
                awaitOpenAnimation: false
            }

            /** @type {DropdownDefault} */
            this.options = Object.assign(DEFAULTS, opts);

            /** @type {Element | HTMLElement} */
            this.domNode = domNode;

            /** @type {Array.<Element|HTMLElement>} */
            this.dropdownItemNodes = [];

            /** @type {Array.<String>} */
            this.firstChars = [];

            this.init();
        }

        /**
         * Checks if a HTML Element is undefined or null
         * @param {Element} node Node to be checked
         */
        isset(node){
            if (typeof(node) != 'undefined' && node != null) {
                return true;
            }else{
                return false;
            }
        }

        /**
         * Initialises the class component
         */
        init() {
            /** @type {HTMLElement} */
            this.triggerNode = this.domNode.querySelector(this.options.triggerNodeSelector);
            /** @type {HTMLElement} */
            this.dropdownNode = this.domNode.querySelector(this.options.dropdownNodeSelector);

            this.triggerNode.addEventListener( 'keydown', this.onTriggerKeydown.bind(this) );
            this.triggerNode.addEventListener( 'click', this.onTriggerClick.bind(this) );

            this.options.updateTargetSelector ? this.options.updateTargetSelector : this.options.triggerNodeSelector;
            /** @type {Element} */
            this.updateTargetNode = document.querySelector(this.options.updateTargetSelector);

            const nodes = this.dropdownNode.querySelectorAll(f11y.focusableElements);
            for (let i = 0; i < nodes.length; i++) {
                const dropdownItem = nodes[i];
                this.dropdownItemNodes.push(dropdownItem);
                dropdownItem.tabIndex = -1;
                this.firstChars.push(dropdownItem.textContent.trim()[0].toLowerCase());

                dropdownItem.addEventListener( 'keydown', this.onDropdownItemKeydown.bind(this) );
                dropdownItem.addEventListener( 'mouseover', this.onDropdownItemMouseover.bind(this) );

                if (this.options.updateOnSelect === true) {
                    dropdownItem.addEventListener( 'click', this.onDropdownItemClick.bind(this) );
                }

                if (!this.firstDropdownItem) {
                    this.firstDropdownItem = dropdownItem;
                }

                this.lastDropdownItem = dropdownItem;
            }


            this.domNode.addEventListener( 'focusin', this.onFocusin.bind(this) );
            this.domNode.addEventListener( 'focusout', this.onFocusout.bind(this) );

            window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);

            document.addEventListener('scroll', this.checkBoundingBox.bind(this));
            window.addEventListener('resize', this.checkBoundingBox.bind(this));
        }

        /**
         * Refreshes the class component and calls init() and does any necessary resets
         */
        refresh() {
            this.dropdownItemNodes = [];
            this.firstChars = [];
            this.init();
        }

        /**
         * Checks whether the dropdown is open
         * @returns  {boolean}
         */
        isOpen() {
            return this.triggerNode.getAttribute('aria-expanded') === 'true';
        }
        

        /**
         * Sets focus to a menu item.
         * @param  {HTMLElement} newDropdownItem New target menu item
         */
        setFocusToDropdownItem(newDropdownItem) {
            this.dropdownItemNodes.forEach(function (item) {
                if (item === newDropdownItem) {
                    item.tabIndex = 0;
                    newDropdownItem.focus();
                } else {
                    item.tabIndex = -1;
                }
            })
        }


        /**
         * Sets focus to the first item in the dropdown menu
         */
        setFocusToFirstDropdownItem() {
            this.setFocusToDropdownItem(this.firstDropdownItem);
        }


        /**
         * Sets focus to the last item in the dropdown menu
         */
        setFocusToLastDropdownItem() {
            this.setFocusToDropdownItem(this.lastDropdownItem);
        }


        /**
         * Sets focus to the previous menu item
         * @param    {HTMLElement | Element} currentDropdownItem The currently focused item within the dropdown menu
         * @returns  {HTMLElement | Element} The newly focused item within the dropdown menu
         */
        setFocusToPreviousDropdownItem(currentDropdownItem) {
            let newDropdownItem, index;

            if (currentDropdownItem === this.firstDropdownItem) {
                newDropdownItem = this.lastDropdownItem;
            } else {
                index = this.dropdownItemNodes.indexOf(currentDropdownItem);
                newDropdownItem = this.dropdownItemNodes[index - 1];
            }

            this.setFocusToDropdownItem(newDropdownItem);

            return newDropdownItem;
        }


        /**
         * Sets focus to the next menu item
         * @param    {HTMLElement | Element} currentDropdownItem Currently focused item within the dropdown menu
         * @returns  {HTMLElement | Element} The newly focused item within the dropdown menu
         */
        setFocusToNextDropdownItem(currentDropdownItem) {
            let newDropdownItem, index;

            if (currentDropdownItem === this.lastDropdownItem) {
                newDropdownItem = this.firstDropdownItem;
            } else {
                index = this.dropdownItemNodes.indexOf(currentDropdownItem);
                newDropdownItem = this.dropdownItemNodes[index + 1];
            }
            this.setFocusToDropdownItem(newDropdownItem);

            return newDropdownItem;
        }


        /**
         * Sets focus by the the first character of a menu item
         * @param  {HTMLElement | Element} currentDropdownItem Currently focused item within the dropdown menu
         * @param  {string} char The character to base the focus on
         */
        setFocusByFirstCharacter(currentDropdownItem, char) {
            let start, index;

            if (char.length > 1) {
                return;
            }

            char = char.toLowerCase();

            start = this.dropdownItemNodes.indexOf(currentDropdownItem) + 1;
            if (start >= this.dropdownItemNodes.length) {
                start = 0;
            }

            index = this.firstChars.indexOf(char, start);

            if (index === -1) {
                index = this.firstChars.indexOf(char, 0);
            }

            if (index > -1) {
                this.setFocusToDropdownItem(this.dropdownItemNodes[index]);
            }
        }

        /**
         * Opens the dropdown
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        openDropdown(event) {
            const domNode = this.domNode;
            const dropdownNode = this.dropdownNode;
            const triggerNode = this.triggerNode;
            const openClass = this.options.openClass;

            triggerNode.setAttribute('aria-expanded', 'true');
            dropdownNode.setAttribute('aria-hidden', 'false');
            domNode.classList.add(openClass);

            if (this.options.awaitOpenAnimation) {
                domNode.addEventListener('animationend', handler );
                domNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);
                
                function handler() {
                    domNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);

                    domNode.removeEventListener(
                        'animationend', 
                        handler
                    );
                }
            }

            this.options.onOpen(event, this);
        }

        /**
         * Closes the dropdown
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        closeDropdown(event) {
            if (this.isOpen()) {
                const domNode = this.domNode;
                const dropdownNode = this.dropdownNode;
                const triggerNode = this.triggerNode;
                const openClass = this.options.openClass;

                dropdownNode.setAttribute('aria-hidden', 'true');

                if (this.options.awaitCloseAnimation) {
                    domNode.addEventListener( 'animationend', handler );
                    domNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);
                    
                    function handler() {
                        domNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);
                        domNode.classList.remove(openClass);

                        domNode.removeEventListener(
                            'animationend', 
                            handler
                        );
                    }

                    
                } else {
                    domNode.classList.remove(openClass);
                }

                triggerNode.removeAttribute('aria-expanded');
                this.options.onClose(event, this);
            }

            this.resetBoundingBox();
        }

        /**
         * Handles focus of Dropdown
         */
        onFocusin() {
            this.domNode.classList.add('focus');
        }

        /**
         * Handles lose of focus on Dropdown
         */
        onFocusout() {
            this.domNode.classList.remove('focus');
        }

        /**
         * Handles all Trigger toggle keyboard events
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        onTriggerKeydown(event) {
            const key = event.key;
            let flag = false;

            switch (key) {
                case ' ':
                case 'Enter':
                case 'ArrowDown':
                case 'Down':
                    this.openDropdown(event);
                    this.checkBoundingBox();
                    this.setFocusToFirstDropdownItem();
                    flag = true;
                    break;

                case 'Esc':
                case 'Escape':
                    if(this.isOpen()){
                        this.closeDropdown(event);
                        this.triggerNode.focus();
                        flag = true;
                    }else{
                        flag = false;
                    }
                    break;

                case 'Up':
                case 'ArrowUp':
                    this.openDropdown(event);
                    this.checkBoundingBox();
                    this.setFocusToLastDropdownItem();
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
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        onTriggerClick(event) {
            if (this.isOpen()) {
                this.closeDropdown(event);
                this.triggerNode.focus();
            } else {
                this.openDropdown(event);
                this.checkBoundingBox();
                this.setFocusToFirstDropdownItem();
            }

            event.stopPropagation();
            event.preventDefault();
        }

        /**
         * Handles all keyboard events on the menu items
         * @param  {KeyboardEvent} event The event that triggered this method
         */
        onDropdownItemKeydown(event) {
            const tgt = event.currentTarget;
            const key = event.key;
            let flag = false;

            function isPrintableCharacter(str) {
                return str.length === 1 && str.match(/\S/);
            }

            if (event.ctrlKey || event.altKey || event.metaKey) {
                return;
            }

            if (event.shiftKey) {
                if (isPrintableCharacter(key)) {
                    this.setFocusByFirstCharacter(tgt, key);
                    flag = true;
                }

                if (event.key === 'Tab') {
                    this.triggerNode.focus();
                    this.closeDropdown(event);
                    flag = true;
                }
            } else {
                switch (key) {
                    case ' ':
                        window.location.href = tgt.href;
                        break;

                    case 'Esc':
                    case 'Escape':
                        this.closeDropdown(event);
                        this.triggerNode.focus();
                        flag = true;
                        break;

                    case 'Up':
                    case 'ArrowUp':
                        this.setFocusToPreviousDropdownItem(tgt);
                        flag = true;
                        break;

                    case 'ArrowDown':
                    case 'Down':
                        this.setFocusToNextDropdownItem(tgt);
                        flag = true;
                        break;

                    case 'Home':
                    case 'PageUp':
                        this.setFocusToFirstDropdownItem();
                        flag = true;
                        break;

                    case 'End':
                    case 'PageDown':
                        this.setFocusToLastDropdownItem();
                        flag = true;
                        break;

                    case 'Tab':
                        this.closeDropdown(event);
                        this.triggerNode.focus();
                        flag = true;
                        break;
                    
                    case 'Enter':
                        this.onDropdownItemClick(event);
                        break;

                    default:
                        if (isPrintableCharacter(key)) {
                            this.setFocusByFirstCharacter(tgt, key);
                            flag = true;
                        }
                        break;
                }
            }
            if (flag) {
                event.stopPropagation();
                event.preventDefault();
            }
        }

        /**
         * Handles hover event for menu items
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        onDropdownItemMouseover(event) {
            const tgt = event.currentTarget;
            tgt.focus();
        }

        /**
         * Handles click events on menu items
         * @param  {Event|KeyboardEvent} event The event that triggered this method
         */
        onDropdownItemClick(event) {
            if (this.options.updateOnSelect === true) {
                const menuItemTextContent = event.currentTarget.textContent;
                this.updateTargetNode.textContent = menuItemTextContent;
                this.updateTargetNode.value = menuItemTextContent;
            }
            if(this.options.closeOnSelect === true) {
                this.closeDropdown(event);
            }
        }

        
        checkBoundingBox() {
            let dropdownBounds = this.dropdownNode.getBoundingClientRect();
            this.checkVerticalBounding(dropdownBounds);
        }


        checkVerticalBounding(dropdownBounds) {
            let windowHeight = window.innerHeight
        
            if (dropdownBounds.bottom > windowHeight) {
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

        resetBoundingBox() {
            this.domNode.classList.remove('out-of-bounds--top', 'out-of-bounds--bottom');
        }

        /**
         * Handles click events that are outside of the dropdown remit
         * @param  {Object} event The event that triggered this method
         */
        onBackgroundMousedown(event) {
            if (!this.domNode.contains(event.target)) {
                if (this.isOpen()) {
                    this.closeDropdown(event);
                    this.triggerNode.focus();
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
             * @property {Function} onOpen - Function called once item is opened
             * @property {Function} onClose - Function called once item closed
             * @property {string} openTrigger - 
             * @property {string} closeTrigger - 
             * @property {string} openClass - 
             * @property {boolean} disableScroll - 
             * @property {boolean} closeOnBackgroundClick -
             * @property {boolean} awaitCloseAnimation - 
             * @property {boolean} awaitOpenAnimation - 
             */

            const DEFAULTS = {
                onOpen: () => { },
                onClose: () => { },
                openTrigger: 'f11y-layer-open',
                closeTrigger: 'f11y-layer-close',
                openClass: f11y.globalSettings.openClass,
                disableScroll: true,
                closeOnBackgroundClick: true,
                awaitCloseAnimation: false,
                awaitOpenAnimation: false,
            }

            /** @type {LayerDefault} */
            this.options = Object.assign(DEFAULTS, opts);

            /** @type {Element | HTMLElement} */
            this.layer = domNode;

            /** @type {string} */
            this.id = '';

            this.init();
        }

        /**
         * Initialises the class component
         */
        init(){
            this.id = this.layer.id;
            this.dialog = this.layer.querySelector('[role="dialog"]');
            this.triggerNodes = document.querySelectorAll('[' + this.options.openTrigger + '="' + this.layer.id + '"]');
            this.closeNodes = document.querySelectorAll('[' + this.options.closeTrigger + '="' + this.layer.id + '"]');
            this.focusableElements = Array.from(this.layer.querySelectorAll(f11y.focusableElements));
            this.filterFocusableElements();

            for (let i = 0; i < this.triggerNodes.length; i++) {
                this.triggerNodes[i].addEventListener( 'click', this.openLayer.bind(this), true);
            }

            for (let i = 0; i < this.closeNodes.length; i++) {
                this.closeNodes[i].addEventListener( 'click', this.closeLayer.bind(this), true);
            }

            for (let i = 0; i < this.focusableElements.length; i++) {
                if (!this.firstElement) {
                    this.firstElement = this.focusableElements[i];
                }
                this.lastElement = this.focusableElements[i];
            }

            this.onBackgroundMousedownBound = this.onBackgroundMousedown.bind(this);
            this.onWindowKeydownBound = this.onWindowKeydown.bind(this);
        }

        /**
         * Refreshes the class component and calls init() and does any necessary resets
         */
        refresh(){
            this.init();
        }


        filterFocusableElements(){
            let i = this.focusableElements.length;

            while(i--){
                const element = this.focusableElements[i];
                const closestHidden = element.closest('[aria-hidden]');

                if(closestHidden != this.layer){
                    this.focusableElements.splice(i, 1);
                }
            }
        }

        /**
         * Checks whether the layer is open
         * @returns  {boolean}
         */
        isOpen() {
            return this.layer.getAttribute('aria-hidden') === 'false';
        }

        /**
         * Checks whether the layer is open
         * @param {Element | HTMLElement}  newElement Element Node to move focus to
         */
        setFocusToElement(newElement) {
            this.focusableElements.forEach(function (element) {
                if (element === newElement) {
                    newElement.focus();
                }
            })
        }

        /**
         * Sets Focus to the first focusable item inside the layer
         */
        setFocusToFirstElement() {
            this.setFocusToElement(this.firstElement);
        }

        /**
         * Sets Focus to the last focusable item inside the layer
         */
        setFocusToLastElement() {
            this.setFocusToElement(this.lastElement);
        }

        /**
         * Sets Focus to the previous focusable item inside the layer
         * @param {Element | HTMLElement}  currentElement the currently focused element within the layer
         */
        setFocusToPrevElement(currentElement) {
            let newElement, index;

            if (currentElement === this.firstElement) {
                newElement = this.lastElement;
            } else {
                index = this.focusableElements.indexOf(currentElement);
                newElement = this.focusableElements[index - 1];
            }

            this.setFocusToElement(newElement);

            return newElement;
        }

        /**
         * Sets Focus to the next focusable item inside the layer
         * @param {Element | HTMLElement}  currentElement the currently focused element within the layer
         */
        setFocusToNextElement(currentElement) {
            let newElement, index;

            if (currentElement === this.lastElement) {
                newElement = this.firstElement;
            } else {
                index = this.focusableElements.indexOf(currentElement);
                newElement = this.focusableElements[index + 1];
            }
            this.setFocusToElement(newElement);

            console.log(newElement);

            return newElement;
        }

        /**
         * Opens the layer
         * @param {Event | KeyboardEvent}  event The event object that triggered the method
         */
        openLayer (event) {
            this.activeElement = document.activeElement;

            const layerNode = this.layer;
            const documentBody = document.querySelector('body');
            const openClass = this.options.openClass;

            layerNode.setAttribute('aria-hidden', 'false');
            layerNode.classList.add(openClass);
            layerNode.addEventListener('click', this.onLayerClick);

            this.options.disableScroll ? documentBody.style.setProperty('overflow', 'hidden') : '';
            
            if (this.options.awaitOpenAnimation) {
                layerNode.addEventListener('animationend', handler);
                layerNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);

                function handler() {
                    layerNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);

                    layerNode.removeEventListener( 'animationend', handler );
                }
            }

            this.setFocusToFirstElement();
            this.addGlobalListeners();
            f11y.store.activeLayer = this.id;
            f11y.store.activeLayers.push(this.id);
            this.options.onOpen(event, this);
        }

        /**
         * Closes the layer
         * @param {Event | KeyboardEvent}  event The event object that triggered the method
         */
        closeLayer (event) {
            if (this.isOpen()) {
                if(this.id != f11y.store.activeLayer) return;

                const layerNode = this.layer;
                const documentBody = document.querySelector('body');
                const openClass = this.options.openClass;

                f11y.store.activeLayers.pop();
                f11y.store.activeLayer = f11y.store.activeLayers[f11y.store.activeLayers.length - 1];

                layerNode.setAttribute('aria-hidden', 'true');
                layerNode.removeEventListener('click', this.onLayerClick);

                if (this.activeElement && this.activeElement.focus) {
                    this.activeElement.focus();
                }

                if (this.options.awaitCloseAnimation) {
                    layerNode.addEventListener( 'animationend', handler );
                    layerNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);

                    function handler() {
                        layerNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);
                        layerNode.classList.remove(openClass);

                        if(f11y.store.activeLayers <= 0){
                            documentBody.style.removeProperty('overflow');
                        }

                        layerNode.removeEventListener(
                            'animationend', 
                            handler
                        );
                    }
                } else {
                    layerNode.classList.remove(openClass);

                    f11y.store.activeLayers <= 0 ? documentBody.style.removeProperty('overflow') : '';
                }
            }
            this.removeGlobalListeners();
            this.options.onClose(event, this);
        }

        /**
         * Adds bound methods window events 
         */
        addGlobalListeners() {
            window.addEventListener('keydown', this.onWindowKeydownBound);
            if(this.options.closeOnBackgroundClick){
                window.addEventListener('mousedown', this.onBackgroundMousedownBound);
            }
        }
        
        /**
         * Removes bound methods window events 
         */
        removeGlobalListeners() {
            window.removeEventListener('keydown', this.onWindowKeydownBound);
            if(this.options.closeOnBackgroundClick){
                window.removeEventListener('mousedown', this.onBackgroundMousedownBound);
            }
        }

        /**
         * Closes a layer by id attribute
         * @param {string} targetLayer id string of the layer to be closed
         */
        closeLayerById (targetLayer) {
            this.layer = document.getElementById(targetLayer);
            if (this.layer){
                this.closeLayer();
            }
        }

        /**
         * Implements window keydown events functionality
         * @param {KeyboardEvent} event The event object that triggered the method
         */
        onWindowKeydown(event) {
            let flag = false;
            const tgt = event.target || event.currentTarget;

            if (event.shiftKey) {
                if (event.key === 'Tab') {
                    this.setFocusToPrevElement(tgt);
                    flag = true;
                }
            }else{
                switch (event.key) {
                    case 'Escape':
                    case 'Esc':
                        this.closeLayer(event);
                        flag = true;
                        break;
                    case 'Tab':
                        this.setFocusToNextElement(tgt);
                        flag = true;
                        break;

                    case 'Home':
                    case 'PageUp':
                        this.setFocusToFirstElement();
                        flag = true;
                        break;

                    case 'End':
                    case 'PageDown':
                        this.setFocusToLastElement()
                        flag = true;
                        break;
                    default:
                        break;
                }
            }

            if (flag) {
                event.stopPropagation();
                event.preventDefault();
            }
        }

        /**
         * Handles click events that are outside of the layer dialog remit
         * @param  {Event}  event  The event that triggered this method
         */
        onBackgroundMousedown(event) {
            if (!this.dialog.contains(event.target)) {
                if (this.isOpen()) {
                    this.closeLayer(event);
                    this.activeElement.focus();
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
            this.tableNode = domNode;
            this.init();
        }

        init(){
            this.tableId = this.tableNode.getAttribute('id');

            this.tableGroups = Array.from(this.tableNode.querySelectorAll('thead, tbody, tfoot'));
            this.tableRows = Array.from(this.tableNode.querySelectorAll('tr'));
            this.tableHeaderCells = Array.from(this.tableNode.querySelectorAll('th'));
            this.tableDataCells = Array.from(this.tableNode.querySelectorAll('td'));

            this.styleElm = document.createElement("style");
            document.head.appendChild(this.styleElm);
            this.stylesheet = this.styleElm.sheet;

            this.insertCellHeaders();
            this.insertTableAria();
        }

        refresh(){
            this.init();
        }

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

        insertTableAria(){
            this.tableNode.setAttribute('role','table');

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
 * Description: 
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
             */

            const DEFAULTS = {
                onChange: () => { },
                orientation: 'horizontal',
                disableActiveTab: false
            }

            /** @type {TabListDefault} */
            this.options = Object.assign(DEFAULTS, opts);
            this.tablistNode = domNode;

            this.init();
        }

        /**
         * Initialises the class component
         */
        init(){
            this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
            this.activeTabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]:not([disabled])'));

            /** @type {Array<HTMLElement>} */
            this.tabpanels = [];

            for (let i = 0; i < this.tabs.length; i += 1) {
                const tab = this.tabs[i];
                const tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

                tab.tabIndex = -1;
                tab.setAttribute('aria-selected', 'false');
                this.tabpanels.push(tabpanel);

                tab.addEventListener('keydown', this.onKeydown.bind(this));
                tab.addEventListener('click', this.onClick.bind(this));

                if (!this.firstTab) {
                    this.firstTab = tab;
                }

                this.lastTab = tab;
            }

            this.setActiveTab(this.firstTab);
            this.findActiveTabs();
        }

        /**
         * Refreshes the class component and calls init() and does any necessary resets
         */
        refresh() {
            this.init();
        }

        /**
         * Handles Change a tab
         * @param {HTMLElement} targetTab 
         * @param {Event | KeyboardEvent} event 
         */
        handleTabChange(targetTab, event) {
            this.setActiveTab(targetTab);
            this.findActiveTabs();

            let tabIndex = this.tabs.indexOf(this.activeTab);
            let nextTab = this.tabs[tabIndex + 1];
            if(nextTab === undefined){
                nextTab = this.activeTabs[0];
            }
            this.moveFocusToTab(nextTab);
            this.options.onChange(event, this);
        }

        /**
         * 
         */
        findActiveTabs(){
            this.activeTabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]:not([disabled])'));
            this.firstActiveTab = null;

            for (let i = 0; i < this.activeTabs.length; i += 1) {
                const tab = this.activeTabs[i];

                if (!this.firstActiveTab) {
                    this.firstActiveTab = tab;
                }

                this.lastActiveTab = tab;
            }

            if(this.options.disableActiveTab === true){
                this.activeTabs[0].removeAttribute('tabindex');
            }
        }

        /**
         * 
         * @param {Element} targetTab 
         */
        setActiveTab(targetTab){
            for (let i = 0; i < this.tabs.length; i += 1) {
                const tab = this.tabs[i];

                if (targetTab.id === tab.id) {
                    this.activeTab = this.tabs[i];
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
        }


        /**
         * Moves focus to passed tab
         * @param {Element} targetTab 
         */
        moveFocusToTab(targetTab) {
            targetTab.focus();
        }

        /**
         * Moves focus to previous tab
         * @param {Element} targetTab 
         */
        moveFocusToPreviousTab(targetTab) {
            let index = this.activeTabs.indexOf(targetTab);

            if (targetTab.id === this.firstActiveTab.id) {
                this.moveFocusToTab(this.lastActiveTab);
            } else {
                this.moveFocusToTab(this.activeTabs[index - 1]);
            }
        }

        /**
         * Moves focus to Next tab
         * @param {Element} targetTab 
         */
        moveFocusToNextTab(targetTab) {
            let index = this.activeTabs.indexOf(targetTab);

            if (targetTab.id === this.lastActiveTab.id) {
                this.moveFocusToTab(this.firstActiveTab);
            } else {
                this.moveFocusToTab(this.activeTabs[index + 1]);
            }
        }

        /**
         * Handles keydown events on tabs
         * @param {KeyboardEvent} event 
         */
        onKeydown(event) {
            const tgt = event.currentTarget;
            let flag = false;

            switch (event.key) {
                case 'ArrowLeft':
                    if(this.options.orientation === 'horizontal'){
                        this.moveFocusToPreviousTab(tgt);
                        flag = true;
                    }
                    break;

                case 'ArrowRight':
                    if(this.options.orientation === 'horizontal'){
                        this.moveFocusToNextTab(tgt);
                        flag = true;
                    }
                    break;

                case 'ArrowUp':
                    if(this.options.orientation === 'vertical'){
                        this.moveFocusToPreviousTab(tgt);
                        flag = true;
                    }
                    break;

                case 'ArrowDown':
                    if(this.options.orientation === 'vertical'){
                        this.moveFocusToNextTab(tgt);
                        flag = true;
                    }
                    break;

                case 'Home':
                    this.moveFocusToTab(this.firstTab);
                    flag = true;
                    break;

                case 'End':
                    this.moveFocusToTab(this.lastTab);
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
         * Handles click events
         * @param {Event} event 
         */
        onClick(event) {
            this.handleTabChange(event.currentTarget, event);
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
             * @property {Function} onOpen - 
             * @property {Function} onClose - 
             * @property {string} triggerNodeSelector - 
             * @property {string} tooltipNodeSelector - 
             * @property {string} positionAttributeName - 
             * @property {string} openClass - 
             * @property {boolean} awaitCloseAnimation - 
             * @property {boolean} awaitOpenAnimation - 
             */


            const DEFAULTS = {
                onOpen: () => { },
                onClose: () => { },
                openClass: f11y.globalSettings.openClass,
                triggerNodeSelector: '[aria-labelledby]',
                tooltipNodeSelector: '[role=tooltip]',
                positionAttributeName: 'f11y-tooltip-position',
                awaitCloseAnimation: true,
                awaitOpenAnimation: true 
            }

            /** @type {TooltipDefault} */
            this.options = Object.assign(DEFAULTS, opts);
            this.domNode = domNode;

            this.init();
        }

        /**
         * Initialises the class component
         */
        init(){
            this.timer = 0;
            this.triggerNode = this.domNode.querySelector(this.options.triggerNodeSelector);
            this.tooltipNode = this.domNode.querySelector(this.options.tooltipNodeSelector);
            this.tooltipPosition = this.getTooltipPosition();
            this.onTooltipKeydownBound = this.onTooltipKeydown.bind(this);
            this.onBackgroundMousedownBound = this.onBackgroundMousedown.bind(this);

            this.domNode.addEventListener('mouseenter', this.openTooltip.bind(this));
            this.domNode.addEventListener('touchstart', this.openTooltip.bind(this));
            this.domNode.addEventListener('focusin', this.onFocusin.bind(this));
            this.triggerNode.addEventListener('focusin', this.openTooltip.bind(this));

            this.domNode.addEventListener('mouseleave', this.closeTooltip.bind(this));
            this.domNode.addEventListener('touchend', this.closeTooltip.bind(this));
            this.domNode.addEventListener('focusout', this.onFocusout.bind(this));
            this.triggerNode.addEventListener('focusout', this.closeTooltip.bind(this));

            document.addEventListener('scroll', this.checkBoundingBox.bind(this));
            window.addEventListener('resize', this.checkBoundingBox.bind(this));
        }

        /**
         * Refreshes the class component and calls init() and does any necessary resets
         */
        refresh(){
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
        openTooltip(){
            const domNode = this.domNode;
            const tooltipNode = this.tooltipNode;
            const timer = this.timer;
            const openClass = this.options.openClass

            tooltipNode.classList.add(openClass);

            if (!this.isOpen() && this.options.awaitOpenAnimation) {
                domNode.addEventListener('animationend', handler );
                domNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);
                
                function handler() {
                    domNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingOpenClass);
                    domNode.classList.add(openClass);
                    clearTimeout(timer);

                    domNode.removeEventListener(
                        'animationend', 
                        handler
                    );
                }
            }else{
                domNode.classList.add(openClass);
                clearTimeout(timer);
            }

            this.checkBoundingBox();
            this.addGlobalListeners();
        }

        /**
         * Closes the tooltip
         */
        closeTooltip(){
            if(this.isOpen()){
                const domNode = this.domNode;
                const tooltipNode = this.tooltipNode;
                const openClass = this.options.openClass;
    
                if (this.options.awaitCloseAnimation) {
                    this.timer = setTimeout(function(){
                        domNode.addEventListener( 'animationend', handler );
                        domNode.classList.add(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);
    
                        function handler() {
                            domNode.classList.remove(f11y.globalSettings.animatingClass, f11y.globalSettings.animatingCloseClass);
                            domNode.classList.remove(openClass);
                            tooltipNode.classList.remove(openClass);
    
                            domNode.removeEventListener(
                                'animationend', 
                                handler
                            );
                        }
                    }, 750);
                } else{
                    this.timer = setTimeout(function(){
                        domNode.classList.remove(openClass);
                        tooltipNode.classList.remove(openClass);
                    }, 750);
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
            this.domNode.classList.add('focus');
        }

        /**
         * Handles the domNode losing focus
         */
        onFocusout() {
            this.domNode.classList.remove('focus');
        }

        /**
         * Handles a keydown event on the tooltip target
         * @param  {KeyboardEvent} event
         */
        onTooltipKeydown(event) {
            const key = event.key;
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
                event.stopPropagation();
                event.preventDefault();
            }
        }

        /**
         * Handles a mouse click event outside the domNode
         * @param  {Event} event
         */
        onBackgroundMousedown(event){
            if (!this.domNode.contains(event.target)) {
                if (this.isOpen()) {
                    this.closeTooltip();
                }
            }
        }

        /**
         * 
         */
        getTooltipPosition() {
            let setting = 'bottom';
        
            if (this.domNode.getAttribute(this.options.positionAttributeName)) {
              setting = this.domNode.getAttribute(this.options.positionAttributeName);
            }
        
            return setting;
        }

        /**
         * 
         */
        checkBoundingBox() {
            let bounds = this.tooltipNode.getBoundingClientRect();

            this.checkHorizontalBounding(bounds);
            this.checkVerticalBounding(bounds);
        }

        /**
         * 
         * @param {*} bounds 
         */
        checkHorizontalBounding(bounds) {
            let windowWidth = window.innerWidth
    
            if (bounds.right > windowWidth && bounds.left < 0) {
                console.warn('Tooltip width too wide for the window');
                return;
            }
        
            if (bounds.right > windowWidth) {
              this.moveTooltipLeft(bounds, windowWidth)
            }
        
            if (bounds.left < 0 ) {
              this.moveTooltipRight(bounds)
            }
        }

        /**
         * 
         * @param {*} bounds 
         */
        checkVerticalBounding(bounds) {
            let windowHeight = window.innerHeight
        
            if (bounds.bottom > windowHeight && bounds.top < 0) {
                console.warn('Tooltip height too high for the window');
                return;
            }
        
            if (bounds.bottom > windowHeight) {
                this.moveTooltipUp();
                return;
            }
        
            if (bounds.top < 0) {
                this.moveTooltipDown();
                return;
            }
        }

        /**
         * 
         */
        moveTooltipUp() {
            this.domNode.setAttribute(this.options.positionAttributeName, 'top');
        }

        /**
         * 
         * @param {*} bounds 
         */
        moveTooltipRight(bounds) {
            let numToMove = Math.floor(bounds.width / 2)
            this.tooltipNode.style.left = `${numToMove}px`
        }

        /**
         * 
         */
        moveTooltipDown() {
            this.domNode.setAttribute(this.options.positionAttributeName, 'bottom');
        }

        /**
         * 
         * @param {*} bounds 
         * @param {*} windowWidth 
         */
        moveTooltipLeft(bounds, windowWidth) {
            let translateAmount = (windowWidth - Math.round(bounds.right) - (Math.round(bounds.width) / 1.6))
            this.tooltipNode.style.transform = `translateX(${translateAmount}px)`
        }

        /**
         * 
         */
        resetBoundingBox() {
            if (this.tooltipNode.style.left || this.tooltipNode.style.transform) {
                this.tooltipNode.style.left = null
                this.tooltipNode.style.transform = null
            }
            this.domNode.setAttribute(this.options.positionAttributeName, this.tooltipPosition);
        }
    }

/**
 * Description: 
 * 
 * TODO:
 * Await Close Transitions
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
             * @property {Function} onOpen - 
             * @property {Function} onDismiss - 
             * @property {string} openClass - 
             * @property {string} closeToastAttribute - 
             * @property {boolean} awaitCloseTransition - 
             * @property {boolean} awaitOpenTransition - 
             */

            const DEFAULTS = {
                onOpen: () => { },
                onDismiss: () => { },
                openClass: f11y.globalSettings.openClass,
                closeToastAttribute: 'f11y-toast-close',
                templateElementAttribute: 'f11y-toast-message',
                swipeTracking: true,
                swipeDirection: 'left',
                duration: -1,
                awaitCloseTransition: false,
                awaitOpenTransition: true 
            }

            /** @type {ToastDefault} */
            this.options = Object.assign(DEFAULTS, opts);
            this.toastContainer = domNode;
            this.toastTemplate = toastTemplate;

            this.init();
        }

        init(){
            this.timer = 0;
            this.activeToasts = [];
            this.onPointerMoveBound = this.onPointerMove.bind(this);
            this.swipeThreshold = 50;
            window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
        }

        openToast(templateString, customToastTemplate = null) {
            let toastTemplate = this.toastTemplate;
            if(customToastTemplate != null) toastTemplate = customToastTemplate;
            const builtToast = this.#createToast(toastTemplate, templateString);
            const toast = this.toastContainer.insertAdjacentElement('afterbegin', builtToast.firstChild);

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
            this.toastContainer.classList.add('has-toasts');

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

        dismissToast(id) {
            const toast = this.toastContainer.querySelector('[f11y-toast-id="' + id + '"]');
            this.activeToasts = this.activeToasts.filter(obj => obj.id !== id);
            this.updateToasts();
            toast.remove();
            if(!this.activeToasts.length){
                this.toastContainer.classList.remove('.is-hovered', 'has-toasts');
            }
        }

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

        clearToasts(){
            if(!this.activeToasts.length) return;
            this.activeToasts.slice().forEach(toast => this.dismissToast(toast.id));
        }

        updateToasts(){
            let offset = 0;
            for(let i = 0; i < this.activeToasts.length; i++){
                const toast = this.activeToasts[i];
                toast.toastElm.style.setProperty('--f11y-toast-index', i);
                toast.toastElm.style.setProperty('--f11y-toast-before', this.activeToasts.length - i - 1);

                this.toastContainer.style.setProperty('--f11y-toast-first', toast.height);
            }
            this.activeToasts.slice().reverse().forEach(function(toast) { // dumb shit
                toast.toastElm.style.setProperty('--f11y-toast-offset', offset);
                offset = offset + toast.height;
            });
        }

        onPointerDown(event){
            this.dragStartTime = new Date();
            event.currentTarget.setPointerCapture(event.pointerId);
            if(event.target.tagName === 'BUTTON') return;
            this.dragStartRef = { x: event.clientX, y: event.clientY};
            event.currentTarget.addEventListener('pointermove', this.onPointerMoveBound);
        }

        onPointerUp(event){
            const dir = this.options.swipeDirection;
            const prop = dir === 'left' || dir === 'right' ? '--f11y-toast-swipe-x' : '--f11y-toast-swipe-y';
            const swipeAmount = Number(event.currentTarget.style.getPropertyValue(prop) || 0);
            const timeTaken = new Date().getTime() - this.dragStartTime.getTime();
            const velocity = Math.abs(swipeAmount) / timeTaken;
            if(Math.abs(swipeAmount) >= this.swipeThreshold || velocity > 0.25){
                this.dismissToast(event.currentTarget.id);
                return;
            }
            event.currentTarget.removeEventListener('pointermove', this.onPointerMoveBound);
            event.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0); //up-down
            event.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0); //left-right
            event.currentTarget.removeAttribute('f11y-toast-swiping');
        }

        onPointerMove(event){
            event.currentTarget.setAttribute('f11y-toast-swiping', true);
            const yPos = event.clientY - this.dragStartRef.y;
            const xPos = event.clientX - this.dragStartRef.x;

            const isAllowedToSwipe = this.#checkSwiping(event, yPos, xPos);

            if (!isAllowedToSwipe) {
                event.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0);
                event.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0);
            }
        }

        #checkSwiping(event, yPos, xPos){
            const dir = this.options.swipeDirection;

            let clamp, threshold;

            switch(dir){
                case 'up':
                    clamp = Math.min(0, yPos);
                    threshold = event.pointerType === 'touch' ? -10 : -2;
                    if(clamp < threshold){
                        event.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                        return true;
                    }
                    break;
                case 'down':
                    clamp = Math.max(0, yPos);
                    threshold = event.pointerType === 'touch' ? 10 : 2;
                    if(clamp > threshold){
                        event.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                        return true;
                    }
                    break;
                case 'left':
                    clamp = Math.min(0, xPos);
                    threshold = event.pointerType === 'touch' ? -10 : -2;
                    if(clamp < threshold){
                        event.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                        return true;
                    }
                    break;
                case 'right':
                default:
                    clamp = Math.max(0, xPos);
                    threshold = event.pointerType === 'touch' ? 10 : 2;
                    if(clamp > threshold){
                        event.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                        return true;
                    }
                    break;
            }
        }

        #onHoverIn() {
            let timer = this.timer;
            clearTimeout(timer);
            this.toastContainer.classList.add('is-hovered');
        }

        #onHoverOut() {
            const toastContainer = this.toastContainer;
            this.timer = setTimeout(function(){
                toastContainer.classList.remove('is-hovered');
            }, 750);
        }

        /**
         * Handles click events that are outside of the dropdown remit
         * @param  {Object} event The event that triggered this method
         */
        onBackgroundMousedown(event) {
            if (!this.toastContainer.contains(event.target)) {
                this.toastContainer.classList.remove('is-hovered');
            }
        }
    }



export default f11y

if (typeof window !== 'undefined') {
    window.f11y = f11y
}