<?php declare(strict_types=1);

$data_id = generate_random_string(8);
echo '
<section>';
    render_partial(
        'components/component-title', 
        array(
            "titleContent" => "Accordion"
        )
    );
    
echo '
    <div>
        <div class="f11y--tabs">
            <div role="tablist" aria-labelledby="tablist">
                <button id="tab-html-' . $data_id . '" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-html-' . $data_id . '">
                    HTML
                </button>
                <button id="tab-css-' . $data_id . '" type="button" role="tab" aria-selected="false" aria-controls="tabpanel-css-' . $data_id . '">
                    CSS
                </button>
                <button id="tab-js-' . $data_id . '" type="button" role="tab" aria-selected="true" aria-controls="tabpanel-js-' . $data_id . '">
                    JavaScript
                </button>
            </div>

            <div id="tabpanel-html-' . $data_id . '" role="tabpanel" aria-labelledby="tab-html-' . $data_id . '">
                <pre id="pre-html-' . $data_id . '" class="line-numbers linkable-line-numbers" data-line="3,6,9">
                    <code class="language-markup line-numbers"><!--
                        <div class="f11y--tabs">
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
                    --></code>
                </pre>
            </div>
            <div id="tabpanel-css-' . $data_id . '" role="tabpanel" aria-labelledby="tab-css-' . $data_id . '">
                <pre id="pre-css-' . $data_id . '" class="line-numbers linkable-line-numbers">
                    <code class="language-css line-numbers">
                        
                    </code>
                </pre>
            </div>
            <div id="tabpanel-js-' . $data_id . '" role="tabpanel" aria-labelledby="tab-js-' . $data_id . '">
                <pre id="pre-js-' . $data_id . '" class="line-numbers linkable-line-numbers">
                    <code class="language-javascript line-numbers">
                        const tabList = document.querySelector(".f11y--tabs");
                        new f11y.TabList(
                            tabList,
                            {
                                onChange: () => { },
                                orientation: "horizontal",
                                disableActiveTab: false 
                            }
                        );
                    </code>
                </pre>
            </div>
        </div>
    </div>
</section>
';