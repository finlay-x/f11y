import { f11y } from '../main/f11y';
import { isSet } from '../utils/isSet';

f11y.Accordion = class Accordion {
    /**
     * @param {HTMLElement | Element} domNode - The DOM element to initialise on
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
        /** @type {Array.<Function>} */
        this.toggleHandlers = [];

        const items = Array.from(this.domNode.querySelectorAll(this.options.itemSelector));
        for (let i = 0; i < items.length; i += 1) {
            const item = items[i];
            const trigger = items[i].querySelector("[aria-controls]");

            if(isSet(trigger) === false){
                console.warn('Trigger is not defined in' + items[i]);
                continue;
            }
        
            const panel = document.getElementById(trigger.getAttribute('aria-controls'));

            if(isSet(panel) === false){
                console.warn('Panel is not defined in' + items[i]);
                continue;
            }
            
            /** @type {AccordionItemObject} Stores item information */
            const itemArr = this.initItem(item, trigger, panel, i);

            const toggleHandler = (event) => this.toggle(itemArr, event);
            trigger.addEventListener("click", toggleHandler);

            this.toggleHandlers.push(toggleHandler);
        }
        
        this.domNode.classList.add(f11y.settings.initialisedClass);
    }

    /**
     * 
     * @param {Element} item 
     * @param {Element|null} trigger 
     * @param {Element|null} panel 
     * @param {number} i 
     * @returns {Element}
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
        this.domNode.classList.remove(f11y.settings.initialisedClass);
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
