import f11y from 'f11y';

console.log(f11y);

const tabLists = document.querySelectorAll(".f11y--tabs--code");
tabLists.forEach(function(tabList) {
    const tablistObj = new f11y.TabList(
        tabList,
        {
            onChange: () => { },
            orientation: 'horizontal',
            disableActiveTab: true 
        }
    );
});


const accordionDefault = document.querySelector(".f11y--accordion--default");
new f11y.Accordion(
    accordionDefault
);


const accordionCallbackElm = document.querySelector(".f11y--accordion--callback");
const accordionCallbackObj = new f11y.Accordion(
    accordionCallbackElm,
    {
        showMultiple: false,
        onOpen: function(itemObj, event){
            const index = itemObj.index;
            const externalTrigger = document.querySelector('.external-callback-trigger[data-index="' + index + '"]');
            externalTrigger.classList.add('is-open');
            externalTrigger.classList.remove('is-closed');
        },
        onClose: function(itemObj, event){
            const index = itemObj.index;
            const externalTrigger = document.querySelector('.external-callback-trigger[data-index="' + index + '"]');
            externalTrigger.classList.add('is-closed');
            externalTrigger.classList.remove('is-open');
        },
    }
);

const externalCallbackTriggers = document.querySelectorAll('.external-callback-trigger');
externalCallbackTriggers.forEach(function(trigger) {
    const item = accordionCallbackObj.items[trigger.dataset.index];

    trigger.addEventListener( 'click', function(e){
        accordionCallbackObj.toggle(item, e);
    });
});

const tables = document.querySelectorAll('.f11y--table');
tables.forEach(function(table) {
    let myTable = new f11y.Table(table);
});


const layerDefaultModal = document.querySelector("#layer-default");
new f11y.Layer(layerDefaultModal,
    {
        closeOnBackgroundClick: true,
        awaitCloseAnimation: true,
        awaitOpenAnimation: true,
    }
);


const layerAlertModal = document.querySelector("#layer-alert");
new f11y.Layer(layerAlertModal,
    {
        closeOnBackgroundClick: false,
        awaitCloseAnimation: true,
        awaitOpenAnimation: true,
    }
);