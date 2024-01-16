> ⚠️ f11y is still in a alpha state - improvements, optimisations and features are still being actively working on. Please expect breaking changes and bugs.

<h1 align="center">f11y</h1>
<p align="center">A barebones collection of w3c accessible JavaScript functionality components, with zero dependencies. Weighing in at just 6kb min.gz'd</p>

## Installation
Simple, just add the the f11y `<script>` at the end of your document.
```html
    ...
        </footer>
        <script src="unkg..."></script>
    </body>
    ...
```

## Warning! f11y is **not** a UI framework.
* **Zero styling choices are made for you.** Our examples folder has some example CSS if you want a starting point.
* **We leave the UX up to you.** UI frameworks often differentiate components based on their intended UX. For example a 'Modal' and a 'Alert Dialog' may be different components. f11y does not do this, it provides you with the base functionality, *creating the proper UX is left to you.*
* **We don't provide passive components.** This means any component you may find in a UI framework, such as 'Cards', 'Avatars', 'Seperators' etc... that only need HTML & CSS and have no inherent/required user interactivity are not part of f11y.

#### So what does f11y do and why would I use it...?
*f11y simply provides you with the base functionality for creating fantastic and accessible UI UX, suitable for 90% of use cases and without any of the overhead of many UI frameworks.*

## Usage 

### Available Components
* Accordions
* Layers (Modals, Dialogs, Alert Dialogs etc)
* Tooltips
* Dropdowns (Dropdowns, Comboboxes, popovers)
* Tabs/Tablists
* Toasts
* Responsive Tables
* Input Sliders

#### General Initialisation
All f11y componets are initialised in a similar way and usually follow this pattern:
```js
const componentElement = document.querySelector(".my-component");
new f11y.ComponentName(componentElement, configObject); // Config is optional in all components
```
***Please refer to our examples folder for full details on HTML Markup and config options for each component***


## V0.1
* Implement Search on Dropdown
* Implement Toasts
* Fix Focusable Elements issues in layers
* Finish JSDoc & Typescript Documentation
* Update Target on Dropdown
* Fix moving focus to next item in tabs when autodisable is on

## V0.2
* Implement animation for Accordions
* Implement convert to accordion functionality on tabs
* Implement swipe support on tab panels

## V1
New Components: Custom input slider
Plugin: Resizable Windows
Plugin: Date Picker