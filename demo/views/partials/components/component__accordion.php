<?php declare(strict_types=1);
/**
 * Name: Accordion Group Component
 * Description: Pattern for an accordion group of vertically stacked show hide elements.
 * 
 * @param   array   $parameters   [optional] Array of 'key' => 'value' pairs that are exclusive to each instance of this partial.
 * 
 */
?>
<section class="section-container">
    <h3>Accordion</h3>
    <div class="accordion--js">
        <div class="f11y--accordion__item">
            <button id="accordion-trigger-1" type="button" aria-expanded="false" aria-controls="accordion-panel-1" >
                Accordion Item 1
            </button>
            <div id="accordion-panel-1" role="region" aria-labelledby="accordion-trigger-1" hidden>
                <p>Accordion Panel Content 1</p>
            </div>
        </div>

        <div class="f11y--accordion__item">
            <button id="accordion-trigger-2" type="button" aria-expanded="false" aria-controls="accordion-panel-2" >
                Accordion Item 2
            </button>
            <div id="accordion-panel-2" role="region" aria-labelledby="accordion-trigger-2" hidden>
                <p>Accordion Panel Content 2</p>
            </div>
        </div>

        <div class="f11y--accordion__item">
            <button id="accordion-trigger-3" type="button" aria-expanded="false" aria-controls="accordion-panel-3" >
                Accordion Item 3
            </button>
            <div id="accordion-panel-3" role="region" aria-labelledby="accordion-trigger-3" hidden>
                <p>Accordion Panel Content 3</p>
            </div>
        </div>
    </div>
</section>