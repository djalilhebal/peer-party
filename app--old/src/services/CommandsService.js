import { COMMAND } from "../model/constants";
import { useAppStore } from "../model/store";
import TransportService from "./TransportService";

export default class CommandsService {
    /**
     * Key generator
     * @private
     */
    static i = 0;
    static getNextId() {
        return ++CommandsService.i;
    }

    static isTransportReady() {
        return TransportService.peer?.open && TransportService.conn?.open;
    }

    /**
     * Send a command that expects no reply. Fire and forget.
     * 
     * @param {string} to Destination id
     * @param {import("../model/types").Envelope} obj 
     * @returns {void}
     * @public
     */
    static sendNotification(to, obj) {
        if (!CommandsService.isTransportReady()) {
            return;
        }

        TransportService.send(to, obj);
    }

    /**
     * Send a request that expects a reply.
     * 
     * @param {import("../model/types").Envelope} obj 
     * @returns {Promise<import("../model/types").Envelope>}
     * @public
     */
    static sendRequest(obj) {
        if (!CommandsService.isTransportReady()) {
            return Promise.reject('Transport is not ready.');
        }

        const replyPromise = new Promise((res, rej) => {
            obj.correlationId = '' + CommandsService.getNextId();
            const onReply = data => {
                if (data.correlationId === obj.correlationId) {
                    if (data.result) {
                        res(data);
                    } else {
                        rej(data);
                    }
                    TransportService.handlers.delete(onReply);
                    return;
                }
            };
            TransportService.handlers.add(onReply);
            TransportService.send(null, obj);
        });
        return replyPromise;
    }

}


function genericHandler(x) {
    const state = useAppStore(state => state);

    if (!x.type || !x.payload) {
        return;
    }

    let result = null;
    const { correlationId, type, senderId, payload } = x;

    switch (type) {

        case COMMAND.nick: {
            const requestedNick = payload;
            const p = state.participants.find(p => p.nick === requestedNick);
            if (p) {
                // Already registered
                result = false;
            } else {
                const newParticipant = {
                    nick: requestedNick,
                };
                state.participants.push(newParticipant);
                result = true;
            }
            break;
        }

        case COMMAND.message: {
            state.messages.push(payload);
            break;
        }

        case COMMAND.typing: {
            const p = state.participants.find(p => p.id === senderId);
            p.typing = payload;
            break;
        }

        case COMMAND.who: {
            api.send(senderId,)
            result = state.participants;
            break;
        }

        case COMMAND.topic: {
            state.topic = payload;
            break;
        }

        case COMMAND.getVideoState: {
            result = state.videoState;
            break;
        }

        case COMMAND.setVideoState: {
            state.videoState = payload;
            //broadcast
            break;
        }

    }

    if (correlationId) {

    }

};
