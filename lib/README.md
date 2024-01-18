> ⚠️ f11y is still in a alpha state - improvements, optimisations and features are still being actively working on. Expect bugs & breaking changes if you do decide to use it.


</br>
<h1 align="center">
    <img alt="f11y, A functionality component library for pure JavaScript" width="1280" title="f11y" src="https://i.ibb.co/Bcw2YM2/f11y-header.jpg">
</h1>
<p align="center"><strong><em>f11y</em></strong> is a barebones collection of accessible JavaScript functionality components, with zero dependencies. <br><strong>Weighing in at just <em>6kb min.gz'd</em></strong></p>

## Installation
**via CDN / Script Tag**
```html
    ...
        </footer>
        <script src="https://www.unpkg.com/f11y@latest/umd/f11y.min.js"></script>
    </body>
    ...
```

**via npm**
```shell
npm install f11y --save
```

## f11y is ***not*** a UI framework.
* **Zero styling choices are made for you.** This library is 100% styling agnostic, our examples folder has some example CSS if you want a starting point.
* **We leave the UX up to you.** UI frameworks often differentiate components based on their intended UX. For example a 'Modal' and a 'Alert Dialog' may be different components. f11y does not do this, it provides you with the base functionality, *creating the proper UX is left to you.*
* **We don't provide passive components.** This means any component you may find in a UI framework that only need HTML & CSS, such as 'Cards', 'Avatars', 'Seperators' etc... and have no inherent/required user interactivity are not part of f11y.

### So what does f11y do and why would I use it...?
*f11y simply provides you with base functionality for creating fantastic and accessible UX, suitable for 90% of use cases and without the overhead or complexities many UI frameworks bring.*

## Usage 

### Available Components
✔️ Accordions

✔️ Layers (Modals, Dialogs, Alert Dialogs etc)

✔️ Tooltips

✔️ Dropdowns (Dropdowns, Comboboxes, popovers)

✔️ Tabs/Tablist

✔️ Responsive Tables

🚧 Toasts (TBD In development)

🚧 Input Sliders (TBD In development)


### General Initialisation
All f11y components are initialised in a similar way and usually follow this pattern:
```js
const componentElement = document.querySelector(".my-component");
new f11y.ComponentName(componentElement, configObject); // Config is optional in all components
```
**[Please refer to our examples folder for full details on HTML Markup and config options for each component](examples/Accordion.md)**

## Roadmap
#### V0.1 Release
- [ ] Feature: Implement Toasts
- [ ] Feature: Implement Custom Input Sliders
- [ ] Documentation: Finish JSDoc & Documentation

#### V0.2 Release
- [ ] Feature: Implement Search on Dropdown
- [ ] Feature: Implement animation for Accordions
- [ ] Feature: Implement convert to accordion functionality on tabs
- [ ] Feature: Implement swipe support on tab panels

#### V1.0 Release
- [ ] Bug: Clean up of code, optimisations, etc...
- [ ] Plugin: Resizable Windows
- [ ] Plugin: Date Picker