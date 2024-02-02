<?php declare(strict_types=1);

$data_id = generate_random_string(8);
?>
<section class="section--container section--accordion">
    <?php
    render_partial(
        'components/component-title', 
        array(
            "titleContent" => "Accordion"
        )
    );
    ?>

    <div class="example--list">
        <div class="grid-cols grid-cols--1">
            <div class="example example--accordion">
                <div class="example__title">
                <span class="number-indicator">1</span>
                    <h3 class="h-b f11y-white weight-600">Default Example</h3>
                </div>
                <div class="f11y--accordion f11y--accordion--default">
                    <div f11y-accordion-item>
                        <button id="accordion-default-trigger-1" aria-expanded="true" aria-controls="accordion-default-panel-1">
                            Accordion Item 1
                        </button>
                        <div id="accordion-default-panel-1" role="region" aria-labelledby="accordion-default-trigger-1">
                            <p>"Like all great travellers." said Essper, "I have seen more than I remember, and remember more than I have seen."</p>
                        </div>
                    </div>
                
                    <div f11y-accordion-item>
                        <button id="accordion-default-trigger-2" aria-expanded="false" aria-controls="accordion-default-panel-2">
                            Accordion Item 2
                        </button>
                        <div id="accordion-default-panel-2" role="region" aria-labelledby="accordion-default-trigger-2">
                            <p>"There are people, who the more you do for them, the less they will do for themselves."</p>
                        </div>
                    </div>

                    <div f11y-accordion-item>
                        <button id="accordion-default-trigger-3" aria-expanded="false" aria-controls="accordion-default-panel-3">
                            Accordion Item 3
                        </button>
                        <div id="accordion-default-panel-3" role="region" aria-labelledby="accordion-default-trigger-3">
                            <p>"The wide world is all about you: you can fence yourselves in, but you cannot for ever fence it out."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="f11y--tabs f11y--tabs--code">
                <div role="tablist" aria-labelledby="tablist">
                    
                    <button id="tab-html-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-html-<?=$data_id?>">
                        HTML
                    </button>
                    <button id="tab-js-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-js-<?=$data_id?>">
                        JavaScript
                    </button>
                </div>

                <div id="tabpanel-html-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-html-<?=$data_id?>">
                    <pre id="pre-html-<?=$data_id?>" class="line-numbers">
                        <code class="language-markup line-numbers"><!--
                            <div class="f11y--accordion">
                                <div f11y-accordion-item>
                                    <button id="accordion-trigger-1" aria-expanded="true" aria-controls="accordion-panel-1">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1">
                                        <p>Accordion Panel Content 1</p>
                                    </div>
                                </div>
                            
                                <div f11y-accordion-item>
                                    <button id="accordion-trigger-2" aria-expanded="false" aria-controls="accordion-panel-2">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2">
                                        <p>Accordion Panel Content 2</p>
                                    </div>
                                </div>

                                <div f11y-accordion-item>
                                    <button id="accordion-trigger-3" aria-expanded="false" aria-controls="accordion-panel-3">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-3" role="region" aria-labelledby="accordion-trigger-3">
                                        <p>Accordion Panel Content 3</p>
                                    </div>
                                </div>
                            </div>
                        --></code>
                    </pre>
                </div>
                <div id="tabpanel-js-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-js-<?=$data_id?>">
                    <pre id="pre-js-<?=$data_id?>" class="line-numbers">
                        <code class="language-javascript line-numbers">
                        const accordionElm = document.querySelector(".f11y--accordion");
                        new f11y.Accordion(
                            accordionElm
                        );
                        </code>
                    </pre>
                </div>

            </div>
        </div>





        <?php $data_id = generate_random_string(8); ?>
        <!-- Example 3-->
        <div class="grid-cols grid-cols--1">
            <div class="example example--accordion">
                <div class="example__title">
                    <span class="number-indicator">2</span>
                    <h3 class="h-b f11y-white weight-600">Callback Example</h3>
                </div>
                <div class="f11y--accordion f11y--accordion--callback">
                    <div class="external-triggers">
                        <button class="external-callback-trigger is-closed" data-index="0">Item 1</button>
                        <button class="external-callback-trigger is-closed" data-index="1">Item 2</button>
                    </div>
                    <div f11y-accordion-item>
                        <button id="accordion-callback-trigger-1" aria-expanded="false" aria-controls="accordion-callback-panel-1">
                            Accordion Item 1
                        </button>
                        <div id="accordion-callback-panel-1" role="region" aria-labelledby="accordion-callback-trigger-1">
                            <p>"Let yourself be silently drawn by the stronger pull of what you really love."</p>
                        </div>
                    </div>
                
                    <div f11y-accordion-item>
                        <button id="accordion-callback-trigger-2" aria-expanded="false" aria-controls="accordion-callback-panel-2">
                            Accordion Item 2
                        </button>
                        <div id="accordion-callback-panel-2" role="region" aria-labelledby="accordion-callback-trigger-2">
                            <p>"We all live with the objective of being happy; our lives are all different and yet the same."</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="f11y--tabs f11y--tabs--code">
                <div role="tablist" aria-labelledby="tablist">
                    
                    <button id="tab-html-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-html-<?=$data_id?>">
                        HTML
                    </button>
                    <button id="tab-js-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-js-<?=$data_id?>">
                        JavaScript
                    </button>
                </div>

                <div id="tabpanel-html-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-html-<?=$data_id?>">
                    <pre id="pre-html-<?=$data_id?>" class="line-numbers">
                        <code class="language-markup line-numbers"><!--
                            <div class="f11y--accordion">
                                <div>
                                    <button class="external-trigger is-closed" data-index="0">Trigger Item 1</button>
                                    <button class="external-trigger is-closed" data-index="1">Trigger Item 2</button>
                                </div>
                                <div f11y-accordion-item>
                                    <button id="accordion-trigger-1" aria-expanded="false" aria-controls="accordion-panel-1">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1">
                                        <p>Accordion Panel Content 1</p>
                                    </div>
                                </div>
                            
                                <div f11y-accordion-item>
                                    <button id="accordion-trigger-2" aria-expanded="false" aria-controls="accordion-panel-2">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2">
                                        <p>Accordion Panel Content 2</p>
                                    </div>
                                </div>
                            </div>
                        --></code>
                    </pre>
                </div>
                <div id="tabpanel-js-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-js-<?=$data_id?>">
                    <pre id="pre-js-<?=$data_id?>" class="line-numbers">
                        <code class="language-javascript line-numbers">
                        const accordionElm = document.querySelector(".f11y--accordion");
                        const accordionObj = new f11y.Accordion(
                            accordionElm,
                            {
                                showMultiple: false,
                                onOpen: function(itemObj, event){
                                    const externalTrigger = document.querySelector('.external-trigger[data-index="' + itemObj.index + '"]');
                                    externalTrigger.classList.add('is-open');
                                    externalTrigger.classList.remove('is-closed');
                                },
                                onClose: function(itemObj, event){
                                    const externalTrigger = document.querySelector('.external-trigger[data-index="' + itemObj.index + '"]');
                                    externalTrigger.classList.add('is-closed');
                                    externalTrigger.classList.remove('is-open');
                                },
                            }
                        );

                        const externalTriggers = document.querySelectorAll('.external-trigger');
                        externalTriggers.forEach(function(trigger) {
                            const item = accordionObj.items[trigger.dataset.index];

                            trigger.addEventListener( 'click', function(e){
                                accordionObj.toggle(item, e);
                            });
                        });
                        </code>
                    </pre>
                </div>

            </div>
        </div>
    </div>

    <div class="f11y--tabs f11y--tabs--code f11y--tabs--tables">
        <div role="tablist" aria-labelledby="tablist">
            <button id="tab-options-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-options-<?=$data_id?>">
                Options
            </button>
            <button id="tab-methods-<?=$data_id?>" role="tab" aria-selected="false" aria-controls="tabpanel-methods-<?=$data_id?>">
                Methods
            </button>
        </div>

        <div id="tabpanel-options-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-options-<?=$data_id?>">
            <table id="f11y--table-options-<?=$data_id?>" class="f11y--table table--js language-javascript">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Default</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <div>onOpen</div>
                        </td>
                        <td>
                            <div><code>function</code></div>
                        </td>
                        <td>
                            <div><code class="token parameter">(item, event){}</code></div>
                        </td>
                        <td>
                            <div>Fired when an accordion item is opened.</div>
                        </td>
                    </tr>
                    <tr>
                        <td><div>onClose</div></td>
                        <td><div><code>function</code></div></td>
                        <td><div><code class="token parameter">(item, event){}</code></div></td>
                        <td><div>Fired when an accordion item is closed.</div></td>
                    </tr>
                    <tr>
                        <td><div>itemClass</div></td>
                        <td><div><code class="token keyword">string</code></div></td>
                        <td><div><code>f11y--accordion__item</code></div></td>
                        <td><div>A valid class name that will be used to discover accordion items.</div></td>
                    </tr>
                    <tr>
                        <td><div>showMultiple</div></td>
                        <td><div><code class="token keyword">boolean</code></div></td>
                        <td><div><code>true</code></div></td>
                        <td><div>Should multiple items within the accordion be allowed to be opened at once.</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div id="tabpanel-methods-<?=$data_id?>" role="tabpanel" aria-labelledby="tab-methods-<?=$data_id?>">
            <table id="f11y--table-methods-<?=$data_id?>" class="f11y--table table--js language-javascript">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Parameters</th>
                        <th>Description</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><div><code>refresh()</code></div></td>
                        <td><div><code>  </code></div></td>
                        <td><div>Clears the class object and re-initialises the accordion</div></td>
                    </tr>
                    <tr>
                        <td><div><code>toggle()</code></div></td>
                        <td><div><code class="token keyword">accordionItemObject, event</code></div></td>
                        <td><div><p class="f11y-white">Toggles passed accordion item. The item object can be retrived from <code>.accordionItems</code></p></div></td>
                    </tr>
                    <tr>
                        <td><div><code>openItem()</code></div></td>
                        <td><div><code class="token keyword">accordionItemObject, event</code></div></td>
                        <td><div><p class="f11y-white">Opens the passed accordion item. The item object can be retrived from <code>.accordionItems</code></p></div></td>
                    </tr>
                    <tr>
                        <td><div><code>closeItem()</code></div></td>
                        <td><div><code class="token keyword">accordionItemObject, event</code></div></td>
                        <td><div><p class="f11y-white">Closes the passed accordion item. The item object can be retrived from <code>.accordionItems</code></p></div></td>
                    </tr>
                    <tr>
                        <td><div><code>openAll()</code></div></td>
                        <td><div><code class="token keyword">event</code></div></td>
                        <td><div>Opens all accordion items.</div></td>
                    </tr>
                    <tr>
                        <td><div><code>closeAll()</code></div></td>
                        <td><div><code class="token keyword">event</code></div></td>
                        <td><div>Closes all accordion items.</div></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</section>
