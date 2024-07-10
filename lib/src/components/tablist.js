import '../global/typedefs';

class TabList {
    /**
     * @param {HTMLElement} domNode 
     * @param {TabListDefault} opts 
     */
    constructor(domNode, opts) {

        /** @type {TabListDefault} */
        const DEFAULTS = {
            onChange: () => { },
            orientation: 'horizontal',
            disableActiveTab: false,
            changeOnNavigation: false,
            moveFocusOnSelect: false,
        }

        /** @type {TabListDefault} */
        this.options = Object.assign(DEFAULTS, opts);

        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    init(){
        this.tabs = Array.from(this.domNode.querySelectorAll('[role=tab]'));
        this.activeTabs = Array.from(this.domNode.querySelectorAll('[role=tab]:not([disabled])'));

        /** @type {Array<HTMLElement>} */
        this.tabpanels = [];

        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];
            const tabpanel = document.getElementById(tab.getAttribute('aria-controls'));

            tab.tabIndex = -1;

            if(!this.selected && tab.getAttribute('aria-selected') === 'true'){
                this.selected = tab;
            }else{
                tab.setAttribute('aria-selected', 'false');
            }

            this.tabpanels.push(tabpanel);

            tab.addEventListener('keydown', this.onKeydown.bind(this));
            tab.addEventListener('click', this.onClick.bind(this));

            if (!this.firstTab) {
                this.firstTab = tab;
            }

            this.lastTab = tab;
        }

        (this.selected) ? this.setSelectedTab(this.selected) : this.setSelectedTab(this.firstTab);

        this.dispatchStateUpdateEvent();

        this.domNode.classList.add(window.f11y.settings.initialisedClass);
    }

    dispatchStateUpdateEvent() {
        window.dispatchEvent(window.f11y.events.stateUpdate);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh() {
        this.init();
    }

    /**
     * Handles changing a tab
     * @param {HTMLElement} targetTab 
     * @param {Event | KeyboardEvent | null} event 
     */
    handleTabChange(targetTab, event = null) {
        this.setSelectedTab(targetTab);
        this.dispatchStateUpdateEvent();
        this.options.onChange(this, event);
    }

    /**
     * 
     */
    setActiveTabs(){
        this.activeTabs = Array.from(this.domNode.querySelectorAll('[role=tab]:not([disabled])'));
        this.firstActiveTab = null;

        for (let i = 0; i < this.activeTabs.length; i += 1) {
            const tab = this.activeTabs[i];

            if (!this.firstActiveTab) this.firstActiveTab = tab;

            this.lastActiveTab = tab;
        }
        
        this.nextTab = this.getNextTab();
        this.prevTab = this.getPrevTab();
    }

    /**
     * Sets the passed tab and corresponding panel to be selected
     * @param {Element} targetTab 
     */
    setSelectedTab(targetTab){
        for (let i = 0; i < this.tabs.length; i += 1) {
            const tab = this.tabs[i];

            if (targetTab.id === tab.id) {
                this.selected = this.tabs[i];
                tab.setAttribute('aria-selected', 'true');
                tab.removeAttribute('tabindex');
                this.tabpanels[i].removeAttribute('hidden');

                if(this.options.disableActiveTab === true){
                    tab.setAttribute('disabled', '');
                    tab.tabIndex = -1;

                }
            }else{
                tab.setAttribute('aria-selected', 'false');
                tab.removeAttribute('disabled');
                tab.tabIndex = -1;
                this.tabpanels[i].setAttribute('hidden', '');
            }
        }

        this.setActiveTabs();
    }

    getNextTab(tab = null){
        let nextTab;
        let tabList;
        const currentTab = tab ?? this.selected;
        

        if(this.options.disableActiveTab){
            tabList = this.activeTabs;
        } else {
            tabList = this.tabs;
        }

        const i = tabList.indexOf(currentTab);

        if(currentTab.id === this.lastActiveTab.id){
            nextTab = this.firstActiveTab;
        }else{
            nextTab = tabList[i + 1];
        }
        return nextTab;
    }

    getPrevTab(tab = null){
        let prevTab;
        let tabList;
        const currentTab = tab ?? this.selected;

        if(this.options.disableActiveTab){
            tabList = this.activeTabs;
        } else {
            tabList = this.tabs;
        }

        const i = tabList.indexOf(currentTab);
        if(currentTab.id === this.firstActiveTab.id){
            prevTab = this.lastActiveTab;
        }else{
            prevTab = tabList[i - 1];
        }
        return prevTab;
    }

    /**
     * Moves focus to passed tab
     * @param {Element} targetTab 
     */
    moveFocusToTab(targetTab) {
        targetTab.focus();
    }

    /**
     * Handles keydown events on tabs
     * @param {KeyboardEvent} event 
     */
    onKeydown(event) {
        const tgt = event.currentTarget;
        const change = this.options.changeOnNavigation;
        const orientation = this.options.orientation;
        let flag = false;

        switch (event.key) {
            case 'ArrowLeft':
                if(orientation === 'horizontal'){
                    if(change){
                        this.handleTabChange(this.prevTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getPrevTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowRight':
                if(orientation === 'horizontal'){
                    if(change){
                        this.handleTabChange(this.nextTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getNextTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowUp':
                if(orientation === 'vertical'){
                    if(change){
                        this.handleTabChange(this.prevTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getPrevTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'ArrowDown':
                if(orientation === 'vertical'){
                    if(change){
                        this.handleTabChange(this.nextTab);
                        this.moveFocusToTab(this.selected);
                    }else{
                        this.moveFocusToTab(this.getNextTab(tgt));
                    }
                    flag = true;
                }
                break;

            case 'Home':
                if(change){
                    this.handleTabChange(this.firstActiveTab);
                    this.moveFocusToTab(this.selected);
                }else{
                    this.moveFocusToTab(this.firstActiveTab);
                }
                flag = true;
                break;

            case 'End':
                if(change){
                    this.handleTabChange(this.lastActiveTab);
                    this.moveFocusToTab(this.selected);
                }else{
                    this.moveFocusToTab(this.lastActiveTab);
                }
                flag = true;
                break;

            default:
                break;
        }

        if (flag) {
            event.stopPropagation();
            event.preventDefault();
        }
    }

    /**
     * Handles click events on tabs
     * @param {Event} event 
     */
    onClick(event) {
        this.handleTabChange(event.currentTarget, event);
        if(this.options.moveFocusOnChange === true){
            this.moveFocusToTab(this.nextTab);
        }
    }
}

export default TabList