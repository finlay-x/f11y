import '../../global/f11y.types';

class Tooltip {

    /**
     * @param {HTMLElement} domNode 
     * @param {TooltipDefault} opts 
     */
    constructor(domNode, opts) {

        /** @type {TooltipDefault} */
        const DEFAULTS = {
            onOpen: () => { },
            onClose: () => { },
            positionAttributeName: 'f11y-tooltip-position',
            openClass: window.f11y.settings.openClass,
            leewayTiming: 750,
            delayTiming: 2000,
            awaitCloseAnimation: false,
            awaitOpenAnimation: false 
        }

        /** @type {TooltipDefault} */
        this.options = Object.assign(DEFAULTS, opts);
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init() {
        this.leeway = 0;
        this.delay = 0;
        this.trigger = this.domNode.querySelector('[aria-labelledby]');
        this.tooltip = this.domNode.querySelector('[role=tooltip]');
        this.tooltipPos = this.getTooltipPos();
        this.onTooltipKeydownBound = this.#onTooltipKeydown.bind(this);
        this.onBackgroundMousedownBound = this.#onBackgroundMousedown.bind(this);

        
        this.domNode.addEventListener('mouseenter', this.openTooltip.bind(this));
        this.trigger.addEventListener('touchstart', this.openTooltip.bind(this));
        this.domNode.addEventListener('focusin', this.onFocusin.bind(this));
        this.trigger.addEventListener('focusin', this.openTooltip.bind(this));

        this.domNode.addEventListener('mouseleave', this.closeTooltip.bind(this));
        this.domNode.addEventListener('touchend', this.closeTooltip.bind(this));
        this.domNode.addEventListener('focusout', this.onFocusout.bind(this));
        this.trigger.addEventListener('focusout', this.closeTooltip.bind(this));

        document.addEventListener('scroll', this.checkBoundingBox.bind(this));
        window.addEventListener('resize', this.checkBoundingBox.bind(this));

        this.domNode.classList.add(window.f11y.settings.initialisedClass);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh() {
        this.init();
    }

    /**
     * Checks whether the layer is open
     * @returns  {boolean}
     */
    isOpen() {
        return this.domNode.classList.contains(this.options.openClass) === true;
    }

    /**
     * Opens the tooltip
     */
    openTooltip() {
        const domNode = this.domNode;
        const tooltip = this.tooltip;
        const openClass = this.options.openClass;
        const animatingClass = window.f11y.settings.animatingClass;
        const animatingOpenClass = window.f11y.settings.animatingOpenClass;
        const delay = this.options.delayTiming;
        const leeway = this.leeway;

        if (!this.isOpen() && this.options.awaitOpenAnimation) {
            domNode.addEventListener('animationend', handler );
            domNode.classList.add(animatingClass, animatingOpenClass);

            function handler() {
                domNode.classList.remove(animatingClass, animatingOpenClass);
                domNode.classList.add(openClass);
                tooltip.classList.add(openClass);
                clearTimeout(leeway);

                domNode.removeEventListener(
                    'animationend', 
                    handler
                );
            }
        }else{
            domNode.classList.add(openClass);
            tooltip.classList.add(openClass);
            clearTimeout(leeway);
        }

        this.checkBoundingBox();
        this.addGlobalListeners();

        window.dispatchEvent(window.f11y.events.stateUpdate);
    }

    /**
     * Closes the tooltip
     */
    closeTooltip() {
        if(this.isOpen()) {
            const domNode = this.domNode;
            const tooltip = this.tooltip;
            const openClass = this.options.openClass;
            const leeway = this.options.leewayTiming;
            const animatingClass = window.f11y.settings.animatingClass;
            const animatingCloseClass = window.f11y.settings.animatingCloseClass;

            if (this.options.awaitCloseAnimation) {
                this.leeway = setTimeout(function(){
                    domNode.addEventListener('animationend', handler);
                    domNode.classList.add(animatingClass, animatingCloseClass);

                    function handler() {
                        domNode.classList.remove(animatingClass, animatingCloseClass);
                        domNode.classList.remove(openClass);
                        tooltip.classList.remove(openClass);

                        domNode.removeEventListener(
                            'animationend', 
                            handler
                        );
                    }
                }, leeway);
            } else {
                this.leeway = setTimeout(function(){
                    domNode.classList.remove(openClass);
                    tooltip.classList.remove(openClass);
                }, leeway);
            }

            window.dispatchEvent(window.f11y.events.stateUpdate);
        }
        
        this.resetBoundingBox();
        this.removeGlobalListeners();
    }

    /**
     * Registers global event listeners
     */
    addGlobalListeners() {
        document.addEventListener('keydown', this.onTooltipKeydownBound)
        window.addEventListener('mousedown', this.onBackgroundMousedownBound, true)
    }

    /**
     * Removes global event listeners
     */
    removeGlobalListeners() {
        document.removeEventListener('keydown', this.onTooltipKeydownBound)
        window.removeEventListener('mousedown', this.onBackgroundMousedownBound, true)
    }

    /**
     * Handles the domNode receiving focus
     */
    onFocusin() {
        this.domNode.classList.add('has-focus');
    }

    /**
     * Handles the domNode losing focus
     */
    onFocusout() {
        this.domNode.classList.remove('has-focus');
    }

    /**
     * Handles a keydown event on the tooltip target
     * @param  {KeyboardEvent} e The event object that triggered the method
     * @returns {void}
     */
    #onTooltipKeydown(e) {
        const key = e.key;
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
            e.stopPropagation();
            e.preventDefault();
        }
    }

