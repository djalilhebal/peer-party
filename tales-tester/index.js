import {default as test} from 'tape';

import ParticipantAgent from './ParticipantAgent.js';

import {nar} from './ParticipantAgent.js';

/**
 * Sleep.
 * @param {number} seconds
 */
function delay(seconds) {
    return new Promise(r => setTimeout(r, seconds * 1000));
}

// ---

export { ParticipantAgent };
export {nar};

export { test, test as tale};

export { delay };
