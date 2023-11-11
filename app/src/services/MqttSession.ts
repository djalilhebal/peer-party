import { v4 as uuidv4 } from 'uuid';
//import * as mqtt from 'mqtt/dist/mqtt.min';
import * as mqtt from 'mqtt';

import AbstractSession from './AbstractSession.ts';
import Envelope, { Envelopes } from './Envelope.ts';


export default class MqttSession extends AbstractSession {
    /**
     * Some public broker.
     * HiveMQ
     */
    static readonly MQTT_BROKER_HOST = 'broker.mqttdashboard.com';

    private myId = '';
    private sessionKey = '';

    // MQTT and MQTT.js stuff
    private static readonly EXACTLY_ONCE = 2;

    private mqttOptions = {
        clientId: '',
    };
    private client: mqtt.MqttClient | undefined;
    // Set by `connect`
    private mqttTopic = '';
    private mqttQos: typeof MqttSession.EXACTLY_ONCE = MqttSession.EXACTLY_ONCE;

    constructor() {
        super();
        
        this.genAndSetId();
    }

    get connected() {
        return !!this.client && this.client.connected;
    }

    /**
     * @remarks
     * 
     * - MQTT.js's default client id is `'mqttjs_' + Math.random().toString(16).substr(2, 8)`.
     *  How secure and collision-resistant is it?
     *  Let's just use UUID V4.
     */
    private genAndSetId() {
        const uuid = uuidv4();
        const mqttClientId = `mqttjs/pp/${uuid}`;

        this.myId = uuid;
        this.mqttOptions.clientId = mqttClientId;
    }

    public getId(): string {
        return this.myId;
    }

    /**
     * @remarks
     * - Called by {@link Role.OWNER}.
     */
    public getRoomKey(): string {
        // Meh, but works
        return this.myId;
    }

    public async setup(): Promise<void> {
        await this.ensureConnected();
    }

    public async destory(): Promise<void> {
        await this.client?.endAsync();
    }

    public async send(x: Envelope, destinationId: string) {
        const y = Envelopes.copy(x);
        y.destinationId = destinationId;
        y.senderId = this.getId();

        this.client?.publishAsync(this.mqttTopic, JSON.stringify(y), { qos: this.mqttQos });

        return true;
    }

    // Some message was sent to this topic. Should we accept it?
    private onRawMessage(rawMessage: string) {
        // Is a valid Envelope?
        if (!Envelopes.isValid(rawMessage)) {
            return;
        }

        // Is it meant for us?
        // Sure, we could just publish and subscribe to `/rooms/{sessionKey}/participants/{participantId}/messages`
        // but... no.
        const envelope = Envelopes.parse(rawMessage);
        if (envelope.destinationId !== this.myId) {
            return;
        }

        this.onEnvelope(envelope);
    }

    /**
     * Connect and start listening to the session topic.
     * 
     * - Called by {@link Role.VIEWER}
     */
    async connect(sessionKey: string) {
        await this.ensureConnected();

        // TODO: Remove existing subscription.
        // Kinda important if the user joins the wrong room (topic).

        this.sessionKey = sessionKey;
        this.mqttTopic = `room/${sessionKey}`;
        this.client!.subscribe(this.mqttTopic, { qos: this.mqttQos }, _err => { });
        this.client!.on("message", (topic, message) => {
            this.onRawMessage(message.toString());
        })

        // This is always true, no?
        return this.client!.connected;
    }

    /**
     * Ensure connected to the broker.
     */
    private async ensureConnected() {
        const mqttUrl = 'mqtt://' + MqttSession.MQTT_BROKER_HOST;

        /*
        const client = mqtt.connect(mqttUrl, this.mqttOptions);
        client.on('connect', () => {
            client.subscribe('presence', (err) => {
                if (!err) {
                client.publish("presence", "Hello mqtt");
                }
            });
        });
        */

        const client = await mqtt.connectAsync(mqttUrl, this.mqttOptions);

        this.client = client;
    }
}
