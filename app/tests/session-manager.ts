import test from 'tape'

import { withResolvers, withTimeout } from './utils.ts'
import { SessionManager, AbstractSession } from '../src/services/index.ts'
import Envelope from '../src/services/Envelope.ts'

test('SessionManager', async t => {
    t.comment('Creating');
    const aliceConn = SessionManager.create({ name: 'Alice' });
    const bobConn = SessionManager.create({ name: 'Bob' });
    t.ok(aliceConn instanceof AbstractSession);
    t.ok(bobConn instanceof AbstractSession);

    t.comment('Connecting');
    await aliceConn.setup();
    await bobConn.setup();
    await aliceConn.connect(aliceConn.getId());
    await bobConn.connect(aliceConn.getId());
    t.ok(aliceConn.connected);
    t.ok(bobConn.connected);

    t.comment('Message passing: Bob sends a message to Alice. Alice sees the message.');
    const received = withResolvers<any>();
    const timelyReceived = withTimeout(60 * 1000, received);

    const testPayload = 'hi';

    aliceConn.onEnvelope = (x: Envelope) => {
        received.resolve(x);
        t.ok(true, 'receive an envelope');
        t.equal(x.payload, testPayload, 'the correct payload');
        t.equal(x.senderId, bobConn.getId(), 'the correct sender');
        t.end();
    }

    const sent = await bobConn.send({ payload: testPayload }, aliceConn.getId());
    t.ok(sent, 'bob sends the message successfully');

    await timelyReceived;

    t.comment('Cleaning up');
    await aliceConn.destroy();
    await bobConn.destroy();

    t.comment('Done.');
});
