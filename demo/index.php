<?php 
//Include Functions
include "functions.php";

header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
die( header( 'location: views/page--home.php' ) );