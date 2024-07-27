import '../../global/f11y.types';
import './accordion.types';
import f11yConsole from '../../utils/f11yConsole';

class Accordion {

    #eventDetail;
    #events;

    /** @type {HTMLElement[]} */
    #triggers;

    /** @type {Function[]} */
    #toggleHandlers;

    /** @type {Function[]} */
    #keydownHandlers;

    /**
     * @param {HTMLElement} root - The DOM element to initialise on
     * @param {AccordionDefault} opts - Optional params to modify functionality
     */
    constructor(root, opts) {
        
        /** @type {AccordionDefault}*/
        const DEFAULTS = {
            onBeforeOpen: () => {},
            onAfterOpen: () => {},
            onBeforeClose: () => {},
            onAfterClose: () => {},
            // @ts-ignore
            openClass: window.f11y.settings.openClass,
            itemSelector: '[f11y-accordion-item]',
            contentSelector: '[f11y-accordion-content]',
            keyboardNavigation: false,
            orientation: "vertical",
            type: "single",
            collapsible: false
        };

        /** @type {AccordionDefault}*/
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {HTMLElement} The passed root */
        this.root = root;

        this.#triggers = [];
        this.#toggleHandlers = [];
        this.#keydownHandlers = [];

        this.#eventDetail = { detail: { component: this } };
        this.#events = {
            initialised: new CustomEvent( 'f11yinit', this.#eventDetail ),
            initialisedItem: new CustomEvent( 'f11yinititem', this.#eventDetail ),
            destroyed: new CustomEvent( 'f11ydestroyed', this.#eventDetail ),
            beforeOpen: new CustomEvent( 'f11ybeforeopen', this.#eventDetail ),
            afterOpen: new CustomEvent( 'f11yafteropen', this.#eventDetail ),
            beforeClose: new CustomEvent( 'f11ybeforeclose', this.#eventDetail ),
            afterClose: new CustomEvent( 'f11yafterclose', this.#eventDetail )
        };

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        if(this.options.type === "multiple") this.options.collapsible = true;

        /** @type {AccordionItemObject[]} */
        this.items = [];

        /** @type {HTMLElement[]} */
        const items = Array.from(this.root.querySelectorAll(this.options.itemSelector));

        for (let i = 0; i < items.length; i += 1) {
            /** @type {HTMLElement} */
            const item = items[i];
            
            this.initItem(item, i);
        }
        
        // @ts-ignore
        this.root.classList.add(window.f11y.settings.initialisedClass);

        window.dispatchEvent(this.#events.initialised);
        this.root.dispatchEvent(this.#events.initialised);
    }

    /**
     * 
     * @param {HTMLElement} item 
     * @param {Number} i
     * @returns {AccordionItemObject|undefined}
     */
    initItem(item, i){
        const disabled = item.getAttribute('aria-disabled');

        /** @type {HTMLElement|null} */
        const trigger = item.querySelector("[aria-controls]");
        if (!trigger) {
            f11yConsole(`Trigger is not defined.`);
            return;
        }

        if(disabled === "true") trigger.setAttribute('disabled', '');
        if(!disabled) this.#triggers.push(trigger);

        /** @type {string|null} */
        const ariaControls = trigger.getAttribute('aria-controls');

        if (!ariaControls) {
            f11yConsole(`aria-controls attribute is not defined.`);
            return;
        }

        /** @type {string|null} */
        const ariaExpanded = trigger.getAttribute('aria-expanded');
        const openClass = item.classList.contains(this.options.openClass);

        let openState = false;

        if(openClass || ariaExpanded === "true"){
            trigger.setAttribute('aria-expanded', 'true');
            item.classList.add(this.options.openClass);
            openState = true;
        }
    
        /** @type {HTMLElement|null} */
        const panel = document.getElementById(ariaControls);

        if(!panel){
            f11yConsole(`Panel is not defined`);
            return;
        }

        /** @type {HTMLElement|null} */
        const panelContent = panel.querySelector(this.options.contentSelector);

        if(!panelContent){
            f11yConsole(`Panel Content is not defined within panel element`);
            return;
        }
        
        /** @type {AccordionItemObject} Stores item information */
        const itemObj = {
            id: i,
            item: item,
            panel: panel,
            panelContent: panelContent,
            disabled: disabled,
            trigger: trigger,
            isOpen: openState,
        };

        console.log(itemObj);

        if(this.items) this.items.push(itemObj);

        /**
         * Handler for toggle event.
         * @param {Event} e
         */
        const toggleHandler = (e) => this.toggle(itemObj, e);
        trigger.addEventListener("click", toggleHandler);
        if(this.#toggleHandlers) this.#toggleHandlers.push(toggleHandler);

        /**
         * Handler for toggle event.
         * @param {KeyboardEvent} e
         */
        const keydownHandler = (e) => this.#onTriggerKeydown(e);
        trigger.addEventListener("keydown", keydownHandler);
        if(this.#keydownHandlers) this.#keydownHandlers.push(keydownHandler);

        item.dispatchEvent(this.#events.initialisedItem);

        return itemObj;
    }


    /**
     * Removes event listeners, clears member arrays and resets DOM changes e.g. class names
     */
    destroy(){
        // @ts-ignore
        this.root.classList.remove(window.f11y.settings.initialisedClass);

        if(!this.#toggleHandlers || !this.items) return;

        for (let i = 0; i < this.#toggleHandlers.length; i++) {
            const trigger = this.items[i].trigger;
            const toggleHandler = this.#toggleHandlers[i];
            if(trigger && toggleHandler) trigger.removeEventListener("click", toggleHandler);
        }

        for (let i = 0; i < this.#keydownHandlers.length; i++) {
            const trigger = this.items[i].trigger;
            const keydownHandler = this.#keydownHandlers[i];
            if(trigger && keydownHandler) trigger.removeEventListener("keydown", keydownHandler);
        }

        this.items = [];
        this.#toggleHandlers = [];
        this.#keydownHandlers = [];
        
        window.dispatchEvent(this.#events.destroyed);
        this.root.dispatchEvent(this.#events.destroyed);
    }


    dispatchStateUpdateEvent() {
        // @ts-ignore
        window.dispatchEvent(window.f11y.events.stateUpdate);
    }

    /**
     * Toggles passed accordion item.
     * @param  {AccordionItemObject} item Object that represents a singular accordion item.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    toggle(item, event = null) {
        const isOpen = item.isOpen;
        const disabled = item.disabled;
        const collapse = this.options.collapsible;
        const type = this.options.type;

        if(isOpen === true && collapse === false || disabled === true) return;

        if(type === "single") this.closeAll(event);

        if (isOpen === false) {
            this.openItem(item, event);
            return;
        }

        if(isOpen === true){
            if(type === "multiple" || type === "single" && collapse === true){
                this.closeItem(item, event);
                return;
            }
        }
    }

    /**
     * Closes all accordion items.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    closeAll(event = null) {
        if (!this.items) return;

        for (let i = 0; i < this.items.length; i += 1) {
            if (this.items[i].isOpen === true) {
                this.closeItem(this.items[i], event);
            }
        }
    }

    /**
     * Opens all accordion items.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    openAll(event = null) {
        if (this.options.type === "single" || !this.items) return;

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
        if(item.isOpen === true) return;

        let height = item.panelContent.offsetHeight + 'px';

        this.root.dispatchEvent(this.#events.beforeOpen);
        this.options.onBeforeOpen(this, event, item);

        item.item.style.setProperty('--f11y-accordion-content-height', height);

        item.item.classList.add(this.options.openClass);
        item.trigger.setAttribute("aria-expanded", "true");
        item.isOpen = true;

        if(this.options.collapsible === false) item.trigger.setAttribute('aria-disabled','true');

        this.dispatchStateUpdateEvent();
        this.root.dispatchEvent(this.#events.afterOpen);
        this.options.onAfterOpen(this, event, item);
    }

    /**
     * Closes the passed accordion item.
     * @param  {AccordionItemObject} item Object that represents a singular accordion item.
     * @param  {Event|KeyboardEvent|null} event The event that triggered this function method.
     */
    closeItem(item, event = null) {
        if(item.isOpen === false || !item) return;

        const height = item.panelContent.offsetHeight + 'px';
        
        this.root.dispatchEvent(this.#events.beforeClose);
        this.options.onBeforeClose(this, event, item);

        item.item.style.setProperty('--f11y-accordion-content-height', height);

        item.item.classList.remove(this.options.openClass);
        item.trigger.setAttribute("aria-expanded", "false");
        item.isOpen = false;

        item.trigger.removeAttribute('aria-disabled');
 
        this.dispatchStateUpdateEvent();
        this.root.dispatchEvent(this.#events.afterClose);
        this.options.onAfterClose(this, event, item);
    }

    /**
     * Checks whether the layer is open
     * @param {HTMLElement} trigger Element Node to move focus to
     */
    setFocusToItem(trigger) {
        trigger.focus();
    }

    /**
     * Sets Focus to the first focusable item inside the layer
     */
    setFocusToFirstItem() {
        this.setFocusToItem(this.#triggers[0]);
    }

    setFocusToLastItem() {
        this.setFocusToItem(this.#triggers.at(-1));
    }

    /**
     * Sets focus to the next menu item
     * @param    {Node} currentItem Currently focused item within the dropdown menu
     * @param   {"forward"|"backward"} movement Moving focus forward or backward
     */
    #incrementFocus(currentItem, movement) {
        // @ts-ignore
        window.f11y.utils.nextFocusable(
            currentItem,
            this.#triggers,
            this.#triggers[0],
            this.#triggers.at(-1),
            movement,
            true,
            (/** @type {HTMLElement} */ current) => this.setFocusToItem(current),
            () => {},
        );
    }

    /**
     * Handles keydown events on items
     * @param  {KeyboardEvent|null} e The event that triggered this method
     */
    #onTriggerKeydown(e = null) {
        if(!e || !e.currentTarget) return;

        /** @type {HTMLElement} */
        const tgt =  e.currentTarget;
        const keyNav = this.options.keyboardNavigation;
        const orientation = this.options.orientation;
        const key = e.key;
        let flag = false;

        if (e.ctrlKey || e.altKey || e.metaKey) return;
        
        switch (key) {
            case 'Up':
            case 'ArrowUp':
                if(keyNav === true && orientation === "vertical"){
                    this.#incrementFocus(tgt, "backward");
                    flag = true;
                }
                break;

            case 'ArrowDown':
            case 'Down':
                if(keyNav === true && orientation === "vertical"){
                    this.#incrementFocus(tgt, "forward");
                    flag = true;
                }
                break;

            case 'Right':
            case 'ArrowRight':
                if(keyNav === true && orientation === "horizontal"){
                    this.#incrementFocus(tgt, "forward");
                    flag = true;
                }
                break;

            case 'ArrowLeft':
            case 'Left':
                if(keyNav === true && orientation === "horizontal"){
                    this.#incrementFocus(tgt, "backward");
                    flag = true;
                }
                break;

            case 'Home':
            case 'PageUp':
                if(this.options.keyboardNavigation) this.setFocusToFirstItem();
                flag = true;
                break;

            case 'End':
            case 'PageDown':
                if(this.options.keyboardNavigation) this.setFocusToLastItem();
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
}

export default Accordion