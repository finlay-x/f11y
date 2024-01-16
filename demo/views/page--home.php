<?php declare(strict_types=1);
/**
 * Name: Home Page Template
 * Description: Template for the homepage of the website.
 * 
 * 'page--' prefixed are major cornerstone content pages, usually less flexible in structure
 */


/* Include Functions */
include "../functions.php";

/* Get Site Header */
render_partial(
    'header',
    array()
);


/* Get Content */
render_partial(
    'components/component__accordion', 
    array()
);

render_partial(
    'components/component__layer', 
    array()
);

render_partial(
    'components/component__tooltip', 
    array()
);

render_partial(
    'components/component__dropdown', 
    array()
);

render_partial(
    'components/component__tabs', 
    array()
);

render_partial(
    'components/component__toast', 
    array()
);

render_partial(
    'components/component__input-slider', 
    array()
);

render_partial(
    'components/component__table', 
    array()
);

/* Get Site Footer */
render_partial(
    'footer', 
    array()
);
