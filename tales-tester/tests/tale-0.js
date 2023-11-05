import { tale, ParticipantAgent, delay, nar } from "../index.js";
import assert from 'node:assert';
// import playwright's assert as assertWeb

// Let's assume the server is already running.
const website = 'http://localhost:5173';
//const movieHigh = 'CHARADE_1953.mp4';
const movieLow = 'CHARADE_1953_512kb.mp4';

tale('Alice Alone', async (t) => {
    const alice = new ParticipantAgent({
        name: 'Alice',
    });

    await alice.setup();

    nar('Alice goes to the website');
    await alice.goto(website);

    await alice.check('input[value=OWNER]');
    await alice.setInputFiles('input[type=file]', movieLow);
    await alice.getByLabel('Start').click();

    nar('Alice starts watching the video')
    await alice.waitForVideoPlayable();
    await alice.click('video');
    assert(await alice.checkVideoPlaying());
    await delay(3);
    await alice.toggleVideoPlay();
    assert(await alice.checkVideoPlaying());
    
    await alice.seek('24:40');
    await delay(2);
    assert(await alice.checkApproxVideoPosition('24:42'));
    
    await alice.done;
});
