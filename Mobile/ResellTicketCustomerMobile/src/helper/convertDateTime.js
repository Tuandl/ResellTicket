import moment from 'moment';

/**
 * Convert into local time and return DateTime object
 * @param {DateTime} utcDateTime 
 */
function convertToLocalFromUTC(utcDateTime) {
    return moment.utc(utcDateTime).local().toDate();
}

export default {
    convertToLocalFromUTC,
};