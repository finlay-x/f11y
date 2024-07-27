import '../../global/f11y.types';
import './dropdown.types';

/**
 * @todo Rework on item keydown
 * @todo Rework on item click
 * @todo Implement on item mouseover
 * @todo openFocusTarget
 * @todo closeFocusTarget
 * @todo Submenus
 */

class Dropdown {

    /** @type {Object} */ 
    #eventDetail;

    /** @type {DropdownEvents} */
    #events;

    /** @type {String[]} */ 
    #firstChars; 

    /** @type {Number} */
    #animationOpenCount;

    /** @type {Number} */
    #animationCloseCount;

    /**
     * @param  {HTMLElement} root The DOM element to initialise on
     * @param  {DropdownDefault} opts Optional params to modify functionality
     */
    constructor(root, opts) {
        /** @type {DropdownDefault} */
        const DEFAULTS = {
            onBeforeOpen: () => {},
            onAfterOpen: () => {},
            onBeforeClose: () => {},
            onAfterClose: () => {},
            // @ts-ignore
            openClass: window.f11y.settings.openClass,
            // @ts-ignore
            focusableElements: window.f11y.focusableElements,
            updateOnItemClick: false,
            updateSelectors: [],
            closeOnBackgroundClick: true,
            openOnTriggerClick: true,
            openOnTriggerHover: false,
            focusOnItemMouseOver: true,
            closeOnItemClick: false,
            closeOnLastItemBlur: false,
            loopItemFocus: true,
            arrowNavigation: true,
            tabNavigation: false,
            awaitOpenAnimation: false,
            awaitCloseAnimation: false,
            openOnArrowKeydown: true,
            setFocusOnOpen: true,
        }

        /** @type {DropdownDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {HTMLElement} */
        this.root = root;

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

        this.#firstChars = [];

        this.#animationOpenCount = 0;

        this.#animationCloseCount = 0;

        this.init();
    }

    init(){
        /** @type {HTMLElement|null} */
        this.trigger = this.root.querySelector('[aria-controls]');
        if(!this.trigger) return console.warn('Trigger element does not exist within: ', this.root);

        /** @type {string|null} */
        const ariaControls = this.trigger.getAttribute('aria-controls');
        if (!ariaControls) return console.warn(`aria-controls attribute is null for: `, this.trigger);

        /** @type {HTMLElement|null} */
        this.dropdown = document.getElementById(ariaControls);
        if(!this.dropdown) return console.warn('Dropdown element does not exist');
    
        // Bind Node Listeners
        this.onTriggerKeydownBound = this.#onTriggerKeydown.bind(this);
        this.onTriggerClickBound = this.#onTriggerClick.bind(this);
        this.onTriggerHoverBound = this.#onTriggerHover.bind(this);

        this.onRootFocusInBound = this.#onRootFocusin.bind(this);
        this.onRootFocusOutBound = this.#onRootFocusout.bind(this);

        // Bind Window Listeners
        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);
        this.checkBoundingBoxBound = this.checkBoundingBox.bind(this);
        this.updateFocusableElmsBound = this.updateFocusableElms.bind(this);

        this.addElementListeners();
        
        // @ts-ignore
        this.root.classList.add(window.f11y.settings.initialisedClass);
        
