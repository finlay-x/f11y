<h1 align="center">Accordion</h1>
<p align="center">Accordion, Details/Summary & Disclosure functionalities</p>

## Example HTML Markup
```html
<div class="f11y--accordion">
    <div class="f11y--accordion__item">
        <button id="trigger-1" type="button" aria-expanded="false" aria-controls="panel-1">
            Accordion Item 1
        </button>
        <div id="panel-1" role="region" aria-labelledby="trigger-1" hidden>
            <p>Accordion Panel Content 1</p>
        </div>
    </div>

    <div class="f11y--accordion__item">
        <button id="trigger-2" type="button" aria-expanded="false" aria-controls="panel-2" >
            Accordion Item 2
        </button>
        <div id="panel-2" role="region" aria-labelledby="trigger-2" hidden>
            <p>Accordion Panel Content 2</p>
        </div>
    </div>
</div>
```
* If you want to have an item open by default, remove the `hidden` attribute and set the `aria-expanded` to true.
* The `aria-controls` must match the `id` of the corresponding panel. 
* The `id` on the trigger and the `aria-labelledby` on the panel are optional, but reccomended for accessibility


## JS Initialisation
```js
const accordion = document.querySelector(".f11y--accordion");
new f11y.Accordion(
    accordion,
    {   //Optional Configuration Object Defaults
        onOpen : (item, event, accordion) => { }, //[1]
        onClose: (item, event, accordion) => { }, //[2]
        itemClass: 'f11y--accordion__item', //[3]
        showMultiple: true //[4]
    }
);
```
|  | Name | Type | Description |
|---|---|---|---|
| 1. | onOpen | `function` | Fired when accordion item is opened. Receives the item object, the event that triggered it, and the accordion object as parameters. |
| 2. | onClose | `function` | Fired when accordion item is closed. Receives the item object, the event that triggered it, and the accordion object as parameters. |
| 3. | itemClass | `string` | A valid class name that will be used to discover accordion items. |
| 4. | showMultiple | `boolean` | Decides whether to allow multiple items within the accordion to be opened at once. |

---
[⬅️ PREV](/Tooltips.md) | [NEXT ➡️](/Dropdown.md)