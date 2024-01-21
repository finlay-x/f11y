<?php declare(strict_types=1);
/**
 * Name: Site Header
 * Description: This is the <head></head>, <header></header> and opening body tags for the site.
 * 
 * @param   array   $parameters   [optional] Array of 'key' => 'value' pairs that are exclusive to each instance of this partial.
 * 
 * $parameters :
 *    'bodyClass'   string   [optional] Any additional classes that need to be added to the <body></body>
 */

/* Assign default $parameters values */ 
$bodyClass = '';

/* Extract variables from $parmeters array keys and overwrite collisions */
extract($parameters, EXTR_OVERWRITE);
?>


<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="description" content="Meta description of this page.">
        <title>f11y</title>
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=EB+Garamond:ital,wght@0,400..800;1,400..800&family=Figtree:ital,wght@0,300..900;1,300..900&display=swap" rel="stylesheet">
        <link rel="stylesheet" rel="preload" as="style" href="../docs/assets/styles/app.min.css"/>
        <link rel="stylesheet" rel="preload" as="style" href="../docs/assets/vendor/styles/prism.css"/>
    </head>
    <body class="<?php echo $bodyClass;?>">
        <a class="is-visually-hidden skip-content" role="link" title="Skip to content" href="#content">Skip To Content</a>
        <div id="page" class="site-content">
            <header id="masthead" class="site-header">
                <div class="content-width base-layout">
                    <h1 class="has-no-margin x-l-b">
                        <span class="is-visually-hidden">f11y</span>
                        <img alt="f11y logo" width="85" src="../docs/assets/f11y-logo.svg">
                    </h1> 
                    <h2 class="is-margin-centered is-text-centered x-l-b f11y-white weight-200 is-italic">A functionality component library written in pure JavaScript <sup class="weight-600 s-b">+JSDoc</sup> for pure JavaScript <sup class="weight-600 s-b">with TS support</sup></h2>
                </div>
            </header>
            <main id="content" class="entry-content">
                <article class="hentry">