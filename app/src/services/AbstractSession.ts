import Envelope from "./Envelope.ts";

export default abstract class AbstractSession {

    /**
     * - Rename? setup, init
     */
    public setup() {
        // noop
    }

    /**
     * - Rename? end, close, shutdown, destroy, teardown
     */
    public destroy() {
        // noop
    }

    public name: string = 'Unnamed';

    private _connected: boolean = false;
    public get connected(): boolean {
        return this._connected;
    }
    public set connected(value: boolean) {
        this._connected = value;
    }

    abstract connect(key: string): Promise<boolean>;

    abstract getId(): string;

    abstract send(x: Envelope, destinationId: string): Promise<boolean>;

    public onEnvelope = function defaultEnvelopeHandler(x: Envelope) {
        console.log('received envelope', x);
    }
}
