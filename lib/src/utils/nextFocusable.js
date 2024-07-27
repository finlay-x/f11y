/**
 * Returns the next item to focus on
 * @param   {Node|HTMLElement} current Item that currently has focus
 * @param   {HTMLElement[]|Node[]} itemList List of focusable items
 * @param   {Node|HTMLElement} firstItem Predefined first item to use
 * @param   {Node|HTMLElement} lastItem Predefined last item to use
 * @param   {"forward"|"backward"} movement Moving focus forward or backward
 * @param   {Function} finalCallback Function ran at end of function, usually used for focusing to target
 * @param   {Function} onEndingBlurCallback Function ran if current item is at start or end of array
 * @param   {Boolean} looping Does the focus loop back to the beginning/end.
 * @returns {Node|HTMLElement|undefined} The item that should receive focus
 */
function nextFocusable(
    current,
    itemList,
    firstItem,
    lastItem,
    movement = "forward",
    looping = true,
    finalCallback = () => {},
    onEndingBlurCallback = () => {}
) {
    if(!current || !itemList) return;

    const first = firstItem ?? itemList[0];
    const last = lastItem ?? itemList.at(-1);

    /** @type {Node|HTMLElement|undefined} */
    let target = undefined;

    /** @type {Number} */
    let index = itemList.indexOf(current);

    switch(movement){
        case "forward":
            if(current === last){
                if(onEndingBlurCallback() === true) return;
                if(looping) target = first;
                else return;
            } else{
                target = itemList[index + 1];
            }
        break;

        case "backward":
            if(current === first){
                if(onEndingBlurCallback() === true) return;
                if(looping === true) target = last;
                else return;
            } else{
                target = itemList[index - 1];
            } 
        break;

        default:
        break;
    }

    finalCallback(target);
    return target;
}

export default nextFocusable