import { AbstractSession } from ".";
import MqttSession from "./MqttSession.ts";

// XXX: Naming: Transport, Connection, Session, Socket, Channel, Room, Link, or what?
export default class SessionManager {
    static defaultImpl = 'MQTT';

    static create({name}): AbstractSession {
        let instance;

        switch(SessionManager.defaultImpl) {
            case 'MQTT':
                instance = new MqttSession();
                break;
            default:
                throw new Error(`Unknown session type '${SessionManager.defaultImpl}'`);
        }

        instance.name = name;

        return instance;
    }
}
