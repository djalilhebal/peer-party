/**
 * @readonly
 * @enum {string}
 */
export const COMMAND = {
    message: 'message',
    typing: 'typing',

    getVideoState: 'getVideoState',
    setVideoState: 'setVideoState',

    // IRC-inspired
    topic: 'topic',
    nick: 'nick',
    who: 'who',
};

/**
 * @readonly
 * @enum {string}
 * @see https://ircv3.net/specs/client-tags/typing
 */
export const TYPING = {
    active: 'active',
    paused: 'paused',
    done: 'done',
};
