import assert from 'node:assert';
import { expect } from '@playwright/test';
import { tale, ParticipantAgent, delay, nar } from "../index.js";
import { blackboard } from '../blackboard.js';

//Interesting: `await page.locator('_react=BookItem').click();`

// Let's assume the server is already running.
const website = 'http://localhost:5173';
//const movieHigh = 'CHARADE_1953.mp4';
const movieFile1 = 'CHARADE_1953_512kb.mp4';
const movieFile2 = 'CHARADE_1953.ogv';

/**
 * - IDEA/UX:
 * default role = code in URL ? VIEWER : OWNER.
 * The fewer buttons someone has to click the better.
 * 
 * - What's the point of the blackboard if both "agents" run in the same function?
 * Good question. I plan on refactoring this thing to separate them.
 */
tale('Toxic Alice', async t => {
    const alice = ParticipantAgent.create({
        name: 'Alice',
        browserType: 'msedge',
    });
    const bob = ParticipantAgent.create({
        name: 'Bob',
        browserType: 'chrome',
    });
    await Promise.all([alice.setup(), bob.setup()]);

    nar(`${alice} visits the website`);
    await alice.goto(website);

    nar(`${alice} creates a new session to watch Charade.`);
    const aliceNick = 'Arisu';
    await alice.check('input[value=OWNER]');
    await alice.fill('input[name=nickname]', aliceNick);
    await alice.setInputFiles('input[type=file]', movieFile1);
    await alice.getByLabel('Start').click();

    nar(`${alice} begins watching the video once it's playable.`);
    await alice.waitForVideoPlayable();
    await alice.click('video');

    // Sharing
    await expect(alice.page).toHaveURL('code=');
    const aliceRoomLink = alice.page.url();
    nar(`${alice} sends the link to ${bob} (via the blackboard)`);
    blackboard.roomLink.resolve(aliceRoomLink);
    
    nar(`${bob} waits for the link...`);
    const bobLink = await blackboard.roomLink;
    const bobNick = 'Bandersnatch';
    nar(`then she visits the link and joins the session.`);
    await bob.goto(bobLink);

    await alice.check('input[value=VIEWER]');
    await alice.fill('input[name=nickname]', bobNick);
    await alice.setInputFiles('input[type=file]', movieFile2);
    await alice.getByLabel('Start').click();

    const bobHelloText = 'yoooo';
    nar(`${bob} announces his arrival by sending "${bobHelloText}"`);
    await bob.sendMessage(bobHelloText);
    assert(await bob.seesMessage(bobHelloText, true));

    const sceneStartTimestamp = '24:40';
    nar(`Some time passes, something dramatic happens, ${bob} wants to comment on it.`);
    nar(`so he pauses the video and rewinds to ${sceneStartTimestamp}`);

    await delay(0.2);
    assert(await bob.checkApproxState({paused: true, timestamp: sceneStartTimestamp}));
    assert(await alice.checkApproxState({paused: true, timestamp: sceneStartTimestamp}));

    const bobCommentText = 'Dude, did you see that?';
    nar(`${bob} sends "${bobCommentText}"`);
    await bob.sendMessage(bobCommentText);

    nar(`When ${alice} sees ${bob}'s message...`);
    await alice.seesMessage(bobHelloText);
    nar('she replies');
    await alice.sendMessage('Stfu and watch');
    nar('and then resumes playing the video.');
    await alice.toggleVideoPlay();

    const d1 = 2;
    const newTimestamp = '24:42';
    await delay(d1);

    assert(`${alice}'s video should be playing and around ${newTimestamp}.`);
    await alice.checkVideoPlaying();
    await alice.checkVideoApproxPosition(newTimestamp);

    assert(`${bob}'s video should be playing and around ${newTimestamp}.`);
    await bob.checkVideoPlaying();
    await bob.checkVideoApproxPosition(newTimestamp);

    // ---

    nar('The end.');
    await Promise.all(alice.close(), bob.close());
});
