<?php declare(strict_types=1);

ob_start();

//Include Functions
include "functions.php";

render_partial(
    'header', 
    array()
);

render_partial(
    'sections/section-intro', 
    array()
);

render_partial(
    'sections/section-accordion', 
    array()
);

render_partial(
    'sections/section-layer', 
    array()
);

render_partial(
    'footer', 
    array()
);

create_html_file();
ob_end_flush();