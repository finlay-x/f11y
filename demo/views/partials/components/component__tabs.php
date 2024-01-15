<?php declare(strict_types=1);
/**
 * Name: Tabs Component
 * Description: Pattern for tabbed areas of content
 * 
 * @param   array   $parameters   [optional] Array of 'key' => 'value' pairs that are exclusive to each instance of this partial.
 * 
 */
?>
<section class="section-container">
    <div class="tabs--js">
        <h3 id="tablist">Tabs</h3>
        <div role="tablist" aria-labelledby="tablist">
            <button id="tab-1" type="button" role="tab" aria-selected="true" aria-controls="tabpanel-1">
                Tab Item 1
            </button>
            <button id="tab-2" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-2">
                Tab Item 2
            </button>
            <button id="tab-3" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-3">
                Tab Item 3
            </button>
        </div>

        <div id="tabpanel-1" role="tabpanel" aria-labelledby="tab-1">
            <p>Tab Panel Content 1</p>
        </div>
        <div id="tabpanel-2" role="tabpanel" aria-labelledby="tab-2">
            <p>Tab Panel Content 2</p>
        </div>
        <div id="tabpanel-3" role="tabpanel" aria-labelledby="tab-3">
            <p>Tab Panel Content 3</p>
        </div>
    </div>
</section>