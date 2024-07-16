import '../global/typedefs';
import getFocusable from '../utils/getFocusable';

class Dropdown {

    #eventDetail;
    #events;

    /**
     * @param  {HTMLElement|Node} domNode The DOM element to initialise on
     * @param  {DropdownDefault} opts Optional params to modify functionality
     */
    constructor(domNode, opts) {
        /** @type {DropdownDefault} */
        const DEFAULTS = {
            onBeforeOpen: () => {},
            onAfterOpen: () => {},
            onBeforeClose: () => {},
            onAfterClose: () => {},
            openClass: window.f11y.settings.openClass,
            focusableElements: window.f11y.focusableElements,
            updateOnSelect: false,
            updateSelector: null,
            closeOnBackgroundClick: true,
            openOnClick: true,
            openOnHover: false,
            focusOnMouseOver: true,
            closeOnSelect: false,
            arrowNavigation: true,
            tabNavigation: false,
            awaitOpenAnimation: false,
            awaitCloseAnimation: false
        }

        /** @type {DropdownDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {HTMLElement|Node} */
        this.domNode = domNode;

        this.#eventDetail = { detail: { component: this } };
        this.#events = {
            initialised: new CustomEvent( 'f11yinit', this.#eventDetail ),
            initialisedItems: new CustomEvent( 'f11yinititems', this.#eventDetail ),
            destroyed: new CustomEvent( 'f11ydestroyed', this.#eventDetail ),
            beforeOpen: new CustomEvent( 'f11ybeforeopen', this.#eventDetail ),
            afterOpen: new CustomEvent( 'f11yafteropen', this.#eventDetail ),
            beforeClose: new CustomEvent( 'f11ybeforeclose', this.#eventDetail ),
            afterClose: new CustomEvent( 'f11yafterclose', this.#eventDetail )
        };

        this.init();
    }

    init(){
        /** @type {Node[]} */
        this.dropdownItems = [];

        /** @type {String[]} */
        this.firstChars = [];

        /** @type {Function[]} */
        this.itemKeydownHandlers = [];

        /** @type {Function[]} */
        this.itemMouseoverHandlers = [];

        /** @type {Function[]} */
        this.itemClickHandlers = [];

        /** @type {HTMLElement|null} */
        this.trigger = this.domNode.querySelector('[aria-controls]');
        if(!this.trigger) return console.warn('Trigger element does not exist within: ', this.domNode);

        /** @type {string|null} */
        const ariaControls = this.trigger.getAttribute('aria-controls');
        if (!ariaControls) return console.warn(`aria-controls attribute is null for: `, this.trigger);

        /** @type {HTMLElement|null} */
        this.dropdown = document.getElementById(ariaControls);
        if(!this.dropdown) return console.warn('Dropdown element does not exist');

        if(this.options.updateSelector) this.updateTargetNode = document.querySelector(this.options.updateSelector);
    
        // Bind Node Listeners
        this.onTriggerKeydownBound = this.#onTriggerKeydown.bind(this);
        if(this.options.openOnClick === true) this.onTriggerClickBound = this.#onTriggerClick.bind(this);
        if(this.options.openOnHover === true) this.onTriggerHoverBound = this.#onTriggerHover.bind(this);
        this.onFocusInBound = this.#onFocusin.bind(this);
        this.onFocusOutBound = this.#onFocusout.bind(this);

        // Bind Window Listeners
        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);
        this.checkBoundingBoxBound = this.checkBoundingBox.bind(this);
        this.updateFocusableElmsBound = this.updateFocusableElms.bind(this);

        this.addNodeListeners();
        
        this.domNode.classList.add(window.f11y.settings.initialisedClass);
        window.dispatchEvent(this.#events.initialised);
        this.domNode.dispatchEvent(this.#events.initialised);
    }


    destroy(){
        window.dispatchEvent(this.#events.destroyed);
        this.domNode.dispatchEvent(this.#events.destroyed);
    }


    initDropdownItems() {
        if (!this.dropdown) return;

        this.dropdownItems = [];
        this.dropdownItems = getFocusable(this.dropdown);

        if (!this.dropdownItems) return;

        const itemKeydownHandler = this.#onItemKeydown.bind(this);
        const itemMouseoverHandler = this.#onItemMouseover.bind(this);
        const itemClickHandler = this.#onItemClick.bind(this);

        this.dropdownItems.forEach((item) => {
            item.tabIndex = -1;

            /** @type {string|null} */
            const itemContent = item.textContent;
            if(itemContent && this.firstChars) this.firstChars.push(itemContent.trim()[0].toLowerCase());

            if (this.options.updateOnSelect === true){
                item.addEventListener('click', itemClickHandler);
                this.itemClickHandlers.push(itemClickHandler);
            }

            item.addEventListener( 'keydown', itemKeydownHandler );
            item.addEventListener( 'mouseover', itemMouseoverHandler );

            this.itemKeydownHandlers.push(itemKeydownHandler);
            this.itemMouseoverHandlers.push(itemMouseoverHandler);

            /** @type {Node|null} */
            if (!this.firstItem) this.firstItem = item;

            /** @type {Node|null} */
            this.lastItem = item;
        });

        this.domNode.dispatchEvent(this.#events.initialisedItems);
    }

    dispatchStateUpdateEvent() {
        window.dispatchEvent(window.f11y.events.stateUpdate);
    }

    /**
     * Adds bound method window events 
     */
    addGlobalListeners() {
        window.addEventListener('mousedown', this.onBackgroundMousedownBound);
        window.addEventListener('f11ystateupdate', this.updateFocusableElmsBound);
        document.addEventListener('scroll', this.checkBoundingBoxBound);
        window.addEventListener('resize', this.checkBoundingBoxBound);
    }
    

    /**
     * Removes bound methods window events 
     */
    removeGlobalListeners() {
        window.removeEventListener('mousedown', this.onBackgroundMousedownBound);
        window.removeEventListener('f11yStateUpdate', this.updateFocusableElmsBound);
        document.removeEventListener('scroll', this.checkBoundingBoxBound);
        window.removeEventListener('resize', this.checkBoundingBoxBound);
    }


    /**
     * Adds bound methods to the domNode elements
     */
    addNodeListeners() {
        if (!this.trigger) return;

        this.trigger.addEventListener( 'keydown', this.onTriggerKeydownBound);
        if(this.onTriggerClickBound){
            this.trigger.addEventListener( 'click', this.onTriggerClickBound);
        }
        if(this.onTriggerHoverBound){
            this.trigger.addEventListener( 'mouseover', this.onTriggerHoverBound);
        }
        this.domNode.addEventListener( 'focusin', this.onFocusInBound);
        this.domNode.addEventListener( 'focusout', this.onFocusOutBound);
    }
    

    /**
     * Adds bound methods to the domNode elements
     */
    removeNodeListeners() {
        if (!this.trigger) return;

        this.trigger.removeEventListener( 'keydown', this.onTriggerKeydownBound);
        if(this.onTriggerClickBound){
            this.trigger.removeEventListener( 'click', this.onTriggerClickBound);
        }
        if(this.onTriggerHoverBound){
            this.trigger.removeEventListener( 'mouseover', this.onTriggerHoverBound);
        }
        this.domNode.removeEventListener( 'focusin', this.onFocusInBound);
        this.domNode.removeEventListener( 'focusout', this.onFocusOutBound);
    }


    /**
     * Updates available focusable elements inside the dropdown
     */
    updateFocusableElms(){
        this.initDropdownItems();
    }


    /**
     * Checks whether the dropdown is open
     * @returns  {boolean}
     */
    get isOpen() {
        if (!this.trigger) return false;
        return this.trigger.getAttribute('aria-expanded') === "true";
    }


    /**
     * Sets focus to a menu item.
     * @param  {Node} targetItem New target menu item
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
     * @returns  {Node} The newly focused item within the dropdown menu
     */
    #setFocusToPreviousItem(currentItem) {
        if(!this.dropdownItems || !this.firstItem || !this.lastItem) return currentItem;
        
        /** @type {Node} */
        let targetItem;
        let index;

        if (currentItem === this.firstItem) {
            targetItem = this.lastItem;
        } else {
            index = this.dropdownItems.indexOf(currentItem);
            targetItem = this.dropdownItems[index - 1];
        }

        this.setFocusToItem(targetItem);

        return targetItem;
    }


    /**
     * Sets focus to the next menu item
     * @param    {HTMLElement} currentItem Currently focused item within the dropdown menu
     * @returns  {Node} The newly focused item within the dropdown menu
     */
    #setFocusToNextItem(currentItem) {
        if(!this.dropdownItems || !this.firstItem || !this.lastItem) return currentItem;
        
        /** @type {Node} */
        let targetItem;
        let index;

        if (currentItem === this.lastItem) {
            targetItem = this.firstItem;
        } else {
            index = this.dropdownItems.indexOf(currentItem);
            targetItem = this.dropdownItems[index + 1];
        }
        this.setFocusToItem(targetItem);

        return targetItem;
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

        this.domNode.dispatchEvent(this.#events.beforeOpen);
        this.options.onBeforeOpen(this, e);

        const domNode = this.domNode;
        const dropdown = this.dropdown;
        const trigger = this.trigger;
        const openClass = this.options.openClass;
        const animatingClass = window.f11y.settings.animatingClass;
        const animatingOpenClass = window.f11y.settings.animatingOpenClass;
        trigger.setAttribute('aria-expanded', 'true');
        dropdown.setAttribute('aria-hidden', 'false');
        domNode.classList.add(openClass);

        this.addGlobalListeners();

        if (this.options.awaitOpenAnimation) {
            let animationCount = 0;

            function animationEndHandler(e){
                if( e.target === domNode || domNode.contains(e.target) ){
                    if( dropdown.contains(e.target) && e.target !== dropdown ) return;
                    
                    animationCount--;

                    if (animationCount === 0){
                        domNode.classList.remove(animatingClass, animatingOpenClass);

                        document.removeEventListener('animationend', animationEndHandler);
                        document.removeEventListener('animationstart', animationStartHandler);
                    }
                }
            }

            function animationStartHandler(e) {
                if( e.target === domNode || domNode.contains(e.target) ){
                    if( dropdown.contains(e.target) && e.target !== dropdown ) return;
                    animationCount++;
                }
            }

            document.addEventListener('animationstart', animationStartHandler);
            document.addEventListener('animationend', animationEndHandler);

            domNode.classList.add(animatingClass, animatingOpenClass);
        }

        this.initDropdownItems();
        this.dispatchStateUpdateEvent();
        this.domNode.dispatchEvent(this.#events.afterOpen);
        this.options.onAfterOpen(this, e);
    }


    /**
     * Closes the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    closeDropdown(e = null) {
        if(!this.trigger || !this.dropdown) return;

        if (this.isOpen) {
            this.domNode.dispatchEvent(this.#events.beforeClose);
            this.options.onBeforeClose(this, e);

            const domNode = this.domNode;
            const dropdown = this.dropdown;
            const trigger = this.trigger;
            const openClass = this.options.openClass;
            const animatingClass = window.f11y.settings.animatingClass;
            const animatingCloseClass = window.f11y.settings.animatingCloseClass;

            dropdown.setAttribute('aria-hidden', 'true');

            if (this.options.awaitCloseAnimation) {
                let animationCount = 0;

                domNode.classList.add(animatingClass, animatingCloseClass);

                /**
                 * Handle any when an animation ends within or on the this.domNode
                 * @param {AnimationEvent} e AnimationEvent object
                 * @returns 
                 */
                function animationEndHandler(e){
                    if( e.target === domNode || domNode.contains(e.target) ){
                        if( dropdown.contains(e.target) && e.target !== dropdown ) return;
                        
                        animationCount--;

                        if (animationCount === 0){
                            domNode.classList.remove(animatingClass, animatingCloseClass);
                            domNode.classList.remove(openClass);

                            document.removeEventListener('animationstart', animationStartHandler);
                            document.removeEventListener('animationend', animationEndHandler);
                        }
                    }
                }

                /**
                 * Handle any when an animation starts within or on the this.domNode
                 * @param {AnimationEvent} e AnimationEvent object
                 */
                function animationStartHandler(e) {
                    if( e.target === domNode || domNode.contains(e.target) ){
                        if( dropdown.contains(e.target) && e.target !== dropdown ) return;
                        animationCount++;
                    }
                }

                document.addEventListener('animationstart', animationStartHandler);
                document.addEventListener('animationend', animationEndHandler);

            } else{
                domNode.classList.remove(openClass);
            }

            trigger.removeAttribute('aria-expanded');

            this.dispatchStateUpdateEvent();
            this.domNode.dispatchEvent(this.#events.afterClose);
            this.options.onAfterClose(this, e);
        }

        this.resetBoundingBox();
        this.removeGlobalListeners();
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
                if(this.isOpen){
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
                if(this.isOpen){
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

        if (this.isOpen) {
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
     * Handles Trigger toggle hover event
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onTriggerHover(e = null){
        if(!e || !this.trigger) return;

        if(!this.isOpen){
            this.openDropdown(e);
            this.trigger
            this.checkBoundingBox();
            this.setFocusToFirstItem();

            let timer;

            const closeDropdown = this.closeDropdown.bind(this);
            const domNode = this.domNode;

            function handleDomNodeMouseOver(){
                clearTimeout(timer);
            }

            function handleDomNodeMouseOut(e){
                timer = setTimeout(() => {
                    closeDropdown(e);
                    domNode.removeEventListener('mouseout', handleDomNodeMouseOut);
                    domNode.removeEventListener('mouseover', handleDomNodeMouseOver);
                }, 650);
            }

            domNode.addEventListener('mouseout', handleDomNodeMouseOut, false);
            domNode.addEventListener('mouseover', handleDomNodeMouseOver, false);

            e.stopPropagation();
            e.preventDefault();
        }
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
                    if(tgt.href){
                        window.location.href = tgt.href;
                    }
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
            this.domNode.setAttribute('f11y-out-of-bounds', 'bottom');
            return;
        }
    
        if (dropdownBounds.top < 0) {
            this.domNode.setAttribute('f11y-out-of-bounds', 'top');
            return;
        }
    }


    /**
     * Resets any class name changes by checkBoundingBox()
     */
    resetBoundingBox() {
        this.domNode.removeAttribute('f11y-out-of-bounds');    
    }


    /**
     * Handles click events that are outside of the dropdown remit
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onBackgroundMousedown(e = null) {
        if(!e || !this.trigger || !this.dropdown) return;

        if (!this.domNode.contains(e.target) && this.options.closeOnBackgroundClick) {
            if (this.isOpen) {
                this.closeDropdown(e);
                this.trigger.focus();
            }
        }
    }
}

export default Dropdown