const accordionElm = document.querySelector(".accordion--js");
let myAccordion = new f11y.Accordion(accordionElm ,
    {
        onOpen : (item, event, accordion) => { console.log(item, event, accordion) },
        onClose: (item, event, accordion) => { console.log(item, event, accordion) }
    }
);

const dropdowns = document.querySelectorAll(".dropdown--js");
dropdowns.forEach(function (dropdownElm) {
    let myDropdown = new f11y.Dropdown(dropdownElm);
});

const layers = document.querySelectorAll(".layer--js");
layers.forEach(function (layerElm) {
    new f11y.Layer(layerElm,
        {
            onOpen : (event, layer) => { console.log(event, layer) },
            onClose: (event, layer) => { console.log(event, layer) }
        }
    );
});


const tableElm = document.querySelector(".table--js");
let myTable = new f11y.Table(tableElm);


const tabListElm = document.querySelector(".tabs--js");
new f11y.TabList(tabListElm,
    {
        onChange: (event, tabList) => { console.log(event, tabList) }
    }
);


const tooltips = document.querySelectorAll(".tooltip--js");
tooltips.forEach(function (tooltipElm) {
    new f11y.Tooltip(tooltipElm);
});