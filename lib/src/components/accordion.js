import '../global/typedefs';

class Accordion {
    /**
     * @param {HTMLElement} domNode - The DOM element to initialise on
     * @param {Object} opts - Optional params to modify functionality
     */
    constructor(domNode, opts) {
        
        /** @type {AccordionDefault}*/
        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            itemSelector: '[f11y-accordion-item]',
            showMultiple: true,
        };

        /** @type {AccordionDefault}*/
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {HTMLElement} The passed domNode */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        /** @type {AccordionItemObject[]} */
        this.items = [];
        
        /** @type {Function[]} */
        this.toggleHandlers = [];

        /** @type {HTMLElement[]} */
        const items = Array.from(this.domNode.querySelectorAll(this.options.itemSelector));

        for (let i = 0; i < items.length; i += 1) {
            /** @type {HTMLElement} */
            const item = items[i];

            /** @type {HTMLElement|null} */
            const trigger = item.querySelector("[aria-controls]");

            if (!trigger) {
                console.warn(`Trigger is not defined for item at index ${i}:`, item);
                continue;
            }

            /** @type {string|null} */
            const ariaControls = trigger.getAttribute('aria-controls');

            if (!ariaControls) {
                console.warn(`aria-controls attribute is null for item at index ${i}:`, item);
                continue;
            }
        
            /** @type {HTMLElement|null} */
            const panel = document.getElementById(ariaControls);

            if(!panel){
                console.warn(`Panel is not defined for item at index ${i}:`, item);
                continue;
            }
            
            this.initItem(item, trigger, panel, i);
        }
        
        this.domNode.classList.add(window.f11y.settings.initialisedClass);
    }

    /**
     * 
     * @param {HTMLElement} item 
     * @param {HTMLElement} trigger 
     * @param {HTMLElement} panel 
     * @param {number} i 
     * @returns {AccordionItemObject|undefined}
     */
    initItem(item, trigger, panel, i){
        if(!item || !trigger || !panel || !i || !this.items || !this.toggleHandlers) return;

        /** @type {string|null} */
        const ariaExpanded = trigger.getAttribute('aria-expanded');

        if (!ariaExpanded) {
            console.warn(`aria-expanded attribute is not set for:`, item , trigger);
            return;
        }
        
        /** @type {AccordionItemObject} Stores item information */
        const itemObj = {
            index: i,
            item: item,
            panel: panel,
            trigger: trigger,
            isOpen: ariaExpanded,
        };

        itemObj.isOpen === "true" ? panel.removeAttribute('hidden') : panel.setAttribute('hidden', '');
        this.items.push(itemObj);

        /**
         * Handler for toggle event.
         * @param {Event} event
         */
        const toggleHandler = (event) => this.toggle(itemObj, event);
        trigger.addEventListener("click", toggleHandler);
        this.toggleHandlers.push(toggleHandler);

        return itemObj;
    }

    /**
     * Removes event listeners, clears member arrays and resets DOM changes e.g. class names
     */
    destroy(){
        this.domNode.classList.remove(window.f11y.settings.initialisedClass);

        if(!this.toggleHandlers || !this.items) return;

        for (let i = 0; i < this.toggleHandlers.length; i++) {
            const trigger = this.items[i].trigger;
            const toggleHandler = this.toggleHandlers[i];
            trigger.removeEventListener("click", toggleHandler);
        }
        this.items = [];
        this.toggleHandlers = [];
        
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
        if (!this.items) return;

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
        if (this.options.showMultiple === false || !this.items) return;

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
        if(!item) return;

        item.panel.setAttribute("hidden", "");
        item.trigger.setAttribute("aria-expanded", "false");
        item.isOpen = "false";

        this.options.onClose(item, this, event);
    }
}

export default Accordion