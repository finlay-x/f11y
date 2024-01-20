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
        <link rel="stylesheet" rel="preload" as="style" href="../docs/assets/styles/app.min.css"/>
    </head>
    <body class="<?php echo $bodyClass;?>">
        <a class="is-visually-hidden skip-content" role="link" title="Skip to content" href="#content">Skip To Content</a>
        <div id="page" class="site-content">
            <header id="masthead" class="site-header">
                <div class="content-width base-layout">
                    <h1 class="has-no-margin">f11y</h1>
                </div>
            </header>
            <main id="content" class="entry-content">
                <article class="hentry">