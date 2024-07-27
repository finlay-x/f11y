// @ts-nocheck

import f11y from '../../index';
import '../../../.storybook/main.css';
import './layer.stories.css';

export default {
    title: 'Components/Layer',
    component: f11y.components.Layer,
    parameters: {
        layout: 'centered',
    },
    render: (args) => {
        if (window.layerStory) {
            window.layerStory.destroy();
            delete window.layerStory;
        }

        let template = `
        <div id="layer-1" class="f11y--layer layer--js" aria-hidden="true">
            <div class="f11y--layer__container" role="dialog" aria-modal="true" aria-labelledby="layer-title">
                <article>
                    <header>
                        <h3 id="layer-title">Layer Title</h2>
                    </header>

                    <main>
                        <p>
                            Sometimes, we've to check if an element is visible with JavaScript.
                            <a href="#">fdf</a>
                            In this article, we'll look at how to check if an element exists in the visible DOM with JavaScript.
                            document.body.contains
                            We can use the document.body.contains method checks if an element is part of the visible DOM.
                            For instance, we can write the following HTML:
                        </p>
                    </main>

                    <footer>
                        <button f11y-layer-close="layer-1">Close</button>
                    </footer>
                </article>
            </div>
        </div>

        <button f11y-layer-open="layer-1">Open Layer</button>
        `;

        const container = document.createElement('div');
        container.innerHTML = template;
        document.body.appendChild(container);

        requestAnimationFrame(() => {
            const domNode = container.querySelector('.layer--js');
            if (domNode) {
                window.layerStory = new f11y.components.Layer(domNode, args);
            }
        });

        return container;
    },
    argTypes: {
        openTriggerAttribute: { control: 'text' },
        closeTriggerAttribute: { control: 'text' },
        openClass: { control: 'text' },
        disableScroll: { control: 'boolean' },
        closeOnBackgroundClick: { control: 'boolean' },
        closeOnEscClick: { control: 'boolean' },
        awaitCloseAnimation: { control: 'boolean' },
        awaitOpenAnimation: { control: 'boolean' },
    },
    args: {
        onBeforeOpen: (Layer, e) => {console.log('onBeforeOpen: ', Layer, e)},
        onAfterOpen: (Layer, e) => {console.log('onAfterOpen: ', Layer, e)},
        onBeforeClose: (Layer, e) => {console.log('onBeforeClose: ', Layer, e)},
        onAfterClose: (Layer, e) => {console.log('onAfterClose: ', Layer, e)},
    }
};

export const Default = {};

export const AnimatedDialog = {
    args: {
        awaitCloseAnimation: true,
        awaitOpenAnimation: true,
    }
};

export const Alert = {
    args: {
        closeOnBackgroundClick: false,
        closeOnEscClick: false,
    }
};

export const Nested = {};

export const Sheet = {};

export const Drawer = {};