        window.dispatchEvent(this.#events.initialised);
        this.root.dispatchEvent(this.#events.initialised);
    }


    destroy(){
        this.closeDropdown();
        this.removeGlobalListeners();
        this.removeElementListeners();

        // @ts-ignore
        this.root.classList.remove(window.f11y.settings.initialisedClass);

        window.dispatchEvent(this.#events.destroyed);
        this.root.dispatchEvent(this.#events.destroyed);
    }


    initDropdownItems() {
        if (!this.dropdown) return;

        /** @type {Node[]} */
        this.dropdownItems = [];

        /** @type {String[]} */
        this.#firstChars = [];

        /** @type {Function[]} */
        this.itemKeydownHandlers = [];

        /** @type {Function[]} */
        this.itemMouseoverHandlers = [];

        /** @type {Function[]} */
        this.itemClickHandlers = [];

        const focusableElements = this.options.focusableElements;
        focusableElements.push('[role=menuitem]');

        this.dropdownItems = window.f11y.utils.getFocusable(this.dropdown, focusableElements);
        if (!this.dropdownItems) return;

        const itemKeydownHandler = this.#onItemKeydown.bind(this);
        const itemMouseoverHandler = this.#onItemMouseover.bind(this);
        const itemClickHandler = this.#onItemClick.bind(this);

        this.dropdownItems.forEach((item) => {
            item.tabIndex = -1;

            if(item.innerText){
                const firstChar = item.innerText.trim()[0].toLowerCase();
                if(firstChar && this.#firstChars) this.#firstChars.push(firstChar);
            }

            item.addEventListener('click', itemClickHandler);
            if(this.itemClickHandlers) this.itemClickHandlers.push(itemClickHandler);

            item.addEventListener('mouseover', itemMouseoverHandler);
            if(this.itemMouseoverHandlers) this.itemMouseoverHandlers.push(itemMouseoverHandler);

            item.addEventListener('keydown', itemKeydownHandler);
            if(this.itemKeydownHandlers) this.itemKeydownHandlers.push(itemKeydownHandler);

            /** @type {Node|null} */
            if (!this.firstItem) this.firstItem = item;

            /** @type {Node|null} */
            this.lastItem = item;
        });

        this.root.dispatchEvent(this.#events.initialisedItems);
    }

    dispatchStateUpdateEvent() {
        // @ts-ignore
        window.dispatchEvent(window.f11y.events.stateUpdate);
    }

    /**
     * Adds bound method window events 
     */
    addGlobalListeners() {
        if(this.onBackgroundMousedownBound) window.addEventListener('mousedown', this.onBackgroundMousedownBound);
        if(this.updateFocusableElmsBound) window.addEventListener('f11ystateupdate', this.updateFocusableElmsBound);
        if(this.checkBoundingBoxBound) window.addEventListener('resize', this.checkBoundingBoxBound);
        if(this.checkBoundingBoxBound) document.addEventListener('scroll', this.checkBoundingBoxBound);
    }

    /**
     * Removes bound methods window events 
     */
    removeGlobalListeners() {
        if(this.onBackgroundMousedownBound) window.removeEventListener('mousedown', this.onBackgroundMousedownBound);
        if(this.updateFocusableElmsBound) window.removeEventListener('f11yStateUpdate', this.updateFocusableElmsBound);
        if(this.checkBoundingBoxBound) window.removeEventListener('resize', this.checkBoundingBoxBound);
        if(this.checkBoundingBoxBound) document.removeEventListener('scroll', this.checkBoundingBoxBound);
    }


    /**
     * Adds bound methods to the elements
     */
    addElementListeners() {
        if (!this.trigger || !this.root) return;

        if(this.onTriggerKeydownBound) this.trigger.addEventListener( 'keydown', this.onTriggerKeydownBound);
        if(this.onTriggerClickBound) this.trigger.addEventListener( 'click', this.onTriggerClickBound);
        if(this.onTriggerHoverBound) this.trigger.addEventListener( 'mouseover', this.onTriggerHoverBound);

        if(this.onRootFocusInBound) this.root.addEventListener( 'focusin', this.onRootFocusInBound);
        if(this.onRootFocusOutBound) this.root.addEventListener( 'focusout', this.onRootFocusOutBound);
    }
    

    /**
     * Adds bound methods to the domNode elements
     */
    removeElementListeners() {
        if (!this.trigger) return;

        if(this.onTriggerKeydownBound) this.trigger.removeEventListener( 'keydown', this.onTriggerKeydownBound);
        if(this.onTriggerClickBound) this.trigger.removeEventListener( 'click', this.onTriggerClickBound);
        if(this.onTriggerHoverBound) this.trigger.removeEventListener( 'mouseover', this.onTriggerHoverBound);
        if(this.onRootFocusInBound) this.root.removeEventListener( 'focusin', this.onRootFocusInBound);
        if(this.onRootFocusOutBound) this.root.removeEventListener( 'focusout', this.onRootFocusOutBound);
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

        this.dropdownItems.forEach((item) => {
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
     * Sets focus to the next menu item
     * @param    {Node} currentItem Currently focused item within the dropdown menu
     * @param   {"forward"|"backward"} movement Moving focus forward or backward
     * @returns  {Node|undefined} The newly focused item within the dropdown menu
     */
    #incrementFocus(currentItem, movement) {
        if(!this.dropdownItems || !this.firstItem || !this.lastItem) return currentItem;

        // @ts-ignore
        window.f11y.utils.nextFocusable(
            currentItem,
            this.dropdownItems,
            this.firstItem,
            this.lastItem,
            movement,
            this.options.loopItemFocus,
            (/** @type {HTMLElement|Node} */ current) => this.setFocusToItem(current),
            () => {
                if(!this.options.closeOnLastItemBlur) return false;
                this.closeDropdown();
                return true;
            },
        );
    }


    /**
     * Sets focus by the the first character of a menu item
     * @param  {HTMLElement} currentItem Currently focused item within the dropdown menu
     * @param  {string} char The character to base the focus on
     */
    #setFocusByFirstChar(currentItem, char) {
        if (char.length > 1) return;
        if(!this.dropdownItems || !this.#firstChars) return;

        char = char.toLowerCase();

        let start = this.dropdownItems.indexOf(currentItem) + 1;
        if (start >= this.dropdownItems.length) start = 0;

        let index = this.#firstChars.indexOf(char, start);
        if (index === -1) index = this.#firstChars.indexOf(char, 0);

        if (index > -1) this.setFocusToItem(this.dropdownItems[index]);
    }


    /**
     * Handle any when an opening animation ends within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationOpeningEnd(e){
        if(!this.dropdown) return;

        if( e.target === this.root || this.root.contains(e.target) ){
            if(this.dropdown.contains(e.target) && e.target !== this.dropdown ) return;
            
            this.#animationOpenCount--;

            if (this.#animationOpenCount !== 0) return;

            // @ts-ignore
            this.root.classList.remove(window.f11y.settings.animatingClass, window.f11y.settings.animatingOpenClass);
            this.root.dispatchEvent(this.#events.afterOpen);
            this.options.onAfterOpen(this, e);

            if(this.handleAnimationOpeningStartBound) document.removeEventListener('animationstart', this.handleAnimationOpeningStartBound);
            if(this.handleAnimationOpeningEndBound) document.removeEventListener('animationend', this.handleAnimationOpeningEndBound);
        }
    }


    /**
     * Handle when an opening animation starts within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationOpeningStart(e){
        if(!this.dropdown) return;

        if( e.target === this.root || this.root.contains(e.target) ){
            if( this.dropdown.contains(e.target) && e.target !== this.dropdown ) return;
            this.#animationOpenCount++;
        }
    }


    /**
     * Handle when an opening animation gets cancelled within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationOpeningCancel(e){
        if(!this.dropdown) return;

        this.#animationOpenCount = 0;
        this.#animationCloseCount = 0;

        // @ts-ignore
        this.root.classList.remove(window.f11y.settings.animatingClass, window.f11y.settings.animatingOpenClass);
        this.root.dispatchEvent(this.#events.afterOpen);
        this.options.onAfterOpen(this, e);

        if(this.handleAnimationOpeningStartBound) document.removeEventListener('animationstart', this.handleAnimationOpeningStartBound);
        if(this.handleAnimationOpeningEndBound) document.removeEventListener('animationend', this.handleAnimationOpeningEndBound);
        if(this.handleAnimationOpeningCancelBound) document.removeEventListener('animationcancel', this.handleAnimationOpeningCancelBound);
    }


    /**
     * Opens the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    openDropdown(e = null) {
        if(!this.trigger || !this.dropdown) return;

        if(this.root.classList.contains('is-closing')) this.#handleAnimationClosingCancel(e);

        this.#animationOpenCount = 0;
        this.#animationCloseCount = 0;

        this.root.dispatchEvent(this.#events.beforeOpen);
        this.options.onBeforeOpen(this, e);
        
        this.trigger.setAttribute('aria-expanded', 'true');
        this.dropdown.setAttribute('aria-hidden', 'false');
        this.root.classList.add(this.options.openClass);
        this.addGlobalListeners();

        if (this.options.awaitOpenAnimation) {
            this.handleAnimationOpeningStartBound = this.#handleAnimationOpeningStart.bind(this);
            this.handleAnimationOpeningEndBound = this.#handleAnimationOpeningEnd.bind(this);
            this.handleAnimationOpeningCancelBound = this.#handleAnimationOpeningCancel.bind(this);

            document.addEventListener('animationstart', this.handleAnimationOpeningStartBound);
            document.addEventListener('animationend', this.handleAnimationOpeningEndBound);
            document.addEventListener('animationcancel', this.handleAnimationOpeningCancelBound);

            // @ts-ignore
            this.root.classList.add(window.f11y.settings.animatingClass, window.f11y.settings.animatingOpenClass);
        } else {
            this.root.dispatchEvent(this.#events.afterOpen);
            this.options.onAfterOpen(this, e);
        }

        this.initDropdownItems();
        this.dispatchStateUpdateEvent();
    }


    /**
     * Handle any when an closing animation ends within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationClosingEnd(e){
        if(!this.dropdown) return;

        if( e.target === this.root || this.root.contains(e.target) ){
            if( this.dropdown.contains(e.target) && e.target !== this.dropdown ) return;
            
            this.#animationCloseCount--;

            if (this.#animationCloseCount !== 0) return;

            // @ts-ignore
            this.root.classList.remove(window.f11y.settings.animatingClass, window.f11y.settings.animatingCloseClass)
            this.root.classList.remove(this.options.openClass);
            this.dropdown.setAttribute('aria-hidden', 'true');

            this.root.dispatchEvent(this.#events.afterClose);
            this.options.onAfterClose(this, e);

            if(this.handleAnimationClosingStartBound) document.removeEventListener('animationstart', this.handleAnimationClosingStartBound);
            if(this.handleAnimationClosingEndBound) document.removeEventListener('animationend', this.handleAnimationClosingEndBound);
        }
    }

    /**
     * Handle when an closing animation starts within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationClosingStart(e){
        if(!this.dropdown) return;

        if( e.target === this.root || this.root.contains(e.target) ){
            if( this.dropdown.contains(e.target) && e.target !== this.dropdown ) return;
            this.#animationCloseCount++;
            console.log(this.#animationCloseCount);
        }
    }


    /**
     * Handle when an closing animation gets cancelled within or on the this.domNode
     * @param {AnimationEvent} e AnimationEvent object
     */
    #handleAnimationClosingCancel(e){
        if(!this.dropdown) return;

        this.#animationOpenCount = 0;
        this.#animationCloseCount = 0;

        // @ts-ignore
        this.root.classList.remove(window.f11y.settings.animatingClass, window.f11y.settings.animatingCloseClass)
        this.root.classList.remove(this.options.openClass);
        this.dropdown.setAttribute('aria-hidden', 'true');

        this.root.dispatchEvent(this.#events.afterClose);
        this.options.onAfterClose(this, e);

        if(this.handleAnimationClosingStartBound) document.removeEventListener('animationstart', this.handleAnimationClosingStartBound);
        if(this.handleAnimationClosingEndBound) document.removeEventListener('animationend', this.handleAnimationClosingEndBound);
        if(this.handleAnimationClosingCancelBound) document.removeEventListener('animationcancel', this.handleAnimationClosingCancelBound);
    }


    /**
     * Closes the dropdown
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    closeDropdown(e = null) {
        if(!this.trigger || !this.dropdown) return;

        this.#animationOpenCount = 0;
        this.#animationCloseCount = 0;

        if (this.isOpen) {
            this.root.dispatchEvent(this.#events.beforeClose);
            this.options.onBeforeClose(this, e);

            this.trigger.removeAttribute('aria-expanded');

            if (this.options.awaitCloseAnimation) {
                // @ts-ignore
                this.root.classList.add(window.f11y.settings.animatingClass, window.f11y.settings.animatingCloseClass);

                this.handleAnimationClosingStartBound = this.#handleAnimationClosingStart.bind(this);
                this.handleAnimationClosingEndBound = this.#handleAnimationClosingEnd.bind(this);
                this.handleAnimationClosingCancelBound = this.#handleAnimationClosingCancel.bind(this);
    
                document.addEventListener('animationstart', this.handleAnimationClosingStartBound);
                document.addEventListener('animationend', this.handleAnimationClosingEndBound);
                document.addEventListener('animationcancel', this.handleAnimationClosingCancelBound);

            } else{
                this.root.classList.remove(this.options.openClass);
                this.dropdown.setAttribute('aria-hidden', 'true');

                this.root.dispatchEvent(this.#events.afterClose);
                this.options.onAfterClose(this, e);
            }
            
            this.dispatchStateUpdateEvent();
        }

        this.resetBoundingBox();
        this.removeGlobalListeners();
    }

    /**
     * Handles focus of Dropdown
     */
    #onRootFocusin() {
        this.root.classList.add('has-focus');
    }

    /**
     * Handles lose of focus on Dropdown
     */
    #onRootFocusout() {
        this.root.classList.remove('has-focus');
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
                this.openDropdown(e);
                this.checkBoundingBox();
                if(this.options.setFocusOnOpen) this.setFocusToFirstItem();
                flag = true;
            break;

            case 'ArrowDown':
            case 'Down':
                if(this.options.openOnArrowKeydown){
                    this.openDropdown(e);
                    this.checkBoundingBox();
                    if(this.options.setFocusOnOpen) this.setFocusToFirstItem();
                    flag = true;
                }
            break;

            case 'Up':
            case 'ArrowUp':
                if(this.options.openOnArrowKeydown){
                    this.openDropdown(e);
                    this.checkBoundingBox();
                    if(this.options.setFocusOnOpen) this.setFocusToLastItem();
                    flag = true;
                }
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

        let flag = false;

        if(this.options.openOnTriggerClick){
            if (this.isOpen) {
                this.closeDropdown(e);
                this.trigger.focus();
            } else {
                this.openDropdown(e);
                this.checkBoundingBox();
                this.setFocusToFirstItem();
            }

            flag = true;
        }

        if (flag) {
            e.stopPropagation();
            e.preventDefault();
        }
    }


    /**
     * Handles Trigger toggle hover event
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onTriggerHover(e = null){
        if(!e || !this.trigger) return;

        if(!this.isOpen && this.options.openOnTriggerHover){
            this.openDropdown(e);
            this.checkBoundingBox();
            this.setFocusToFirstItem();

            /** @type {NodeJS.Timeout} */
            let timer;

            /** @param {Event|KeyboardEvent|null} e */
            const closeDropdown = (e) => this.closeDropdown(e);
            const root = this.root;

            function handleDomNodeMouseOver(){
                clearTimeout(timer);
            }

            /** @param {Event|KeyboardEvent|null} e */
            function handleDomNodeMouseOut(e){
                timer = setTimeout(() => {
                    closeDropdown(e);
                    root.removeEventListener('mouseout', handleDomNodeMouseOut);
                    root.removeEventListener('mouseover', handleDomNodeMouseOver);
                }, 650);
            }

            root.addEventListener('mouseout', handleDomNodeMouseOut, false);
            root.addEventListener('mouseover', handleDomNodeMouseOver, false);

            e.stopPropagation();
            e.preventDefault();
        }
    }


    /**
     * Handles keydown events on items
     * @param  {KeyboardEvent|null} e The event that triggered this method
     */
    #onItemKeydown(e = null) {
        if(!e || !this.trigger || !e.currentTarget) return;

        /** @type {HTMLElement} */
        const tgt =  e.currentTarget;
        const key = e.key;
        let flag = false;

        if (e.ctrlKey || e.altKey || e.metaKey) return;

        if (e.shiftKey) {
            // @ts-ignore
            if (window.f11y.utils.isPrintableChar(key) && !window.f11y.utils.isInputable(tgt)) {
                this.#setFocusByFirstChar(tgt, key);
                flag = true;
            } else{
                flag = false;
            }

            if (e.key === 'Tab') {
                if(this.options.tabNavigation){
                    this.#incrementFocus(tgt, "backward");
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
                    }else{
                        this.#onItemClick(e);
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
                    if(this.options.arrowNavigation) this.#incrementFocus(tgt, "backward");
                    flag = true;
                    break;

                case 'ArrowDown':
                case 'Down':
                    if(this.options.arrowNavigation) this.#incrementFocus(tgt, "forward");
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
                        this.#incrementFocus(tgt, "forward");
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
                    // @ts-ignore
                    if (window.f11y.utils.isPrintableChar(key) && !isInputElement(tgt)) {
                        this.#setFocusByFirstChar(tgt, key);
                        flag = true;
                    } else{
                        flag = false;
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
     * Handles mouseover events on items
     * @param {*} e 
     */
    #onItemMouseover(e = null) {

    }


    /**
     * Handles click events on items
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onItemClick(e = null) {
        if (this.options.updateOnItemClick === true) {
            /*
            if(e && e.currentTarget && this.options.updateSelector) {
                const updateTargets = document.querySelectorAll(this.options.updateSelector);
                updateTargets.forEach(function (updateTarget) {
                    updateTarget.textContent = e.currentTarget.textContent;
                });
            } else{
                if(e && e.currentTarget && this.trigger){
                    this.trigger.textContent = e.currentTarget.textContent;
                }
            }
            */
        }

        if(this.options.closeOnItemClick === true && this.trigger) {
            this.closeDropdown(e);
            this.trigger.focus();
        }
    }


    /**
     * Checks the bounding box of the dropdown element against the window bounds
     * @param {*} y 
     * @param {*} x 
     */
    checkBoundingBox(y = true, x = true) {
        if(!this.dropdown) return;

        let dropdownBounds = this.dropdown.getBoundingClientRect();

        if(y) this.#checkYBounding(dropdownBounds);
        
        if(x) this.#checkXBounding(dropdownBounds);
    }


    /**
     * 
     * @param {*} boundingRect
     */
    #checkYBounding(boundingRect){
        if(boundingRect.bottom > window.innerHeight && boundingRect.top < 0){
            this.root.setAttribute('f11y-collision-y', 'both');
            return;
        }

        if(boundingRect.bottom > window.innerHeight) {
            this.root.setAttribute('f11y-collision-y', 'bottom');
            return;
        }
    
        if(boundingRect.top < 0) {
            this.root.setAttribute('f11y-collision-y', 'top');
            return;
        }
    }


    /**
     * 
     * @param {*} boundingRect 
     */
    #checkXBounding(boundingRect){

    }


    /**
     * Resets any class name changes by checkBoundingBox()
     * @param {*} y 
     * @param {*} x 
     */
    resetBoundingBox(y = true, x = true) {
        if(y) this.root.removeAttribute('f11y-collision-y');
        if(x) this.root.removeAttribute('f11y-collision-x');
    }


    /**
     * Handles click events that are outside of the dropdown remit
     * @param  {Event|KeyboardEvent|null} e The event that triggered this method
     */
    #onBackgroundMousedown(e = null) {
        if(!e || !this.trigger || !this.dropdown) return;

        if (!this.root.contains(e.target) && this.options.closeOnBackgroundClick) {
            if (this.isOpen) {
                this.closeDropdown(e);
                this.trigger.focus();
            }
        }
    }
}

export default Dropdown