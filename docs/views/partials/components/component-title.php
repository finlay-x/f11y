<?php declare(strict_types=1);

/* Assign default $parameters values */ 
$titleContent = 'Component Name';

/* Extract variables from $parmeters array keys and overwrite collisions */
extract($parameters, EXTR_OVERWRITE);

echo '
<div class="component--title f11y-white">
    <span class="x-l-h uses-garamond weight-700">#</span>
    <h2 class="h-h uses-garamond">' . $titleContent . '</h2>
</div>';