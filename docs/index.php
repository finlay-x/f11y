<?php declare(strict_types=1);

ob_start();

//Include Functions
include "functions.php";

render_partial(
    'header', 
    array()
);

echo 'Hello';

render_partial(
    'footer', 
    array()
);

create_html_file();
ob_end_flush();