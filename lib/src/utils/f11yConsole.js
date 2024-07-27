/**
 * @param {string} message Message to console warn
 */
function f11yConsole(message){
    console.warn(
        `%cf11y`,
        'background-color:#161d27;color:#5584fc;font-weight:bold;padding:3px 3px 3px 4px;border-radius:5px;',
        message
    )
} 

export default f11yConsole