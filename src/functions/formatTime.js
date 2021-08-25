import "jquery";

export const formatTime = (date) => {
    var strDate = date;
    var regex = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/;
    var arrDate = regex.exec(strDate); 
    var objDate = new Date(
        (+arrDate[1]),
        (+arrDate[2])-1, // Month starts at 0!
        (+arrDate[3]),
        (+arrDate[4]),
        (+arrDate[5]),
        (+arrDate[6])
    );

    /* Convert the date object to string with format of your choice */

    var newDate = objDate.getMonth() + 1 + '/' + objDate.getDate() + '/' + objDate.getFullYear();

    /* Get the time in your format */

    var newTime = objDate.toLocaleString('en-US', { hour: 'numeric',minute:'numeric', second: 'numeric', hour12: true });

    /* Concatenate new date and new time */
    var newDateTime = (newDate + " " + newTime);
    
    return newDateTime;
}