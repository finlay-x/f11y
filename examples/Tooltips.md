<h1 align="center">Tooltip</h1>

## Example HTML Markup
```html
<div class="f11y--tooltip" f11y-tooltip-position="bottom">
    <button type="button" aria-labelledby="tooltip--description-1">
        Trigger
    </button>
    <span id="tooltip--description-1" role="tooltip">Tooltip Content</span>
</div>
```
* `f11y-tooltip-position` defines the position of the tooltip, accepts: `top` | `bottom`.


## JS Initialisation
```js
const tooltip = document.querySelector(".f11y--tooltip");
new f11y.Tooltip(
    tooltip,
    {   //Optional Configuration Object Defaults
        onOpen: () => { }, //[1]
        onClose: () => { }, //[2]
        openClass: 'is-open', //[3]
        triggerNodeSelector: '[aria-labelledby]', //[4]
        tooltipNodeSelector: '[role=tooltip]', //[5]
        positionAttributeName: 'f11y-tooltip-position', //[6]
        awaitCloseAnimation: true, //[7]
        awaitOpenAnimation: true, //[8]
    }
);
```
|  | Name | Type | Description |
|---|---|---|---|
| 1. | onOpen | `function` | Fired when the tooltip is opened. Receives the event that triggered it, and the tooltip object as parameters. |
| 2. | onClose | `function` | Fired when the tooltip is closed. Receives the event that triggered it, and the tooltip object as parameters. |
| 3. | openClass | `string` | Class applied to dropdown when opened |
| 4. | triggerNodeSelector | `string` | Valid selector that allows for defining a custom trigger |
| 5. | tooltipNodeSelector | `string` | Valid selector that allows for defining a custom tooltip |
| 6. | positionAttributeName | `string` | Define a custom attribute that looks for the position value |
| 9. | awaitCloseAnimation | `boolean` | If using CSS animation to close the dropdown, this will force wait for the animation to complete before closing the dropdown. |
| 10. | awaitCloseAnimation | `boolean` | If using CSS animation to open the dropdown, this will force wait for the animation to complete before opening the dropdown. |


## CSS
```css
.f11y--tooltip {
    --gap: .5em;
    position: relative;
    display: inline-block;
}

.f11y--tooltip::after {
    position: absolute;
    right: -20%;
    top: 100%;
    left: -20%;
    display: block;
    height: calc(var(--gap) * 2);
}

.f11y--tooltip.tooltip-visible::after {
    content: '';
}

.f11y--tooltip[f11y-tooltip-position=bottom]::after,
.f11y--tooltip[f11y-tooltip-position=bottom] [role=tooltip] {
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
}

.f11y--tooltip[f11y-tooltip-position=top]::after,
.f11y--tooltip[f11y-tooltip-position=top] [role=tooltip] {
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
}

[role=tooltip] {
    display: none;
    position: absolute;
    width:max-content;
}


[role=tooltip].is-open{
    display:block;
}
```

---
[⬅️ PREV](/TabList.md) | [NEXT ➡️](/Accordion.md)