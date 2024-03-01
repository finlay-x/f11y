import '../global/typedefs';

class Dropdown {
    /**
     * @param  {HTMLElement} domNode The DOM element to initialise on
     * @param  {Object} opts Optional params to modify functionality
     */
    constructor(domNode, opts) {
        
        /** @type {DropdownDefault} */
        const DEFAULTS = {
            onOpen: () => {},
            onClose: () => {},
            openClass: window.f11y.settings.openClass,
            focusableElements: window.f11y.focusableElements,
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

        /** @type {HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        /** @type {HTMLElement[]} */
        this.dropdownItems = [];

        /** @type {String[]} */
        this.firstChars = [];

        /** @type {HTMLElement|null} */
        this.trigger = this.domNode.querySelector(this.options.triggerSelector);

        if(!this.trigger){
            console.warn('Trigger element does not exist within: ', this.domNode);
            return;
        }

        /** @type {string|null} */
        const ariaControls = this.trigger.getAttribute('aria-controls');

        if (!ariaControls) {
            console.warn(`aria-controls attribute is null for: `, this.trigger);
            return;
        }

        /** @type {HTMLElement|null} */
        this.dropdown = document.getElementById(ariaControls);

        if(!this.dropdown){
            console.warn('Dropdown element does not exist');
            return;
        }
        
        this.trigger.addEventListener( 'keydown', this.#onTriggerKeydown.bind(this) );
        this.trigger.addEventListener( 'click', this.#onTriggerClick.bind(this) );

        this.options.updateSelector ? this.options.updateSelector : this.options.triggerSelector;

        /** @type {HTMLElement|null} */
        this.updateTargetNode = document.querySelector(this.options.updateSelector);
        

        const items = Array.from(this.dropdown.querySelectorAll(this.options.focusableElements));

        for (let i = 0; i < items.length; i++) {
            this.dropdownItems.push(items[i]);
            items[i].tabIndex = -1;
            this.firstChars.push(items[i].textContent.trim()[0].toLowerCase());

            items[i].addEventListener( 'keydown', this.#onItemKeydown.bind(this) );
            items[i].addEventListener( 'mouseover', this.#onItemMouseover.bind(this) );

            if (this.options.updateOnSelect === true) {
                items[i].addEventListener( 'click', this.#onItemClick.bind(this) );
            }

            /** @type {HTMLElement|null} */
            if (!this.firstItem) this.firstItem = items[i];

            /** @type {HTMLElement|null} */
            this.lastItem = items[i];
        }

        this.domNode.addEventListener( 'focusin', this.#onFocusin.bind(this) );
        this.domNode.addEventListener( 'focusout', this.#onFocusout.bind(this) );

        window.addEventListener('mousedown', this.#onBackgroundMousedown.bind(this), true);
        window.addEventListener('resize', this.checkBoundingBox.bind(this));
        document.addEventListener('scroll', this.checkBoundingBox.bind(this));

        this.domNode.classList.add(window.f11y.settings.initialisedClass);
    }


    destroy(){

    }

    /**
     * Checks whether the dropdown is open
     * @returns  {boolean}
     */
    isOpen() {
        if (!this.trigger) return false;
        return this.trigger.getAttribute('aria-expanded') === "true";
    }

    /**
     * Sets focus to a menu item.
     * @param  {HTMLElement} targetItem New target menu item
     */
    setFocusToItem(targetItem) {
        if (!this.dropdownItems) return;

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
        if(!this.firstItem) return;

        this.setFocusToItem(this.firstItem);
    }

    /**
     * Sets focus to the last item in the dropdown menu
     */
    setFocusToLastItem() {
        if(!this.lastItem) return;

        this.setFocusToItem(this.lastItem);
    }

    /**
     * Sets focus to the previous menu item
     * @param    {HTMLElement} currentItem The currently focused item within the dropdown menu
     * @returns  {HTMLElement} The newly focused item within the dropdown menu
     */
    #setFocusToPreviousItem(currentItem) {
        if(!this.dropdownItems || !this.firstItem || !this.lastItem) return currentItem;
        
        /** @type {HTMLElement} */
        let newItem;
        let index;

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
     * @param    {HTMLElement} currentItem Currently focused item within the dropdown menu
     * @returns  {HTMLElement} The newly focused item within the dropdown menu
     */
    #setFocusToNextItem(currentItem) {
        if(!this.dropdownItems || !this.firstItem || !this.lastItem) return currentItem;
        
        /** @type {HTMLElement} */
        let newItem;
        let index;

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
     * @param  {HTMLElement} currentItem Currently focused item within the dropdown menu
     * @param  {string} char The character to base the focus on
     */
    #setFocusByFirstChar(currentItem, char) {
        if (char.length > 1) return;
        if(!this.dropdownItems || !this.firstChars) return;

        char = char.toLowerCase();

        let start = this.dropdownItems.indexOf(currentItem) + 1;

        if (start >= this.dropdownItems.length) start = 0;

        let index = this.firstChars.indexOf(char, start);

        if (index === -1) index = this.firstChars.indexOf(char, 0);

        if (index > -1) this.setFocusToItem(this.dropdownItems[index]);
    }

    /**
     * Opens the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    openDropdown(e = null) {
        if(!this.trigger || !this.dropdown) return;

        const domNode = this.domNode;
        const dropdown = this.dropdown;
        const trigger = this.trigger;
        const openClass = this.options.openClass;
        const animatingClass = window.f11y.settings.animatingClass;
        const animatingOpenClass = window.f11y.settings.animatingOpenClass;

        trigger.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('aria-hidden', 'false');
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
        if(!this.trigger || !this.dropdown) return;

        if (this.isOpen()) {
            const domNode = this.domNode;
            const dropdown = this.dropdown;
            const trigger = this.trigger;
            const openClass = this.options.openClass;
            const animatingClass = window.f11y.settings.animatingClass;
            const animatingCloseClass = window.f11y.settings.animatingCloseClass;

            dropdown.setAttribute('aria-hidden', 'true');

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

            trigger.removeAttribute('aria-expanded');
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
     * @param  {KeyboardEvent|null} e The event that triggered this method
     */
    #onTriggerKeydown(e = null) {
        if(!e || !this.trigger) return;

        const key = e.key;
        let flag = false;

        switch (key) {
            case ' ':
            case 'Enter':
            case 'ArrowDown':
            case 'Down':
                this.openDropdown(e);
                this.checkBoundingBox();
                this.setFocusToFirstItem();
                flag = true;
                break;

            case 'Esc':
            case 'Escape':
                if(this.isOpen()){
                    this.closeDropdown(e);
                    this.trigger.focus();
                    flag = true;
                }else{
                    flag = false;
                }
                break;

            case 'Up':
            case 'ArrowUp':
                this.openDropdown(e);
                this.checkBoundingBox();
                this.setFocusToLastItem();
                flag = true;
                break;

            case 'Tab':
                if(this.isOpen()){
                    this.closeDropdown(e);
                }
                flag = false;
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
     * Handles Trigger toggle click event
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onTriggerClick(e = null) {
        if(!e || !this.trigger) return;

        if (this.isOpen()) {
            this.closeDropdown(e);
            this.trigger.focus();
        } else {
            this.openDropdown(e);
            this.checkBoundingBox();
            this.setFocusToFirstItem();
        }

        e.stopPropagation();
        e.preventDefault();
    }

    /**
     * Handles all keyboard events on the menu items
     * @param  {KeyboardEvent|null} e The event that triggered this method
     */
    #onItemKeydown(e = null) {
        if(!e || !this.trigger || !e.currentTarget) return;

        /** @type {EventTarget} */
        const tgt = e.currentTarget;
        const key = e.key;
        let flag = false;

        /**
         * @param  {string} str
         */
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
                    this.trigger.focus();
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
                    this.trigger.focus();
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
                        this.trigger.focus();
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
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onItemMouseover(e = null) {
        if(!e || !e.currentTarget) return;

        const tgt = e.currentTarget;
        tgt.focus();
    }

    /**
     * Handles click events on menu items
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onItemClick(e = null) {
        if(!e || !e.currentTarget || !this.updateTargetNode) return;

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
        if(!this.dropdown) return;

        let dropdownBounds = this.dropdown.getBoundingClientRect();

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
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onBackgroundMousedown(e = null) {
        if(!e || !this.trigger || !this.dropdown) return;

        if (!this.domNode.contains(e.target) && this.options.closeOnBackgroundClick) {
            if (this.isOpen()) {
                this.closeDropdown(e);
                this.trigger.focus();
            }
        }
    }
}

export default Dropdown