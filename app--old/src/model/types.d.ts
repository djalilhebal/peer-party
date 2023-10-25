import { COMMAND, TYPING } from "./constants"

export interface Participant {

    /**
     * Public ID
     */
    id: string,

    /**
     * Nickname
     * Readonly?
     */
    nick: string,

    /**
     * Readonly?
     */
    isOwner: boolean,

    typing: {
        status: TYPING,
        /** ISO */
        timestamp: string,
        time: number,
    }
}

interface Message {
    id
    sender
    text
    timestamp
}


/**
 * Inspired by Flux actions.
 */
export interface Envelope {
    /**
     * Set by server
     */
    senderId?: string,

    /**
     * think: ReplyWith
     * Set by the client and copied by the server.
     */
    correlationId?: string,

    type: COMMAND,

    payload: any,

}
