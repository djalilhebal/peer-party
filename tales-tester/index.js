import { default as test } from 'tape';

import ParticipantAgent from './ParticipantAgent.js';

// Tape
export const tale = test;
tale.onFailure(() => {
    process.exit(1);
});

export function nar(str) {
    console.info(`[Narrator] ${str}`);
}

/**
 * Sleep.
 * 
 * @param {number} seconds
 */
export function delay(seconds) {
    return new Promise(r => setTimeout(r, seconds * 1000));
}

// --- Exporting imported stuff ---

export { ParticipantAgent };
