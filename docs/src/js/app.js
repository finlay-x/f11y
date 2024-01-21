import f11y from 'f11y';

const tabList = document.querySelector(".f11y--tabs");
new f11y.TabList(
    tabList,
    {
        onChange: () => { },
        orientation: 'horizontal',
        disableActiveTab: false 
    }
);