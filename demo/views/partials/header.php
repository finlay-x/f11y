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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap" rel="stylesheet">
        <link rel="stylesheet" rel="preload" as="style" href="../style.css"/>
        <link rel="stylesheet" rel="preload" as="style" href="../../dist/styles/f11y.min.css"/>
    </head>
    <body class="<?php echo $bodyClass;?>">
        <div id="page" class="site-content">
            <header id="masthead" class="site-header">
                <h1>
                    <img src="/f11y/demo/f11y-logo.svg" width="100">
                </h1>
            </header>
            <main id="content" class="entry-content">
                <article class="hentry">