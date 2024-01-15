<?php declare(strict_types=1);
/**
 * Name: Dropdown Component
 * Description: Pattern for a button that opens a dropdown set of links/options
 * 
 * @param   array   $parameters   [optional] Array of 'key' => 'value' pairs that are exclusive to each instance of this partial.
 * 
 */

$data_id = generate_random_string();
?>
<section class="section-container">
    <h3>Dropdown</h3>
    <div class="f11y--dropdown dropdown--js">
        <button id="dropdown__toggle" type="button" aria-haspopup="true" aria-controls="dropdown__inner">Dropdown</button>
        <ul id="dropdown__inner" role="menu" aria-hidden="true" aria-labelledby="dropdown__toggle">
            <li>Menu Item 1</li>
            <li>Menu Item 2</li>
            <li>Menu Item 3</li>
        </ul>
    </div>
</section>