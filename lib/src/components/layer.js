import { f11y } from '../main/f11y';
import { getStore , updateStore} from '../global/store';
import { isSet } from '../utils/isSet';

f11y.Layer = class Layer {
    /**
     * @param {HTMLElement | Element} domNode 
     * @param {Object} opts 
     */
    constructor (domNode, opts) {
        
        /** @type {LayerDefault} */
        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            openTriggerAttribute: 'f11y-layer-open',
            closeTriggerAttribute: 'f11y-layer-close',
            openClass: f11y.settings.openClass,
            focusableElements: f11y.focusableElements,
            disableScroll: true,
            closeOnBackgroundClick: true,
            closeOnEscClick: true,
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
        this.focusableElms = Array.from(this.domNode.querySelectorAll(this.options.focusableElements));

        if(isSet(this.dialog) === false){
            console.warn('Dialog element is not defined in passsed domNode');
            return;
        }

        this.filterFocusableElms();

        this.openLayerBound = this.openLayer.bind(this);

        for (let i = 0; i < this.triggerElms.length; i++) {
            this.triggerElms[i].addEventListener( 'click', this.openLayerBound, true);
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

        this.domNode.classList.add(f11y.settings.initialisedClass);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh(){
        this.domNode.setAttribute('aria-hidden', 'true');
        this.dialog.setAttribute('aria-modal', 'true');
        this.dialog.setAttribute('role', 'dialog');
        this.init();
    }

    /**
     * Destroys the layer object
     */
    destroy(){
        this.closeLayer();
        this.domNode.removeAttribute('aria-hidden');
        this.dialog.removeAttribute('aria-modal');
        this.dialog.removeAttribute('role');
        this.domNode.classList.remove(f11y.settings.initialisedClass);
        for (let i = 0; i < this.triggerElms.length; i++) {
            this.triggerElms[i].removeEventListener( 'click', this.openLayerBound, true);
        }
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
        const animatingClass = f11y.settings.animatingClass;
        const animatingOpenClass = f11y.settings.animatingOpenClass;

        domNode.setAttribute('aria-hidden', 'false');
        domNode.classList.add(openClass);

        this.options.disableScroll ? docBody.style.setProperty('overflow', 'hidden') : '';

        if(this.options.awaitOpenAnimation){
            domNode.addEventListener('animationend', handler);
            domNode.classList.add(animatingClass, animatingOpenClass);

            function handler(){
                let computedStyle = window.getComputedStyle(domNode);
                if (computedStyle.animationName !== 'none') return;

                domNode.classList.remove(animatingClass, animatingOpenClass);
                domNode.removeEventListener('animationend', handler);
            }
        }

        this.setFocusToFirstElm();
        this.addGlobalListeners();

        updateStore({ activeLayer: this.id });
        let activeLayers = getStore(f11y).activeLayers;
        activeLayers.push(this.id);
        updateStore({ activeLayers: activeLayers });

        this.options.onOpen(this, e);
    }

    /**
     * Closes the layer
     * @param {Event | KeyboardEvent | null} e The event object that triggered the method
     */
    closeLayer(e = null){
        if(this.isOpen()){
            if(this.id != getStore(f11y).activeLayer) return;

            const domNode = this.domNode;
            const docBody = document.querySelector('body');
            const openClass = this.options.openClass;
            const animatingClass = f11y.settings.animatingClass;
            const animatingCloseClass = f11y.settings.animatingCloseClass;

            let activeLayers = getStore(f11y).activeLayers;
            const i = activeLayers.indexOf(this.id);
            activeLayers.splice(i, 1);
            updateStore({activeLayer: activeLayers[activeLayers.length - 1]});
            updateStore({activeLayers: activeLayers});

            domNode.setAttribute('aria-hidden', 'true');

            if(this.activeElm && this.activeElm.focus) this.activeElm.focus();

            if(this.options.awaitCloseAnimation){
                domNode.addEventListener('animationend', handler);
                domNode.classList.add(animatingClass, animatingCloseClass);

                function handler() {
                    let computedStyle = window.getComputedStyle(domNode);
                    if (computedStyle.animationName !== 'none') return;

                    domNode.classList.remove(animatingClass, animatingCloseClass);
                    domNode.classList.remove(openClass);

                    if(getStore(f11y).activeLayers <= 0) docBody.style.removeProperty('overflow');
                
                    domNode.removeEventListener('animationend', handler);
                }
            } else {
                domNode.classList.remove(openClass);
                getStore(f11y).activeLayers <= 0 ? docBody.style.removeProperty('overflow') : '';
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
                    if(!this.options.closeOnEscClick) {
                        flag = false;
                    }else{
                        this.closeLayer(e);
                        flag = true;
                    }
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