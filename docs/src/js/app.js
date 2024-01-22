import f11y from 'f11y';

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


const accordionProgrammaticElm = document.querySelector(".f11y--accordion--programmatic");
const accordionProgrammaticObj = new f11y.Accordion(
    accordionProgrammaticElm
);

const externalProgrammaticTriggers = document.querySelectorAll('.external-programmatic-trigger');
externalProgrammaticTriggers.forEach(function(trigger) {
    const item = accordionProgrammaticObj.accordionItems[trigger.dataset.index];

    trigger.addEventListener( 'click', function(e){
        accordionProgrammaticObj.toggle(item, e);
    });
});



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
    const item = accordionCallbackObj.accordionItems[trigger.dataset.index];

    trigger.addEventListener( 'click', function(e){
        accordionCallbackObj.toggle(item, e);
    });
});