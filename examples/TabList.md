<h1 align="center">Tooltip</h1>

## Example HTML Markup
```html
<div class="f11y--tooltip" f11y-tooltip-position="bottom">
    <button type="button" aria-labelledby="tooltip--description-1">
        Button
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
    {   //Optional Configuration Object
        onOpen: () => { }, //[1]
        onClose: () => { }, //[2]
        triggerNodeSelector: '[aria-labelledby]',
        tooltipNodeSelector: '[role=tooltip]',
        positionAttributeName: 'f11y-tooltip-position',
        openClass: 'is-open',
        awaitCloseAnimation: true,
        awaitOpenAnimation: true,
    }
);
```