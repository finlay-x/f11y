// @ts-nocheck

import f11y from '../../index';
import '../../../.storybook/main.css';
import './accordion.stories.css';

export default {
    title: 'Components/Accordion',
    component: f11y.components.Accordion,
    parameters: {
        layout: 'centered',
    },
    render: (args) => {

        if (window.accordionStory) {
            window.accordionStory.destroy();
            delete window.accordionStory;
        }

        let template = `
        <div class="f11y--accordion accordion--js">
            <div f11y-accordion-item>
                <button id="trigger-1" aria-expanded="false" aria-controls="panel-1">Item 1</button>
                <div id="panel-1" role="region" aria-labelledby="trigger-1">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>

            <div f11y-accordion-item aria-disabled="true">
                <button id="trigger-2" aria-expanded="false" aria-controls="panel-2">Item 2 Disabled</button>
                <div id="panel-2" role="region" aria-labelledby="trigger-2">
                    <div f11y-accordion-content>Accordion Panel Content 2</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-3" aria-expanded="false" aria-controls="panel-3">Item 3</button>
                <div id="panel-3" role="region" aria-labelledby="trigger-3">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-4" aria-expanded="false" aria-controls="panel-4">Item 4</button>
                <div id="panel-4" role="region" aria-labelledby="trigger-3">
                    <div f11y-accordion-content>Accordion Panel Content 4</div>
                </div>
            </div>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.accordion--js');
            if (domNode) {
                window.accordionStory = new f11y.components.Accordion(domNode, args);
            }
        });

        return container;
    },
    argTypes: {
        itemSelector: { control: 'text' },
        type: { control: 'select', options: ["single", "multiple"] },
        openClass: { control: 'text' },
        itemSelector: { control: 'text' },
        contentSelector: { control: 'text' },
        keyboardNavigation: { control: 'boolean' },
        tabNavigation: { control: 'boolean' },
        orientation: { control: 'select', options: ["vertical", "horizontal"] },
        collapsible: { control: 'boolean' }
    },
    args: {
        onBeforeOpen: (Accordion, e, item) => {},
        onAfterOpen: (Accordion, e, item) => {},
        onBeforeClose: (Accordion, e, item) => {},
        onAfterClose: (Accordion, e, item) => {},
    }
};

export const Default = {
    args: {
        keyboardNavigation: true
    }
};

export const Multiple = {
    args: {
        type: "multiple",
        keyboardNavigation: true
    }
};

export const Collapsible = {
    args:{
        collapsible:true
    }
};

export const CSS_Animated = {
    render: (args) => {

        if (window.accordionStory) {
            window.accordionStory.destroy();
            delete window.accordionStory;
        }

        let template = `
        <div class="f11y--accordion accordion--js has-css-animation">
            <div f11y-accordion-item>
                <button id="trigger-1" aria-expanded="false" aria-controls="panel-1">Item 1</button>
                <div id="panel-1" role="region" aria-labelledby="trigger-1">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-2" aria-expanded="false" aria-controls="panel-2">Item 2</button>
                <div id="panel-2" role="region" aria-labelledby="trigger-2">
                    <div f11y-accordion-content>Accordion Panel Content 2</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-3" aria-expanded="false" aria-controls="panel-3">Item 3</button>
                <div id="panel-3" role="region" aria-labelledby="trigger-3">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.accordion--js');
            if (domNode) {
                window.accordionStory = new f11y.components.Accordion(domNode, args);
            }
        });

        return container;
    },
    args: {}
};

export const JS_Animated = {
    args: {
    }
};

export const Horizontal = {
    render: (args) => {

        if (window.accordionStory) {
            window.accordionStory.destroy();
            delete window.accordionStory;
        }

        let template = `
        <div class="f11y--accordion accordion--js is-horizontal-orientation has-css-animation">
            <div f11y-accordion-item class="is-open">
                <button id="trigger-1" aria-expanded="true" aria-controls="panel-1">Item 1</button>
                <div id="panel-1" role="region" aria-labelledby="trigger-1">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-2" aria-expanded="false" aria-controls="panel-2">Item 2</button>
                <div id="panel-2" role="region" aria-labelledby="trigger-2">
                    <div f11y-accordion-content>Accordion Panel Content 2</div>
                </div>
            </div>

            <div f11y-accordion-item>
                <button id="trigger-3" aria-expanded="false" aria-controls="panel-3">Item 3</button>
                <div id="panel-3" role="region" aria-labelledby="trigger-3">
                    <div f11y-accordion-content>Accordion Panel Content 1</div>
                </div>
            </div>
        </div>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.accordion--js');
            if (domNode) {
                window.accordionStory = new f11y.components.Accordion(domNode, args);
            }
        });

        return container;
    },
    args: {
        orientation: "horizontal",
        keyboardNavigation: true
    }
};