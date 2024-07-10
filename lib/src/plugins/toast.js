import '../global/typedefs';

class Toast {
    /**
     * @param {HTMLElement | Element} domNode 
     * @param {HTMLElement | Element} toastTemplate 
     * @param {Object} opts 
     */
    constructor(domNode, toastTemplate, opts) {

        this.f11ySettings = window.f11y.settings;
        
        /** @type {ToastDefault} */
        const DEFAULTS = {
            onOpen: () => { },
            onDismiss: () => { },
            onClear: () => { },
            openClass: this.f11ySettings.openClass,
            closeToastAttribute: 'f11y-toast-close',
            templateElementAttribute: 'f11y-toast-message',
            swipeTracking: false,
            swipeDirection: 'down',
            duration: -1,
            awaitCloseTransition: false,
            awaitOpenTransition: false 
        }

        /** @type {ToastDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        /** @type {Element | HTMLElement} */
        this.toastTemplate = toastTemplate;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        this.timer = 0;
        this.activeToasts = [];
        this.onPointerMoveBound = this.onPointerMove.bind(this);
        this.swipeThreshold = 50;
        window.addEventListener('mousedown', this.onBackgroundMousedown.bind(this), true);
        this.domNode.addEventListener( 'focusin', this.#onFocusIn.bind(this) );
        this.domNode.addEventListener( 'focusout', this.#onFocusOut.bind(this) );
        //this.domNode.addEventListener('keydown', this.onKeydown.bind(this) );

        this.domNode.classList.add(this.f11ySettings.initialisedClass);
    }

    refresh() {
        this.init();
    }

    /**
     * Opens the toast
     * @param {string} templateString String that populates the templatable element templateElementAttribute
     * @param {Element | HTMLElement | null} customToastTemplate Custom template element to be used as a custom template for this particular toast
     */
    openToast(templateString, customToastTemplate = null) {
        let toastTemplate = this.toastTemplate;
        if(customToastTemplate != null) toastTemplate = customToastTemplate;
        const builtToast = this.#createToast(toastTemplate, templateString);
        const toast = this.domNode.insertAdjacentElement('afterbegin', builtToast.firstChild);
        const animatingClass = this.f11ySettings.animatingClass;
        const animatingOpenClass = this.f11ySettings.animatingOpenClass;

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
                toast.classList.remove(animatingClass, animatingOpenClass);
                toast.classList.add(openClass);
            }
        }

        const toastObj = { id: toast.id, toastElm: toast, height:toast.offsetHeight};
        this.activeToasts.push(toastObj);
        this.updateToasts();
        this.domNode.classList.add('has-toasts');

        this.options.onOpen(toast, this);

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

    /**
     * Dismisses a specified toast
     * @param {string} id The id attribute of the toast to dismiss
     */
    dismissToast(id) {
        const toast = this.domNode.querySelector('[f11y-toast-id="' + id + '"]');
        this.activeToasts = this.activeToasts.filter(obj => obj.id !== id);
        this.updateToasts();
        toast.remove();
        if(!this.activeToasts.length){
            this.domNode.classList.remove('.is-hovered', 'has-toasts');
        }

        this.options.onDismiss(toast, this);
    }

    /**
     * Builds the toast dom element form the passed template element
     * @param {Element | HTMLElement} template Template element to build the toast from
     * @param {string} templateString String that populates the templatable element templateElementAttribute
     * @returns 
     */
    #createToast(template, templateString) {
        const toastInstance = template.content.cloneNode(true);
        const toast = new DocumentFragment();
        const toastContainer = document.createElement('div');
        const array = new Uint32Array(10);
        const toastId = 'toast-' + crypto.getRandomValues(array)[0];
        const animatingClass = this.f11ySettings.animatingClass;
        const animatingOpenClass = this.f11ySettings.animatingOpenClass;

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
            toastContainer.classList.add('will-animate', animatingClass, animatingOpenClass);
        }else{
            toastContainer.classList.add(this.options.openClass);
        }

