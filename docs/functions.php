<?php declare(strict_types=1);

/** 
 * Redirect to the homepage template if functions or blank slug is accessed
 */
if ( $_SERVER['REQUEST_METHOD']=='GET' && realpath(__FILE__) == realpath( $_SERVER['SCRIPT_FILENAME'] ) ) {        
    header( 'HTTP/1.0 403 Forbidden', TRUE, 403 );
    die( header( 'location: index.php' ) );
}else{
    

    /** 
     * GLOBAL Variables
     */
    

    /**
     * Global Functions
     */
        /**
         * Wrapper function for include() - to allow for passing specific variables/values to specific partials.
         * 
         * @param   string $name The file path to the desired partial - starting within ./views/partials/
         * @param   array $parameters [optional] An array of 'key' => value pairs you want passed to the partial
         */
        function render_partial(string $name, array $parameters = array()) {
            $_dir = __DIR__ . '/views/partials/';
            include( $_dir . $name . '.php' );
        }

        /**
         * Returns a random string of numbers - useful for mocking data-id attributes.
         * 
         * @param   int $length [optional] Defines the length of the number string
         * @return  string
         */
        function generate_random_string(int $length = 4) : string {
            $characters = '0123456789';
            $charactersLength = strlen($characters);
            $randomString = '';
            for ($i = 0; $i < $length; $i++) {
                $randomString .= $characters[rand(0, $charactersLength - 1)];
            }
            return $randomString;
        }

    /**
     * Other Utils
     */
        /**
         * For HTML file generation purposes - Get Filename and create HTML file path with it.
         */

        function create_html_file(){
            $filename = basename($_SERVER['SCRIPT_FILENAME']);
            $html_path = __DIR__ . '/' . basename($filename, ".php") . '.html';
            file_put_contents(
                html_entity_decode($html_path), 
                ob_get_contents()
            );
        }
}