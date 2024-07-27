// @ts-nocheck

import f11y from '../../index';
import '../../../.storybook/main.css';
import './dropdown.stories.css';

export default {
    title: 'Components/Dropdown',
    component: f11y.components.Dropdown,
    parameters: {
        layout: 'centered',
    },
    render: (args) => {
        if (window.dropdownStory) {
            window.dropdownStory.destroy();
            delete window.dropdownStory;
        }

        let template = `
        <div class="f11y--dropdown dropdown--js">
            <button id="dropdown__toggle" aria-haspopup="true" aria-controls="dropdown__menu">Dropdown</button>
            <ul role="menu" id="dropdown__menu" aria-hidden="true" aria-labelledby="dropdown__toggle">
                <li role="menuitem">
                    Fish
                </li>   
                <li role="menuitem">
                    Tiger
                </li>
                <li role="menuitem">
                    Lion
                </li>
                <li role="menuitem">
                    Hippo
                </li>
                <li role="menuitem">
                    Penguin
                </li>
                <li role="menuitem">
                    Capercaillie
                </li>
            </ul>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.dropdown--js');
            if (domNode) {
                window.dropdownStory = new f11y.components.Dropdown(domNode, args);
            }
        });

        return container;
    },
    argTypes: {
        openClass: { control: 'text' },
        updateOnSelect: { control: 'boolean' },
        updateSelector: { control: 'text' },
        closeOnBackgroundClick: { control: 'boolean' },
        openOnClick: { control: 'boolean' },
        openOnHover: { control: 'boolean' },
        focusOnMouseOver: { control: 'boolean' },
        closeOnSelect: { control: 'boolean' },
        arrowNavigation: { control: 'boolean' },
        tabNavigation: { control: 'boolean' },
        awaitOpenAnimation: { control: 'boolean' },
        awaitCloseAnimation: { control: 'boolean' }
    },
    args: {
        onBeforeOpen: (Dropdown, e) => {console.log('onBeforeOpen: ', Dropdown, e)},
        onAfterOpen: (Dropdown, e) => {console.log('onAfterOpen: ', Dropdown, e)},
        onBeforeClose: (Dropdown, e) => {console.log('onBeforeClose: ', Dropdown, e)},
        onAfterClose: (Dropdown, e) => {console.log('onAfterClose: ', Dropdown, e)},
    }
};

export const Default = {};

export const Menu = {
    args: {
        awaitOpenAnimation: true,
        awaitCloseAnimation: true
    }
};

export const Select = {
    args: {
        closeOnSelect: true,
        updateOnSelect: true,
        loopItemFocus: false
    }
};

export const HoverCard = {
    args: {
        openOnClick: false,
        openOnHover: true
    }
};

export const Popover = {
    render: (args) => {
        if (window.dropdownStory) {
            window.dropdownStory.destroy();
            delete window.dropdownStory;
        }

        let template = `
        <div class="f11y--dropdown dropdown--js">
            <button id="dropdown__toggle" aria-haspopup="true" aria-controls="dropdown__menu">Dropdown</button>
            <div id="dropdown__menu" aria-hidden="true" aria-labelledby="dropdown__toggle">
                <input type="text" placeholder="Name">
                <input type="email" placeholder="Email">
                <a href="#">More Information</a>
                <button>Confirm</button>
            </ul>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.dropdown--js');
            if (domNode) {
                window.dropdownStory = new f11y.components.Dropdown(domNode, args);
            }
        });

        return container;
    },
    args: {
        arrowNavigation: false,
        tabNavigation: true
    }
};