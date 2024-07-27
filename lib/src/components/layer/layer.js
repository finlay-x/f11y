import '../../global/f11y.types';
import './layer.types';

/**
 * @todo modal and non-modal modes
 * @todo openFocusTarget
 * @todo closeFocusTarget
 */

class Layer {

    #eventDetail;
    #events;
    
    /**
     * @param {HTMLElement} domNode 
     * @param {LayerDefault} opts 
     */
    constructor (domNode, opts) {
        
        /** @type {LayerDefault} */
        const DEFAULTS = {
            onBeforeOpen: () => {},
            onAfterOpen: () => {},
            onBeforeClose: () => {},
            onAfterClose: () => {},
            openTriggerAttribute: 'f11y-layer-open',
            closeTriggerAttribute: 'f11y-layer-close',
            // @ts-ignore
            openClass: window.f11y.settings.openClass,
            // @ts-ignore
            focusableElements: window.f11y.focusableElements,
            disableScroll: true,
            closeOnBackgroundClick: true,
            closeOnEscClick: true,
            awaitCloseAnimation: false,
            awaitOpenAnimation: false,
        }

        /** @type {LayerDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {HTMLElement} */
        this.domNode = domNode;

        this.#eventDetail = { detail: { component: this } };
        this.#events = {
            initialised: new CustomEvent( 'f11yinit', this.#eventDetail ),
            destroyed: new CustomEvent( 'f11ydestroyed', this.#eventDetail ),
            beforeOpen: new CustomEvent( 'f11ybeforeopen', this.#eventDetail ),
            afterOpen: new CustomEvent( 'f11yafteropen', this.#eventDetail ),
            beforeClose: new CustomEvent( 'f11ybeforeclose', this.#eventDetail ),
            afterClose: new CustomEvent( 'f11yafterclose', this.#eventDetail )
        };

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

        /** @type {HTMLElement[]} */
        this.focusableElms = Array.from(this.domNode.querySelectorAll(this.options.focusableElements));

        if(!this.dialog){
            console.warn('Dialog element is not defined in passsed domNode');
            return;
        }

        this.filterFocusableElms();

        this.openLayerBound = this.openLayer.bind(this);

        for (let i = 0; i < this.triggerElms.length; i++) {
            this.triggerElms[i].addEventListener( 'click', this.openLayerBound, true);
        }

        for (let i = 0; i < this.focusableElms.length; i++) {
            if (!this.firstElm) {
                this.firstElm = this.focusableElms[i];
            }
            this.lastElm = this.focusableElms[i];
        }

        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);
        this.onWindowKeydownBound = this.#onWindowKeydown.bind(this);

        // @ts-ignore
        this.domNode.classList.add(window.f11y.settings.initialisedClass);
        window.dispatchEvent(this.#events.initialised);
        this.domNode.dispatchEvent(this.#events.initialised);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh(){
        if(!this.dialog) return;
        this.domNode.setAttribute('aria-hidden', 'true');
        this.dialog.setAttribute('aria-modal', 'true');
        this.dialog.setAttribute('role', 'dialog');
        this.init();
    }

    /**
     * Destroys the layer object
     */
    destroy(){
        if(!this.dialog || !this.triggerElms) return;

        this.closeLayer();
        this.removeGlobalListeners();
        this.domNode.removeAttribute('aria-hidden');
        this.dialog.removeAttribute('aria-modal');
        this.dialog.removeAttribute('role');
        // @ts-ignore
        this.domNode.classList.remove(window.f11y.settings.initialisedClass);

        for (let i = 0; i < this.triggerElms.length; i++) {
            this.triggerElms[i].removeEventListener('click', this.openLayerBound, true);
        }

        window.dispatchEvent(this.#events.destroyed);
        this.domNode.dispatchEvent(this.#events.destroyed);
    }


    dispatchStateUpdateEvent() {
        // @ts-ignore
        window.dispatchEvent(window.f11y.events.stateUpdate);
    }


    /**
     * Removes (mutates) any [aria-hidden] elements from this.focusableElms array
     */
    filterFocusableElms(){
        if(!this.focusableElms) return;

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
     * @param {HTMLElement}  newElm Element Node to move focus to
     */
    setFocusToElm(newElm) {
        newElm.focus();
    }

    /**
     * Sets Focus to the first focusable item inside the layer
     */
    setFocusToFirstElm() {
        if(!this.firstElm) return;

        this.setFocusToElm(this.firstElm);
    }

    /**
     * Sets Focus to the last focusable item inside the layer
     */
    setFocusToLastElm() {
        if(!this.lastElm) return;

        this.setFocusToElm(this.lastElm);
    }

    /**
     * Sets focus to the next menu item
     * @param    {Node} currentItem Currently focused item within the dropdown menu
     * @param   {"forward"|"backward"} movement Moving focus forward or backward
     * @returns  {Node|undefined} The newly focused item within the dropdown menu
     */
    #incrementFocus(currentItem, movement) {
        if(!this.focusableElms || !this.firstElm || !this.lastElm) return currentItem;

        // @ts-ignore
        window.f11y.utils.nextFocusable(
            currentItem,
            this.focusableElms,
            this.firstElm,
            this.lastElm,
            movement,
            true,
            (current) => {
                this.setFocusToElm(current)
            },
            () => {},
        );
    }

    /**
     * Opens the layer
     * @param {Event|KeyboardEvent|null}  e The event object that triggered the method
     */
    openLayer (e = null) {
        this.activeElm = document.activeElement;

        this.domNode.dispatchEvent(this.#events.beforeOpen);
        this.options.onBeforeOpen(this, e);

        const domNode = this.domNode;
        const dialog = this.dialog;
        const closeElms = this.closeElms
        const docBody = document.querySelector('body');
        const openClass = this.options.openClass;
        // @ts-ignore
        const animatingClass = window.f11y.settings.animatingClass;
        // @ts-ignore
        const animatingOpenClass = window.f11y.settings.animatingOpenClass;
        const setFocus = () => this.setFocusToFirstElm();
        const addListeners = () => this.addGlobalListeners();
        const closeLayer = () => this.closeLayer();

        const afterOpenEvent = this.#events.afterOpen;
        const onAfterOpen = () => this.options.onAfterOpen(this, e);

        domNode.setAttribute('aria-hidden', 'false');
        domNode.classList.add(openClass);

        if(this.options.disableScroll && docBody) docBody.style.setProperty('overflow', 'hidden');

        if(this.options.awaitOpenAnimation){
            let animationCount = 0;

            domNode.classList.add(animatingClass, animatingOpenClass);

            function animationEndHandler(e){
                if( e.target === domNode || domNode.contains(e.target) ){
                    if(dialog && dialog.contains(e.target) && e.target !== dialog ) return;

                    animationCount--;
    
                    if (animationCount === 0){
                        domNode.classList.remove(animatingClass, animatingOpenClass);
                        
                        domNode.dispatchEvent(afterOpenEvent);
                        onAfterOpen();
                        
                        document.removeEventListener('animationend', animationEndHandler);
                        document.removeEventListener('animationstart', animationStartHandler);
        
                        if(closeElms){
                            for (let i = 0; i < closeElms.length; i++) {
                                closeElms[i].addEventListener( 'click', closeLayer, true);
                            }
                        }
        
                        setFocus();
                        addListeners();
                    }
                }
            }

            function animationStartHandler(e) {
                if( e.target === domNode || domNode.contains(e.target) ){
                    if(dialog && dialog.contains(e.target) && e.target !== dialog ) return;
                    animationCount++;
                }
            }

            document.addEventListener('animationstart', animationStartHandler);
            document.addEventListener('animationend', animationEndHandler);

        }else{
            if(closeElms){
                for (let i = 0; i < closeElms.length; i++) {
                    closeElms[i].addEventListener( 'click', closeLayer, true);
                }
            }

            setFocus();
            addListeners();
            this.domNode.dispatchEvent(this.#events.afterOpen);
            this.options.onAfterOpen(this, e);
        }

        // @ts-ignore
        window.f11y.store.activeLayer = this.id;
        // @ts-ignore
        window.f11y.store.activeLayers.push(this.id);

        this.dispatchStateUpdateEvent();
    }

    /**
     * Closes the layer
     * @param {Event | KeyboardEvent | null} e The event object that triggered the method
     */
    closeLayer(e = null){
        if(this.isOpen()){
            // @ts-ignore
            if(this.id !== window.f11y.store.activeLayer) return;

            this.domNode.dispatchEvent(this.#events.beforeClose);
            this.options.onBeforeClose(this, e);

            const domNode = this.domNode;
            const dialog = this.dialog;
            const docBody = document.querySelector('body');
            const openClass = this.options.openClass;
            // @ts-ignore
            const animatingClass = window.f11y.settings.animatingClass;
            // @ts-ignore
            const animatingCloseClass = window.f11y.settings.animatingCloseClass;
            const removeListeners = () => this.removeGlobalListeners();
            const afterCloseEvent = this.#events.afterClose;
            const onAfterClose = () => this.options.onAfterClose(this, e);

            // @ts-ignore
            let activeLayers = window.f11y.store.activeLayers;
            const i = activeLayers.indexOf(this.id);
            activeLayers.splice(i, 1);
            // @ts-ignore
            window.f11y.store.activeLayers = activeLayers;
            // @ts-ignore
            window.f11y.store.activeLayer = activeLayers[activeLayers.length - 1];

            

            if(this.activeElm && this.activeElm.focus) this.activeElm.focus();

            if(this.options.awaitCloseAnimation){
                let animationCount = 0;

                domNode.classList.add(animatingClass, animatingCloseClass);

                /**
                 * Handle any when an animation ends within or on the this.domNode
                 * @param {AnimationEvent} e AnimationEvent object
                 * @returns 
                 */
                function animationEndHandler(e) {
                    if( e.target === domNode || domNode.contains(e.target) ){
                        if( dialog.contains(e.target) && e.target !== dialog ) return;

                        animationCount--;

                        if (animationCount === 0){
                            domNode.classList.remove(animatingClass, animatingCloseClass);
                            domNode.classList.remove(openClass);
                            domNode.setAttribute('aria-hidden', 'true');

                            if(window.f11y.store.activeLayers.length <= 0) docBody.style.removeProperty('overflow');
                            
                            domNode.dispatchEvent(afterCloseEvent);
                            onAfterClose();

                            document.removeEventListener('animationstart', animationStartHandler);
                            document.removeEventListener('animationend', animationEndHandler);
                            
                            removeListeners();
                        }
                    }
                }

                /**
                 * Handle any when an animation starts within or on the this.domNode
                 * @param {AnimationEvent} e AnimationEvent object
                 * @returns 
                 */
                function animationStartHandler(e) {
                    if( e.target === domNode || domNode.contains(e.target) ){
                        if(dialog && dialog.contains(e.target) && e.target !== dialog ) return;
                        animationCount++;
                    }
                }

                document.addEventListener('animationstart', animationStartHandler);
                document.addEventListener('animationend', animationEndHandler);

            } else {
                domNode.classList.remove(openClass);
                domNode.setAttribute('aria-hidden', 'true');
                
                // @ts-ignore
                if(window.f11y.store.activeLayers.length <= 0 && docBody) docBody.style.removeProperty('overflow');
                
                this.domNode.dispatchEvent(this.#events.afterClose);
                this.options.onAfterClose(this, e);
                
                removeListeners();
            }

            this.dispatchStateUpdateEvent();
        }
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
                this.#incrementFocus(tgt, "backward");
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
                    this.#incrementFocus(tgt, "forward");
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
        if (this.dialog && !this.dialog.contains(e.target)) {
            if (this.isOpen()) {
                this.closeLayer(e);
                if(this.activeElm) this.activeElm.focus();
            }
        }
    }
}

export default Layer