    /**
     * Handles a mouse click event outside the domNode
     * @param  {Event} e The event object that triggered the method
     */
    #onBackgroundMousedown(e){
        if (!this.domNode.contains(e.target)) {
            if (this.isOpen()) {
                this.closeTooltip();
            }
        }
    }

    /**
     * Returns the position value from the attribute or a default if one is not set
     * @return  {string} the position value
     */
    getTooltipPos() {
        let setting = 'bottom';
    
        if (this.domNode.getAttribute(this.options.positionAttributeName)) {
          setting = this.domNode.getAttribute(this.options.positionAttributeName);
        }
    
        return setting;
    }

    /** 
     * Checks the bounding box of the tooltip element against the window bounds
     */
    checkBoundingBox() {
        let bounds = this.tooltip.getBoundingClientRect();

        this.checkHorizontalBounding(bounds);
        this.checkVerticalBounding(bounds);
    }

    /**
     * Checks the bounds of the tooltip against the window and sets offset css var
     * @param {DOMRect} bounds the bounding box values of the tooltip
     */
    checkHorizontalBounding(bounds) {
        let windowWidth = window.innerWidth;
        let translateAmount;

        if (bounds.right > windowWidth && bounds.left < 0) {
            console.warn('Tooltip width too wide for the window');
            return;
        }
    
        if (bounds.right > windowWidth) { //move it left
            translateAmount = (windowWidth - Math.round(bounds.right) - (Math.round(bounds.width) / 1.6))
            this.domNode.style.setProperty('--f11y-tooltip-offset', translateAmount);
        }
    
        if (bounds.left < 0 ) { // move it right
            translateAmount = Math.floor(bounds.width / 2);
            this.domNode.style.setProperty('--f11y-tooltip-offset', translateAmount);
        }
    }

    /**
     * Checks the bounds of the tooltip against the window and change the position attribute
     * @param {DOMRect} bounds the bounding box values of the tooltip
     */
    checkVerticalBounding(bounds) {
        let windowHeight = window.innerHeight;

        if (bounds.bottom > windowHeight && bounds.top < 0) {
            console.warn('Tooltip height too high for the window');
            return;
        }

        if (bounds.bottom > windowHeight) { // move it up
            this.domNode.setAttribute(this.options.positionAttributeName, 'top');
            return;
        }

        if (bounds.top < 0) { //move it down
            this.domNode.setAttribute(this.options.positionAttributeName, 'bottom');
            return;
        }
    }

    /**
     * Resets any changes made by checkBoundingBox()
     */
    resetBoundingBox() {
        this.domNode.style.removeProperty('--f11y-tooltip-offset');
        this.domNode.setAttribute(this.options.positionAttributeName, this.tooltipPos);
    }
}

export default Tooltip