<h1 align="center">Tooltip</h1>

## Example HTML Markup
```html
<div class="f11y--dropdown">
    <button id="dropdown__toggle" type="button" aria-haspopup="true" aria-controls="dropdown__inner">Dropdown</button>
    <ul id="dropdown__inner" role="menu" aria-hidden="true" aria-labelledby="dropdown__toggle">
        <li>
            <button>A. Menu Item 1</button>
        </li>
        <li>
            <a href="#">B. Menu Item 1</a>
        </li>
        <li role="menuitem">
            C. Menu Item 1
        </li>
    </ul>
</div>
```
* `role="menu"` by default defines the menu element.
* `button[aria-controls]` by default defines the trigger element.
* All other attributes are optional, but reccomended for accessibility


## JS Initialisation
```js
const dropdown = document.querySelector(".f11y--dropdown");
new f11y.Dropdown(
    dropdown,
    {   //Optional Configuration Object Defaults
        onOpen: () => {}, //[1]
        onClose: () => {}, //[2]
        openClass: 'is-open', //[3]
        triggerNodeSelector: 'button[aria-controls]', //[4]
        dropdownNodeSelector: '[role="menu"]', //[5]
        updateOnSelect: true, //[6]
        updateTargetSelector: '', //[7]
        closeOnSelect: false, //[8]
        awaitCloseAnimation: false, //[9]
        awaitOpenAnimation: false //[10]
    }
);
```
|  | Name | Type | Description |
|---|---|---|---|
| 1. | onOpen | `function` | Fired when dropdown is opened. Receives the event that triggered it, and the dropdown object as parameters. |
| 2. | onClose | `function` | Fired when dropdown item is closed. Receives the event that triggered it, and the dropdown object as parameters. |
| 3. | openClass | `string` | Class applied to dropdown when opened |
| 4. | triggerNodeSelector | `string` | Valid selector that allows for defining a custom trigger |
| 5. | dropdownNodeSelector | `string` | Valid selector that allows for defining a custom Menu |
| 6. | updateOnSelect | `boolean` | Should the trigger get an updated textContent when a dropdown item is selected |
| 7. | updateTargetSelector | `boolean` | Valid selector to define a cutom element that gets updated if `updateOnSelect` is `true` |
| 8. | closeOnSelect | `boolean` | Should the dropdown automatically close after selecting an item |
| 9. | awaitCloseAnimation | `boolean` | If using CSS animation to close the dropdown, this will force wait for the animation to complete before closing the dropdown. |
| 10. | awaitCloseAnimation | `boolean` | If using CSS animation to open the dropdown, this will force wait for the animation to complete before opening the dropdown. |


## CSS
```css
.f11y--dropdown {
    position: relative;
}

.f11y--dropdown [role=menu]{
    display: none;
    position: absolute;
}

.f11y--dropdown.is-open [role=menu]{
    display: block;
}
```
---
[⬅️ PREV](/Accordion.md) | [NEXT ➡️](/Layer.md)