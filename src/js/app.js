let f11y = f11y || {};

f11y.focusableElements = [
    'a[href]',
    'area[href]',
    'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])',
    'textarea:not([disabled]):not([aria-hidden])',
    'button:not([disabled]):not([aria-hidden])',
    'iframe',
    'object',
    'embed',
    '[contenteditable]',
    '[tabindex]:not([tabindex^="-"])',
    '[role="menuitem"]'
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
 * Description: 
 *
 * @class Accordion
 */
    f11y.Accordion = class Accordion {
        /**
         * 
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

            this.options = Object.assign(DEFAULTS, opts);
            this.accordionGroupNode = domNode;
            this.accordionItems = [];

            this.init();
        }

        init(){
            const items = Array.from(this.accordionGroupNode.querySelectorAll(".f11y--accordion__item"));
            for (let i = 0; i < items.length; i += 1) {
                const item = items[i];
                const itemPanel = item.querySelector('[role="region"]');
                const itemTrigger = item.querySelector("[aria-controls]");

                const itemArr = {
                    index: i,
                    item: item,
                    itemPanel: itemPanel,
                    itemTrigger: itemTrigger,
                    isOpen: itemTrigger.getAttribute("aria-expanded"),
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

        refresh(){
            this.accordionItems = [];
            this.init();
        }

        /**
         * Toggles passed accordion item.
         * @param  {Object}  accordionItemObj  Object that represents a singular accordion item.
         * @param  {Object}  event             The event that triggered this function method.
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
         * @param  {Object}  event  The event that triggered this function method.
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
         * @param  {Object}  event  The event that triggered this function method.
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
         * @param  {Object}  event             The event that triggered this function method.
         * @param  {Object}  accordionItemObj  Object that represents a singular accordion item.
         */
        openItem(event, accordionItemObj) {
            let openState = accordionItemObj.isOpen;

            if(openState == "true"){
                return;
            }

            accordionItemObj.itemPanel.removeAttribute("hidden", "");
            accordionItemObj.itemTrigger.setAttribute("aria-expanded", "true");
            accordionItemObj.isOpen = "true";

            this.options.onOpen(accordionItemObj, event, this);
        }


        /**
         * Closes the passed accordion item.
         * @param  {Object}  event             The event that triggered this function method.
         * @param  {Object}  accordionItemObj  Object that represents a singular accordion item.
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
 * Description: 
 *
 * @class Dropdown
 */
    f11y.Dropdown = class Dropdown {
        /**
         * Constructor: Finds all relevant Elements within domNode and attaches all necessary events
         * @param  {HTMLElement | Element}  domNode  The DOM element to initialise on
         * @param  {Object}                 opts     Optional params to modify functionality
         */
        constructor(domNode, opts) {
            const DEFAULTS = {
                onOpen: () => {}, /*@params event, this*/
                onClose: () => {}, /*@params event, this*/
                openClass: 'is-open',
                triggerNodeSelector: 'button[aria-controls]',
                dropdownNodeSelector: '[role="menu"]',
                updateOnSelect: false,
                updateTargetSelector: '',
                closeOnSelect: false,
                awaitCloseAnimation: false,
                awaitOpenAnimation: false
            }

            this.options = Object.assign(DEFAULTS, opts);
            this.domNode = domNode;
            this.triggerNode = '';
            this.dropdownNode = '';
            this.dropdownItemNodes = [];
            this.firstDropdownItem = false;
            this.lastDropdownItem = false;
            this.firstChars = [];

            this.init();
        }

        init() {
            this.triggerNode = this.domNode.querySelector(this.options.triggerNodeSelector);
            this.dropdownNode = this.domNode.querySelector(this.options.dropdownNodeSelector);

            this.triggerNode.addEventListener( 'keydown', this.onTriggerKeydown.bind(this) );
            this.triggerNode.addEventListener( 'click', this.onTriggerClick.bind(this) );

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

        refresh() {
            this.dropdownItemNodes = [];
            this.firstChars = [];
            this.init();
        }

        /**
         * Sets focus to a menu item.
         * @param  {HTMLElement}  newDropdownItem  New target menu item
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
         * @param    {HTMLElement | Element}  currentDropdownItem  The currently focused item within the dropdown menu
         * @returns  {HTMLElement | Element}                   The newly focused item within the dropdown menu
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
         * @param    {HTMLElement | Element}  currentDropdownItem  Currently focused item within the dropdown menu
         * @returns  {HTMLElement | Element}                   The newly focused item within the dropdown menu
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
         * Sets focus by the the first chracter of a menu item
         * @param  {HTMLElement | Element}  currentDropdownItem  Currently focused item within the dropdown menu
         * @param  {string}                 char             The character to base the focus on
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

        getIndexFirstChars(startIndex, char) {
            for (let i = startIndex; i < this.firstChars.length; i++) {
                if (char === this.firstChars[i]) {
                    return i;
                }
            }
            return -1;
        }

        /**
         * Checks whether the dropdown is open
         * @returns  {boolean}
         */
        isOpen() {
            return this.triggerNode.getAttribute('aria-expanded') === 'true';
        }

        /**
         * Opens the dropdown
         * @param  {Object}  event  The event that triggered this method
         */
        openDropdown(event = null) {
            const domNode = this.domNode;
            const dropdownNode = this.dropdownNode;
            const triggerNode = this.triggerNode;
            const openClass = this.options.openClass;

            triggerNode.setAttribute('aria-expanded', 'true');
            dropdownNode.setAttribute('aria-hidden', 'false');
            domNode.classList.add(openClass);

            if (this.options.awaitOpenAnimation) {
                domNode.addEventListener('animationend', handler );
                domNode.classList.add('is-animating', 'is-opening');
                
                function handler() {
                    domNode.classList.remove('is-animating', 'is-opening');

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
         * @param  {Object}  event  The event that triggered this method
         */
        closeDropdown(event = null) {
            if (this.isOpen()) {
                const domNode = this.domNode;
                const dropdownNode = this.dropdownNode;
                const triggerNode = this.triggerNode;
                const openClass = this.options.openClass;

                dropdownNode.setAttribute('aria-hidden', 'true');

                if (this.options.awaitCloseAnimation) {
                    domNode.addEventListener( 'animationend', handler );
                    domNode.classList.add('is-animating', 'is-closing');
                    
                    function handler() {
                        domNode.classList.remove('is-animating', 'is-closing');
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
         * @param  {Object}  event  The event that triggered this method
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
                    if(this.isOpen){
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
         * @param  {Object}  event  The event that triggered this method
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
         * @param  {Object}  event  The event that triggered this method
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
                    this.closeDropdown();
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
         * @param  {Object}  event  The event that triggered this method
         */
        onDropdownItemMouseover(event) {
            const tgt = event.currentTarget;
            tgt.focus();
        }

        /**
         * Handles click events on menu items
         * @param  {Object}  event  The event that triggered this method
         */
        onDropdownItemClick(event) {
            if (this.options.updateOnSelect === true) {
                const menuItemTextContent = event.currentTarget.textContent;
                this.triggerNode.querySelector('span').textContent = menuItemTextContent;
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
         * @param  {Object}  event  The event that triggered this method
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
 * Description: 
 *
 * @class Layer
 */
    f11y.Layer = class Layer {

        /**
         * 
         * @param {HTMLElement | Element} domNode 
         * @param {Object} opts 

         */
        constructor (domNode, opts) {
            const DEFAULTS = {
                onOpen: () => { },
                onClose: () => { },
                openTrigger: 'f11y-layer-open',
                closeTrigger: 'f11y-layer-close',
                openClass: 'is-open',
                disableScroll: false,
                disableFocus: false,
                awaitCloseAnimation: false,
                awaitOpenAnimation: false,
            }

            this.options = Object.assign(DEFAULTS, opts);

            this.layer = domNode;
            this.id = null;
            this.dialog = null;
            this.triggerNodes = null;
            this.focusableElements = null;
            this.firstElement = false;
            this.lastElement = false;

            this.init();
        }

        init(){
            this.id = this.layer.id;
            this.dialog = this.layer.querySelector('[role="dialog"]');
            this.triggerNodes = document.querySelectorAll('[' + this.options.openTrigger + '="' + this.layer.id + '"]');
            this.focusableElements = Array.from(this.layer.querySelectorAll(f11y.focusableElements));
            this.dialog.addEventListener( 'click', this.onLayerClick.bind(this), true );

            for (let i = 0; i < this.triggerNodes.length; i++) {
                this.triggerNodes[i].addEventListener( 'click', this.openLayer.bind(this), true);
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

        refresh(){
            init();
        }

        isOpen() {
            return this.layer.getAttribute('aria-hidden') === 'false';
        }

        setFocusToElement(newElement) {
            this.focusableElements.forEach(function (element) {
                if (element === newElement) {
                    newElement.focus();
                } else {
                    //Do Nothing, LeBron...
                }
            })
        }

        setFocusToFirstElement() {
            this.setFocusToElement(this.firstElement);
        }

        setFocusToLastElement() {
            this.setFocusToElement(this.lastElement);
        }

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

        openLayer (event = null) {
            this.activeElement = document.activeElement;

            const layerNode = this.layer;
            const documentBody = document.querySelector('body');
            const openClass = this.options.openClass;

            layerNode.setAttribute('aria-hidden', 'false');
            layerNode.classList.add(openClass);
            layerNode.addEventListener('click', this.onLayerClick);

            documentBody.style.setProperty('overflow', 'hidden');
            
            if (this.options.awaitOpenAnimation) {
                layerNode.addEventListener('animationend', handler);
                layerNode.classList.add('is-animating', 'is-opening');

                function handler() {
                    layerNode.classList.remove('is-animating', 'is-opening');

                    layerNode.removeEventListener( 'animationend', handler );
                }
                
            }

            this.setFocusToFirstElement();
            this.addGlobalListeners();
            this.options.onOpen(event, this);
        }

        closeLayer (event = null) {
            if (this.isOpen()) {
                const layerNode = this.layer;
                const documentBody = document.querySelector('body');
                const openClass = this.options.openClass;
                
                layerNode.setAttribute('aria-hidden', 'true');
                layerNode.removeEventListener('click', this.onLayerClick);

                if (this.activeElement && this.activeElement.focus) {
                    this.activeElement.focus();
                }

                if (this.options.awaitCloseAnimation) {
                    layerNode.addEventListener( 'animationend', handler );
                    layerNode.classList.add('is-animating', 'is-closing');

                    function handler() {
                        layerNode.classList.remove('is-animating', 'is-closing');
                        layerNode.classList.remove(openClass);
                        documentBody.style.removeProperty('overflow');

                        layerNode.removeEventListener(
                            'animationend', 
                            handler
                        );
                    }
                } else {
                    layerNode.classList.remove(openClass);
                    documentBody.style.removeProperty('overflow');
                }
            }
            this.removeGlobalListeners();
            this.options.onClose(event, this);
        }

        addGlobalListeners() {
            window.addEventListener('keydown', this.onWindowKeydownBound);
            window.addEventListener('mousedown', this.onBackgroundMousedownBound);
        }
        
        removeGlobalListeners() {
            window.removeEventListener('keydown', this.onWindowKeydownBound);
            window.removeEventListener('mousedown', this.onBackgroundMousedownBound);
        }

        closeLayerById (targetLayer) {
            this.layer = document.getElementById(targetLayer);
            if (this.layer){
                this.closeLayer();
            }
        }

        onLayerClick (event) {
            event.preventDefault()
            event.stopPropagation()

            const closeTrigger = this.options.closeTrigger;
            if (event.target.hasAttribute(closeTrigger) || event.target.parentNode.hasAttribute(closeTrigger)) {
                event.preventDefault()
                event.stopPropagation()
                this.closeLayer(event)
            }
        }

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
         * Handles click events that are outside of the dropdown remit
         * @param  {Object}  event  The event that triggered this method
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
 * Description: 
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
            init();
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
        constructor(domNode, opts) {
            const DEFAULTS = {
                onChange: () => { },
                orientation: 'horizontal',
                disableActiveTab: true
            }

            this.options = Object.assign(DEFAULTS, opts);

            this.tablistNode = domNode;
            this.firstTab = null;
            this.firstActiveTab = null;
            this.lastTab = null;
            this.lastActiveTab = null;
            this.tabs = [];
            this.activeTabs = [];
            this.tabpanels = [];
            this.tabList = [];

            this.init();
        }

        init(){
            this.tabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]'));
            this.activeTabs = Array.from(this.tablistNode.querySelectorAll('[role=tab]:not([disabled])'));
            this.tabList = this.tablistNode.querySelector('[role="tablist"]');

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

            this.handleTabChange(this.firstTab);
        }

        refresh() {
            this.tabs = [];
            this.activeTabs = [];
            this.tabpanels = [];
            this.tabList = [];
            this.init();
        }

        handleTabChange(targetTab, event) {
            this.setSelectedTab(targetTab, event);

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

            this.options.onChange(event, this);
        }

        setSelectedTab(targetTab) {
            let index;
            for (let i = 0; i < this.tabs.length; i += 1) {
                const tab = this.tabs[i];
                if (targetTab.id === tab.id) {
                    tab.setAttribute('aria-selected', 'true');
                    tab.removeAttribute('tabindex');
                    this.tabpanels[i].classList.remove('is-visually-hidden');
                    this.tabpanels[i].removeAttribute('hidden');

                    if(this.options.disableActiveTab === true){
                        tab.setAttribute('disabled', '');
                        tab.tabIndex = -1;
                        index = this.tabs.indexOf(targetTab);
                    }
                } else {
                    tab.setAttribute('aria-selected', 'false');
                    tab.removeAttribute('disabled');
                    tab.tabIndex = -1;
                    this.tabpanels[i].classList.add('is-visually-hidden');
                    this.tabpanels[i].setAttribute('hidden', '');
                }
            }
        }

        moveFocusToTab(targetTab) {
            targetTab.focus();
        }

        moveFocusToPreviousTab(targetTab) {
            let index = this.activeTabs.indexOf(targetTab);

            if (targetTab.id === this.firstActiveTab.id) {
                this.moveFocusToTab(this.lastActiveTab);
            } else {
                this.moveFocusToTab(this.activeTabs[index - 1]);
            }
        }

        moveFocusToNextTab(targetTab) {
            let index = this.activeTabs.indexOf(targetTab);

            if (targetTab.id === this.lastActiveTab.id) {
                this.moveFocusToTab(this.firstActiveTab);
            } else {
                this.moveFocusToTab(this.activeTabs[index + 1]);
            }
        }

        /* EVENT HANDLERS */
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

        onClick(event) {
            this.handleTabChange(event.currentTarget, event);
        }
    }




/**
 * Description: 
 *
 * @class Toast
 */
    f11y.Toast = class Toast {
        constructor (domNode, opts){

        }
    }




/**
 * Description: 
 *
 * @class Tooltip
 */
    f11y.Tooltip = class Tooltip {
        constructor(domNode, opts) {
            const DEFAULTS = {
                onOpen: () => { },
                onClose: () => { },
                triggerNodeSelector: '[aria-labelledby]',
                tooltipNodeSelector: '[role=tooltip]',
                positionAttributeName: 'f11y-tooltip-position',
                openClass: 'is-open',
                awaitCloseAnimation: false,
                awaitOpenAnimation: false
            }

            this.domNode = domNode;
            this.options = Object.assign(DEFAULTS, opts);
            this.triggerNode = '';
            this.tooltipNode = '';
            this.tooltipPosition = '';
            this.onTooltipKeydownBound = '';
            this.globalPointerDownBound = '';

            this.init();
        }

        init(){
            this.timer = 0;
            this.triggerNode = this.domNode.querySelector(this.options.triggerNodeSelector);
            this.tooltipNode = this.domNode.querySelector(this.options.tooltipNodeSelector);
            this.tooltipPosition = this.getTooltipPosition();
            this.onTooltipKeydownBound = this.onTooltipKeydown.bind(this);
            this.onBackgroundMousedownBound = this.onBackgroundMousedown.bind(this);

            this.domNode.addEventListener('mouseover', this.openTooltip.bind(this));
            this.domNode.addEventListener('touchstart', this.openTooltip.bind(this));
            this.domNode.addEventListener('focusin', this.onFocusin.bind(this));
            this.triggerNode.addEventListener('focusin', this.openTooltip.bind(this));

            this.domNode.addEventListener('mouseout', this.closeTooltip.bind(this));
            this.domNode.addEventListener('touchend', this.closeTooltip.bind(this));
            this.domNode.addEventListener('focusout', this.onFocusout.bind(this));
            this.triggerNode.addEventListener('focusout', this.closeTooltip.bind(this));

            document.addEventListener('scroll', this.checkBoundingBox.bind(this));
            window.addEventListener('resize', this.checkBoundingBox.bind(this));
        }

        refresh(){
            this.init();
        }

        isOpen() {
            return this.domNode.classList.contains('is-open') === 'true';
        }

        openTooltip(){
            this.domNode.classList.add('is-open');
            this.tooltipNode.classList.add('is-open');

            this.checkBoundingBox();
            this.addGlobalListeners();

            clearTimeout(this.timer);
        }

        closeTooltip(){
            const domNode = this.domNode;
            const tooltipNode = this.tooltipNode;
            domNode.classList.remove('is-open');
            tooltipNode.classList.remove('is-open');

            this.timer = setTimeout(function(){
                
            }, 500);

            this.resetBoundingBox();
            this.removeGlobalListeners();
        }

        addGlobalListeners() {
            document.addEventListener('keydown', this.onTooltipKeydownBound)
            window.addEventListener('mousedown', this.onBackgroundMousedownBound, true)
        }
        
        removeGlobalListeners() {
            document.removeEventListener('keydown', this.onTooltipKeydownBound)
            window.removeEventListener('mousedown', this.onBackgroundMousedownBound, true)
        }

        onFocusin() {
            this.domNode.classList.add('focus');
        }

        onFocusout() {
            this.domNode.classList.remove('focus');
        }

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

        onBackgroundMousedown(event){
            if (!this.domNode.contains(event.target)) {
                if (this.isOpen()) {
                    this.closeTooltip();
                }
            }
        }

        getTooltipPosition() {
            let setting = 'bottom';
        
            if (this.domNode.getAttribute(this.options.positionAttributeName)) {
              setting = this.domNode.getAttribute(this.options.positionAttributeName);
            }
        
            return setting;
        }

        // Calculate if the tooltip is within the viewport
        checkBoundingBox() {
            let bounds = this.tooltipNode.getBoundingClientRect();

            this.checkHorizontalBounding(bounds);
            this.checkVerticalBounding(bounds);
        }

        checkHorizontalBounding(bounds) {
            let windowWidth = window.innerWidth
    
            if (bounds.right > windowWidth && bounds.left < 0) {
                console.warn('Tooltip width too wide for the window');
                return;
            }
        
            // Check if the right side of the tooltip is beyond the right side of the viewport
            if (bounds.right > windowWidth) {
              this.moveTooltipLeft(bounds, windowWidth)
            }
        
            // Check if the left side of the tooltip is beyond the left side of the viewport
            if (bounds.left < 0 ) {
              this.moveTooltipRight(bounds)
            }
        }

        checkVerticalBounding(bounds) {
            let windowHeight = window.innerHeight
        
            if (bounds.bottom > windowHeight && bounds.top < 0) {
                console.warn('Tooltip height too high for the window');
                return;
            }
        
            // Check if the bottom of the tooltip is below the bottom of the viewport
            if (bounds.bottom > windowHeight) {
                this.moveTooltipUp();
                return;
            }
        
            // Check if the top of the tooltip is above the top of the viewport
            if (bounds.top < 0) {
                this.moveTooltipDown();
                return;
            }
        }

        moveTooltipUp() {
            this.domNode.setAttribute(this.options.positionAttributeName, 'top');
        }

        moveTooltipRight(bounds) {
            let numToMove = Math.floor(bounds.width / 2)
            this.tooltipNode.style.left = `${numToMove}px`
        }

        moveTooltipDown() {
            this.domNode.setAttribute(this.options.positionAttributeName, 'bottom');
        }

        moveTooltipLeft(bounds, windowWidth) {
            let translateAmount = (windowWidth - Math.round(bounds.right) - (Math.round(bounds.width) / 1.6))
            this.tooltipNode.style.transform = `translateX(${translateAmount}px)`
        }

        resetBoundingBox() {
            if (this.tooltipNode.style.left || this.tooltipNode.style.transform) {
                this.tooltipNode.style.left = null
                this.tooltipNode.style.transform = null
            }
            this.domNode.setAttribute(this.options.positionAttributeName, this.tooltipPosition);
        }
    }




export default f11y

if (typeof window !== 'undefined') {
    window.f11y = f11y
}