import { Peer } from 'peerjs/dist/bundler.mjs';

/**
 * Peerjs-based transport service.
 */
export default class TransportService {

    /**
     * @type {string?}
     */
    static lastPeerId = null;

    /**
     * @type {import('peerjs').Peer}
     */
    static peer = null;

    /**
     * @type {Set<import('peerjs').DataConnection>}
     */
    static conns = new Set();

    /**
     * @type {import('peerjs').DataConnection}
     */
    static conn = null;

    static isOwner = false;

    /**
     * Default envelope handler.
     * It does nothing except log the object.
     * 
     * @param {import('../model/types').Envelope} envelope
     */
    static handlerNoop = function noop(envelope) {
        console.log('Received envelope', envelope);
    }

    /**
     * @type {Set<typeof TransportService.handlerNoop>}
     */
    static handlers = new Set([TransportService.handlerNoop]);

    /**
     * @public
     */
    static init() {
        const peer = new Peer(null, {
            debug: 2 // Prints errors and warnings.
        });
        TransportService.peer = peer;

        peer.on('open', function (id) {
            console.log('Opened connection to PeerJS signaling server.', { id });

            // Workaround for peer.reconnect deleting previous id
            if (peer.id === null) {
                console.log('Received null id from peer open');
                peer.id = TransportService.lastPeerId;
            } else {
                TransportService.lastPeerId = peer.id;
            }
        });

        peer.on('connection', function (c) {

            // Disallow incoming connections
            if (!TransportService.isOwner) {
                c.on('open', function () {
                    console.warn('Sender does not accept incoming connections. Closing conn...');
                    setTimeout(function () { c.close(); }, 500);
                });
                return;
            }

            // Think: Latest connection
            TransportService.conn = c;
            TransportService.conns.add(c);
            console.log('Connected to: ' + c.peer);
            TransportService.setupConnHandlers(c);
        });

        peer.on('disconnected', function () {
            console.warn('Connection lost. Reconnecting...');

            // Workaround for peer.reconnect deleting previous id
            peer.id = TransportService.lastPeerId;
            peer._lastServerId = TransportService.lastPeerId;
            peer.reconnect();
        });

        peer.on('error', function (err) {
            console.error(err);
        });

    }

    /**
     * Add event listenevers to a conn.
     * Should be triggered once a connection has been achieved.
     * 
     * @param {import('peerjs').DataConnection} conn
     * @private
     */
    static setupConnHandlers(conn) {
        conn.on('data', function (data) {
            const connPeerId = conn.peer;
            const senderUrn = `peerjs:peer:${connPeerId}`;
            console.log(`Data recieved from ${senderUrn}`, data);

            try {
                // TODO: Validate data...

                const envelope = /** @type {import('../model/types').Envelope} */ (data);
                envelope.senderId = connPeerId;
                TransportService.handlers.forEach(fn => fn(envelope));
            } catch (e) {
                console.error('Failed to parse', e);
                return;
            }
        });

        conn.on('close', function () {
            if (!TransportService.isOwner) {
                TransportService.conn = null;
            } else {
                TransportService.conn = null;
                TransportService.conns.delete(conn);
            }
        });
    }

    /**
     * Used by the viewer.
     * 
     * @param {string | null} peerId
     * @param {object} obj
     * @public
     */
    static send(peerId, obj) {
        console.log('send', {peerId, obj});

        let c;
        if (peerId) {
            c = TransportService.peer.connections[peerId];
        } else {
            c = TransportService.conn;
        }

        if (!c) {
            console.warn('Could not find a destination connection');
            return;
        }
        c.send(obj);
    }

    /**
     * Used by the server.
     * 
     * @public
     */
    static broadcast(x) {
        TransportService.conns.forEach(c => {
            c.send(x);
        });
    }

    /**
     * Used by viewer.
     * 
     * @param {string} peerId
     */
    static join(peerId) {
        // Close old connection
        if (TransportService.conn) {
            TransportService.conn.close();
        }

        // Create connection to destination peer specified in the input field
        const conn = TransportService.peer.connect(peerId, {
            reliable: true
        });
        TransportService.conn = conn;

        conn.on('open', function () {
            console.log(`Connected to: ${conn.peer}`);
        });

        conn.on('data', function (data) {
            TransportService.handlers.forEach(fn => fn(data));
        });

        conn.on('close', function () {
            console.error('HUH', conn);
        });
    };

}

globalThis.api = TransportService;
