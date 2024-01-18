<h1 align="center">Tabs / Tablist</h1>

## Example HTML Markup
```html
<div class="f11y--tabs">
    <h3 id="tablist">Tabs</h3>
    <div role="tablist" aria-labelledby="tablist">
        <button id="tab-1" type="button" role="tab" aria-selected="true" aria-controls="tabpanel-1">
            Tab Item 1
        </button>
        <button id="tab-2" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-2">
            Tab Item 2
        </button>
        <button id="tab-3" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-3">
            Tab Item 3
        </button>
    </div>

    <div id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1">
        <p>Tab Panel Content 1</p>
    </div>
    <div id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2">
        <p>Tab Panel Content 2</p>
    </div>
    <div id="tabpanel-3" role="tabpanel" aria-labelledby="tab-3">
        <p>Tab Panel Content 3</p>
    </div>
</div>
```
* The tab trigger `aria-controls` must match the corresponding panel `id` attribute. 
* The attribute `role="tab"` is used to find all tab triggers.


## JS Initialisation
```js
const tabList = document.querySelector(".f11y--tabs");
new f11y.TabList(
    tabList,
    {   //Optional Configuration Object Defaults
        onChange: () => { }, //[1]
        orientation: 'horizontal', //[2]
        disableActiveTab: false //[3]
    }
);
```
|  | Name | Type | Description |
|---|---|---|---|
| 1. | onChange | `function` | Fired when the tooltip is opened. Receives the event that triggered it, and the tooltip object as parameters. |
| 2. | orientation | `string` | Defines whether up/down or left/right arrows should be used to naviagte between tab triggers. Accepts either `horizontal` \| `vertical`. Does not change visual appearance of tabs. |
| 3. | disableActiveTab | `boolean` | Adds `disabled` attribute the currently active tab trigger. |

---
[⬅️ PREV](/Layer.md) | [NEXT ➡️](/Tooltips.md)