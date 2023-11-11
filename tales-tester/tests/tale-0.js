import assert from 'node:assert';
// import playwright's assert as assertWeb
import { tale, ParticipantAgent, delay, nar } from "../index.js";

// Let's assume the server is already running.
const website = 'http://localhost:5173';
//const movieHigh = 'CHARADE_1953.mp4';
const movieLow = 'CHARADE_1953_512kb.mp4';

tale('Alice Alone', async (t) => {
    const alice = ParticipantAgent.create({
        name: 'Alice',
    });

    await alice.setup();

    nar('Alice goes to the website');
    await alice.goto(website);

    nar('Alice fills the form and starts');
    await alice.check('input[value=OWNER]');
    await alice.fill('input[name=nickname]', 'Arisu');
    await alice.setInputFiles('input[type=file]', movieLow);
    await alice.getByLabel('Start').click();

    nar('Alice begins watching the video');
    await alice.waitForVideoPlayable();
    await alice.click('video');
    await delay(1);
    t.ok(await alice.checkVideoPlaying(), 'should be playing');
    await delay(3);
    await alice.toggleVideoPlay();
    assert.strictEqual(false, await alice.checkVideoPlaying());

    const t1 = '24:40';
    const d1 = 2;
    const t2 = '24:42';
    nar(`Alice seeks to an interesting scene at ${t1} and resumes playing...`);
    await alice.seekVideoPosition(t1);
    await alice.toggleVideoPlay();
    await delay(d1);
    nar(`After ${d1} seconds, she checks the video state to see if it reflects the expected state: It is playing and approx ${t2}.`);
    t.ok(await alice.checkVideoPlaying(), 'should be playing');
    t.ok(await alice.checkApproxVideoPosition(t2), 'near the correct position');

    await alice.close();
});