        toastContainer.append(toastInstance);
        toast.append(toastContainer);
        return toast;
    }

    /**
     * Clears all toasts
     */
    clearToasts(){
        if(!this.activeToasts.length) return;
        this.activeToasts.slice().forEach(toast => this.dismissToast(toast.id));

        this.options.onClear(this);
    }

    /**
     * Updates toast properties and css variable values
     */
    updateToasts(){
        let offset = 0;
        for(let i = 0; i < this.activeToasts.length; i++){
            const toast = this.activeToasts[i];
            toast.toastElm.style.setProperty('--f11y-toast-index', i);
            toast.toastElm.style.setProperty('--f11y-toast-before', this.activeToasts.length - i - 1);

            this.domNode.style.setProperty('--f11y-toast-first', toast.height);
        }
        this.activeToasts.slice().reverse().forEach(function(toast) { // dumb shit
            toast.toastElm.style.setProperty('--f11y-toast-offset', offset);
            offset = offset + toast.height;
        });
    }

    /**
     * Method called when pointer down on a toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerDown(e){
        this.dragStartTime = new Date();
        e.currentTarget.setPointerCapture(e.pointerId);
        if(e.target.tagName === 'BUTTON') return;
        this.dragStartRef = { x: e.clientX, y: e.clientY};
        e.currentTarget.addEventListener('pointermove', this.onPointerMoveBound);
    }

    /**
     * Method called when pointer up on a toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerUp(e){
        const dir = this.options.swipeDirection;
        const prop = dir === 'left' || dir === 'right' ? '--f11y-toast-swipe-x' : '--f11y-toast-swipe-y';
        const swipeAmount = Number(e.currentTarget.style.getPropertyValue(prop) || 0);
        const timeTaken = new Date().getTime() - this.dragStartTime.getTime();
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if(Math.abs(swipeAmount) >= this.swipeThreshold || velocity > 0.25){
            this.dismissToast(e.currentTarget.id);
            return;
        }
        e.currentTarget.removeEventListener('pointermove', this.onPointerMoveBound);
        e.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0); //up-down
        e.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0); //left-right
        e.currentTarget.removeAttribute('f11y-toast-swiping');
    }

    /**
     * Method called when pointer move happens on toast
     * @param {Event} e The event object that triggered the method
     */
    onPointerMove(e){
        e.currentTarget.setAttribute('f11y-toast-swiping', true);
        const yPos = e.clientY - this.dragStartRef.y;
        const xPos = e.clientX - this.dragStartRef.x;

        const isAllowedToSwipe = this.#checkSwiping(e, yPos, xPos);

        if (!isAllowedToSwipe) {
            e.currentTarget.style.setProperty('--f11y-toast-swipe-y', 0);
            e.currentTarget.style.setProperty('--f11y-toast-swipe-x', 0);
        }
    }

    /**
     * Compares the swiping direction with the swipeDirection option to decide if swiping is allowed
     * @param {Event} e The event object that triggered the method
     * @param {number} yPos 
     * @param {number} xPos 
     * @returns {boolean} Is swipipng allowed?
     */
    #checkSwiping(e, yPos, xPos){
        const dir = this.options.swipeDirection;

        let clamp, threshold;

        switch(dir){
            case 'up':
                clamp = Math.min(0, yPos);
                threshold = e.pointerType === 'touch' ? -10 : -2;
                if(clamp < threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                    return true;
                }
                break;
            case 'down':
                clamp = Math.max(0, yPos);
                threshold = e.pointerType === 'touch' ? 10 : 2;
                if(clamp > threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-y', yPos);
                    return true;
                }
                break;
            case 'left':
                clamp = Math.min(0, xPos);
                threshold = e.pointerType === 'touch' ? -10 : -2;
                if(clamp < threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                    return true;
                }
                break;
            case 'right':
            default:
                clamp = Math.max(0, xPos);
                threshold = e.pointerType === 'touch' ? 10 : 2;
                if(clamp > threshold){
                    e.currentTarget.style.setProperty('--f11y-toast-swipe-x', xPos);
                    return true;
                }
                break;
        }
    }

    /**
     * Called when hover occurs on toast container domNode
     */
    #onHoverIn() {
        let timer = this.timer;
        clearTimeout(timer);
        this.domNode.classList.add('is-hovered');
        this.domNode.classList.add('has-attention');
    }

    /**
     * Called when hover leaves toast container domNode
     */
    #onHoverOut() {
        const domNode = this.domNode;
        this.timer = setTimeout(function(){
            domNode.classList.remove('is-hovered');
            domNode.classList.remove('has-attention');
        }, 750);
    }

    /**
     * Called when hover occurs on toast container domNode
     */
    #onFocusIn() {
        let timer = this.timer;
        clearTimeout(timer);
        this.domNode.classList.add('has-focus');
        this.domNode.classList.add('has-attention');
    }
    
    /**
     * Called when hover leaves toast container domNode
     */
    #onFocusOut() {
        const domNode = this.domNode;
        this.timer = setTimeout(function(){
            domNode.classList.remove('has-focus');
            domNode.classList.remove('has-attention');
        }, 750);
    }

    /**
     * Handles click events that are outside of the toast domNode remit
     * @param  {Object} e The event that triggered this method
     */
    onBackgroundMousedown(e) {
        if (!this.domNode.contains(e.target)) {
            this.domNode.classList.remove('is-hovered');
            this.domNode.classList.remove('has-focus');
            this.domNode.classList.remove('has-attention');
        }
    }
}

export default Toast;

if (typeof window.f11y.components !== 'undefined') {
    window.f11y.components.Toast = Toast
}