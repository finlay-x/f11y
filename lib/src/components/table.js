import { f11y } from '../main/f11y';

f11y.Table = class Table {
    constructor (domNode) {
        /** @type {Element | HTMLElement} */
        this.domNode = domNode;

        this.init();
    }

    /**
     * Initialises the class component
     */
    init(){
        this.tableId = this.domNode.getAttribute('id');

        this.tableGroups = Array.from(this.domNode.querySelectorAll('thead, tbody, tfoot'));
        this.tableRows = Array.from(this.domNode.querySelectorAll('tr'));
        this.tableHeaderCells = Array.from(this.domNode.querySelectorAll('th'));
        this.tableDataCells = Array.from(this.domNode.querySelectorAll('td'));

        this.styleElm = document.createElement("style");
        document.head.appendChild(this.styleElm);
        this.stylesheet = this.styleElm.sheet;

        this.insertCellHeaders();
        this.insertTableAria();

        this.domNode.classList.add(f11y.settings.initialisedClass);
    }

    /**
     * Refreshes the class component and calls init() and does any necessary resets
     */
    refresh(){
        this.init();
    }

    /**
     * Inserts Header td values as psuedo ::before content into stylesheet element
     */
    insertCellHeaders(){
        for (let i = 0; i < this.tableHeaderCells.length; i += 1) {
            this.stylesheet.insertRule(
                "#" + this.tableId + " td:nth-child(" + (i + 1) +  ")::before {" +
                    "content:'" + this.tableHeaderCells[i].innerText + "';" + 
                "}",
                this.stylesheet.cssRules.length
            );
        }
    }

    /**
     * Inserts required aria into table for it to still be accessible if display style is change in order to make table repsonsive
     */
    insertTableAria(){
        this.domNode.setAttribute('role','table');

        for (let i = 0; i < this.tableGroups.length; i++) {
            this.tableGroups[i].setAttribute('role','rowgroup');
        }

        for (let i = 0; i < this.tableRows.length; i++) {
            this.tableRows[i].setAttribute('role','row');
        }

        for (let i = 0; i < this.tableHeaderCells.length; i++) {
            this.tableHeaderCells[i].setAttribute('role','columnheader');
        }

        for (let i = 0; i < this.tableDataCells.length; i++) {
            this.tableDataCells[i].setAttribute('role','cell');
        }
    }
}