<?php declare(strict_types=1);
/**
 * Name: Modal Component
 * Description: Pattern for openable content overlaid on the primary window
 * 
 * @param   array   $parameters   [optional] Array of 'key' => 'value' pairs that are exclusive to each instance of this partial.
 * 
 */
?>
<section class="section-container">
    <h3>Layer</h3>
    <div id="layer-1" class="f11y--layer layer--js" aria-hidden="true">
        <div class="f11y--layer__container" role="dialog" aria-modal="true" aria-labelledby="layer-title">
            <article>
                <header>
                    <h3 id="layer-title">Layer Title</h2>
                </header>

                <main>
                    <button>fdsfsd</button>
                    <div class="f11y--tooltip tooltip--js" f11y-tooltip-position="bottom">
                        <button type="button" aria-labelledby="tooltip--description-2">
                            Settings
                        </button>
                        <span id="tooltip--description-2" role="tooltip">View and manage settings</span>
                    </div>
                    <p>
                        Sometimes, we've to check if an element is visible with JavaScript.
                        <a href="#">fdf</a>
                        In this article, we'll look at how to check if an element exists in the visible DOM with JavaScript.
                        document.body.contains

                        We can use the document.body.contains method checks if an element is part of the visible DOM.

                        For instance, we can write the following HTML:
                    </p>
                    <section class="section-container">
                        <h3>Dropdown</h3>
                        <div class="f11y--dropdown dropdown--js">
                            <button id="dropdown__toggle--2" type="button" aria-haspopup="true" aria-controls="dropdown__inner--2">Dropdown</button>
                            <ul id="dropdown__inner--2" role="menu" aria-hidden="true" aria-labelledby="dropdown__toggle--2">
                                <li role="menuitem">A. Menu Item 1</li>
                                <li role="menuitem">B. Menu Item 2</li>
                                <li role="menuitem">C. Menu Item 3</li>
                            </ul>
                        </div>
                    </section>

                    <input type="text">
                    <button>fdsfd</button>
                </main>

                <footer>

                </footer>
            </article>
        </div>
    </div>
    <button f11y-layer-open="layer-1">Open Layer</button>
</section>