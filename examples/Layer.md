<h1 align="center">Layer</h1>
<p align="center">Modal, Sheet, Popover, & Dialog functionalities</p>

## Example HTML Markup
```html
<div id="layer-1" class="f11y--layer" aria-hidden="true">
    <div role="dialog" aria-modal="true" aria-labelledby="layer-title">
        <article>
            <header>
                <h3 id="layer-title">Layer Title</h2>
            </header>

            <main></main>

            <footer>
                <button f11y-layer-close="layer-1">Open Layer</button>
            </footer>
        </article>
    </div>
</div>
<button f11y-layer-open="layer-1">Open Layer</button>
```
* Every layer must have a unique `id` & `aria-hidden="true"`.
* The layer `id` must match any `f11y-layer-open` & `f11y-layer-close` attributes. 
* The inner container/content area of your layer must have the attribute `role="dialog"`


## JS Initialisation
```js
const layer = document.querySelector(".f11y--layer");
new f11y.Layer(
    layer,
    {   //Optional Configuration Object Defaults
        onOpen: () => { }, //[1]
        onClose: () => { }, //[2]
        openTrigger: 'f11y-layer-open', //[3]
        closeTrigger: 'f11y-layer-close', //[4]
        openClass: 'is-open', //[5]
        disableScroll: true, //[6]
        closeOnBackgroundClick: true, //[7]
        awaitCloseAnimation: false, //[8]
        awaitOpenAnimation: false, //[9]
    }
);
```
|  | Name | Type | Description |
|---|---|---|---|
| 1. | onOpen | `function` | Fired when layer is opened. Receives the event that triggered it, and the layer object as parameters. |
| 2. | onClose | `function` | Fired when layer item is closed. Receives the event that triggered it, and the layer object as parameters. |
| 3. | openTrigger | `string` | Attribute name used for opening the layer. Defaults to `f11y-layer-open`. |
| 4. | openTrigger | `boolean` | Attribute name used for closing the layer. Defaults to `f11y-layer-close`. |
| 5. | openClass | `string` | Class applied to layer when opened |
| 6. | disableScroll | `boolean` | Should document scroll be disabled? Defaults to `true`. |
| 7. | closeOnBackgroundClick | `boolean` | Should clicking outside the `[role=dialog]` element close the layer? Defaults to `true`. |
| 8. | awaitCloseAnimation | `boolean` | If using CSS animation to close the layer, this will force wait for the animation to complete before closing the layer. |
| 9. | awaitOpenAnimation | `boolean` | If using CSS animation to open the layer, this will force wait for the animation to complete before opening the layer. |


## CSS
```css
.f11y--layer {
    display: none;
}

.f11y--layer.is-open {
    display: block;
}
```
---
[⬅️ PREV](/Dropdown.md) | [NEXT ➡️](/TabList.md)