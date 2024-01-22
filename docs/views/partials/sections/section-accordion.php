<?php declare(strict_types=1);

$data_id = generate_random_string(8);
?>
<section class="section--accordion">
    <?php
    render_partial(
        'components/component-title', 
        array(
            "titleContent" => "Accordion"
        )
    );
    ?>
    <div class="example--list">
        <div class="grid-cols grid-cols--2">
            <div class="example example--accordion">
                <div class="example__title">
                <span class="number-indicator">1</span>
                    <h3 class="h-b f11y-white weight-600">Default Example</h3>
                </div>
                <div class="f11y--accordion f11y--accordion--default">
                    <div class="f11y--accordion__item">
                        <button id="accordion-default-trigger-1" aria-expanded="false" aria-controls="accordion-default-panel-1">
                            Accordion Item 1
                        </button>
                        <div id="accordion-default-panel-1" role="region" aria-labelledby="accordion-default-trigger-1" hidden>
                            <p>Accordion Panel Content 1</p>
                        </div>
                    </div>
                
                    <div class="f11y--accordion__item">
                        <button id="accordion-default-trigger-2" aria-expanded="false" aria-controls="accordion-default-panel-2">
                            Accordion Item 2
                        </button>
                        <div id="accordion-default-panel-2" role="region" aria-labelledby="accordion-default-trigger-2" hidden>
                            <p>Accordion Panel Content 2</p>
                        </div>
                    </div>

                    <div class="f11y--accordion__item">
                        <button id="accordion-default-trigger-3" aria-expanded="false" aria-controls="accordion-default-panel-3">
                            Accordion Item 3
                        </button>
                        <div id="accordion-default-panel-3" role="region" aria-labelledby="accordion-default-trigger-3" hidden>
                            <p>Accordion Panel Content 3</p>
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
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-1" aria-expanded="false" aria-controls="accordion-panel-1">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1" hidden>
                                        <p>Accordion Panel Content 1</p>
                                    </div>
                                </div>
                            
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-2" aria-expanded="false" aria-controls="accordion-panel-2">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2" hidden>
                                        <p>Accordion Panel Content 2</p>
                                    </div>
                                </div>

                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-3" aria-expanded="false" aria-controls="accordion-panel-3">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-3" role="region" aria-labelledby="accordion-trigger-3" hidden>
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
                        const accordion = document.querySelector(".f11y--accordion");
                        new f11y.Accordion(
                            accordion
                        );
                        </code>
                    </pre>
                </div>

            </div>
        </div>








        <?php $data_id = generate_random_string(8); ?>
        <!-- Example 2-->
        <div class="grid-cols grid-cols--2">
            <div class="example example--accordion">
                <div class="example__title">
                    <span class="number-indicator">2</span>
                    <h3 class="h-b f11y-white weight-600">Programmatic Example</h3>
                </div>
                <div class="f11y--accordion f11y--accordion--programmatic">
                    <div class="external-triggers">
                        <button class="external-programmatic-trigger" data-index="0">Trigger Item 1</button>
                        <button class="external-programmatic-trigger" data-index="1">Trigger Item 2</button>
                        <button class="external-programmatic-trigger" data-index="2">Trigger Item 3</button>
                    </div>
                    <div class="f11y--accordion__item">
                        <button id="accordion-programmatic-trigger-1" aria-expanded="false" aria-controls="accordion-programmatic-panel-1">
                            Accordion Item 1
                        </button>
                        <div id="accordion-programmatic-panel-1" role="region" aria-labelledby="accordion-programmatic-trigger-1" hidden>
                            <p>Accordion Panel Content 1</p>
                        </div>
                    </div>
                
                    <div class="f11y--accordion__item">
                        <button id="accordion-programmatic-trigger-2" aria-expanded="false" aria-controls="accordion-programmatic-panel-2">
                            Accordion Item 2
                        </button>
                        <div id="accordion-programmatic-panel-2" role="region" aria-labelledby="accordion-programmatic-trigger-2" hidden>
                            <p>Accordion Panel Content 2</p>
                        </div>
                    </div>

                    <div class="f11y--accordion__item">
                        <button id="accordion-programmatic-trigger-3" aria-expanded="false" aria-controls="accordion-programmatic-panel-3">
                            Accordion Item 3
                        </button>
                        <div id="accordion-programmatic-panel-3" role="region" aria-labelledby="accordion-programmatic-trigger-3" hidden>
                            <p>Accordion Panel Content 3</p>
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
                                    <button class="external-trigger" data-index="0">Trigger Item 1</button>
                                    <button class="external-trigger" data-index="1">Trigger Item 2</button>
                                    <button class="external-trigger" data-index="2">Trigger Item 3</button>
                                </div>
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-1" aria-expanded="false" aria-controls="accordion-panel-1">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1" hidden>
                                        <p>Accordion Panel Content 1</p>
                                    </div>
                                </div>
                            
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-2" aria-expanded="false" aria-controls="accordion-panel-2">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2" hidden>
                                        <p>Accordion Panel Content 2</p>
                                    </div>
                                </div>

                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-3" aria-expanded="false" aria-controls="accordion-panel-3">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-3" role="region" aria-labelledby="accordion-trigger-3" hidden>
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
                        const accordionElm = document.querySelector(".f11y--accordion--programmatic");
                        const accordionObj = new f11y.Accordion(
                            accordionElm
                        );

                        const externalTriggers = document.querySelectorAll('.external-trigger');
                        externalTriggers.forEach(function(trigger) {
                            const item = accordionObj.accordionItems[trigger.dataset.index];

                            trigger.addEventListener( 'click', function(e){
                                accordionObj.toggle(item, e);
                            });
                        });
                        </code>
                    </pre>
                </div>

            </div>
        </div>








        <?php $data_id = generate_random_string(8); ?>
        <!-- Example 3-->
        <div class="grid-cols grid-cols--2">
            <div class="example example--accordion">
                <div class="example__title">
                    <span class="number-indicator">2</span>
                    <h3 class="h-b f11y-white weight-600">Callback Example</h3>
                </div>
                <div class="f11y--accordion f11y--accordion--callback">
                    <div class="external-triggers">
                        <button class="external-callback-trigger is-closed" data-index="0">Trigger Item 1</button>
                        <button class="external-callback-trigger is-closed" data-index="1">Trigger Item 2</button>
                        <button class="external-callback-trigger is-closed" data-index="2">Trigger Item 3</button>
                    </div>
                    <div class="f11y--accordion__item">
                        <button id="accordion-callback-trigger-1" aria-expanded="false" aria-controls="accordion-callback-panel-1">
                            Accordion Item 1
                        </button>
                        <div id="accordion-callback-panel-1" role="region" aria-labelledby="accordion-callback-trigger-1" hidden>
                            <p>Accordion Panel Content 1</p>
                        </div>
                    </div>
                
                    <div class="f11y--accordion__item">
                        <button id="accordion-callback-trigger-2" aria-expanded="false" aria-controls="accordion-callback-panel-2">
                            Accordion Item 2
                        </button>
                        <div id="accordion-callback-panel-2" role="region" aria-labelledby="accordion-callback-trigger-2" hidden>
                            <p>Accordion Panel Content 2</p>
                        </div>
                    </div>

                    <div class="f11y--accordion__item">
                        <button id="accordion-callback-trigger-3" aria-expanded="false" aria-controls="accordion-callback-panel-3">
                            Accordion Item 3
                        </button>
                        <div id="accordion-callback-panel-3" role="region" aria-labelledby="accordion-callback-trigger-3" hidden>
                            <p>Accordion Panel Content 3</p>
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
                                    <button class="external-trigger is-closed" data-index="2">Trigger Item 3</button>
                                </div>
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-1" aria-expanded="false" aria-controls="accordion-panel-1">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1" hidden>
                                        <p>Accordion Panel Content 1</p>
                                    </div>
                                </div>
                            
                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-2" aria-expanded="false" aria-controls="accordion-panel-2">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2" hidden>
                                        <p>Accordion Panel Content 2</p>
                                    </div>
                                </div>

                                <div class="f11y--accordion__item">
                                    <button id="accordion-trigger-3" aria-expanded="false" aria-controls="accordion-panel-3">
                                        Accordion Item 1
                                    </button>
                                    <div id="accordion-panel-3" role="region" aria-labelledby="accordion-trigger-3" hidden>
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
                        const accordionObj = new f11y.Accordion(
                            accordionElm,
                            {
                                showMultiple: false,
                                onOpen: function(itemObj, event){
                                    const index = itemObj.index;
                                    const externalTrigger = document.querySelector('.external-callback-trigger[data-index="' + index + '"]');
                                    externalTrigger.classList.add('is-open');
                                    externalTrigger.classList.remove('is-closed');
                                },
                                onClose: function(itemObj, event){
                                    const index = itemObj.index;
                                    const externalTrigger = document.querySelector('.external-callback-trigger[data-index="' + index + '"]');
                                    externalTrigger.classList.add('is-closed');
                                    externalTrigger.classList.remove('is-open');
                                },
                            }
                        );

                        const externalTriggers = document.querySelectorAll('.external-trigger');
                        externalTriggers.forEach(function(trigger) {
                            const item = accordionObj.accordionItems[trigger.dataset.index];

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
</section>
';