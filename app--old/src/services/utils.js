/**
 * - See https://stackoverflow.com/questions/1322732
 * - Works well as long as timestamp is < 24h.
 * @todo Use something better!
 * 
 * @param {number} seconds 
 * @returns {string} HH:MM:SS or MM:SS string
 */
export function secondsToTimestamp(seconds) {
    const timestamp = new Date(seconds * 1000).toISOString().substr(11, 8);
    if (timestamp.substr(0, 2) === '00') {
        return timestamp.substr(3);
    }
    return timestamp;
};
