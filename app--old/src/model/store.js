import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

function getInitialState() {
    return {
        /**
         * The current "logged in" user.
         * @type {import('./types').Participant}
         */
        current: null,

        /**
         * All participants, including the current user.
         * @type {Array<import('./types').Participant>}
         */
        participants: [],

        /**
         * Started the watch session?
         * @type {boolean}
         */
        started: false,

        topic: '',

        ownerVideoInfo: {
            filename: '',
        },

        videoInfo: {
            name: '',
            size: 0,
            fileObj: '',
        },
        
        videoState: {
            position: 0,
            paused: true,
        },
        messages: [
            {
                id: 1,
                sender: 'Arisu',
                text: 'This scene is sick'
            },

            {
                id: 2,
                sender: 'Bandersnatch',
                text: 'ikr'
            },
        ],
    }

}

export const useAppStore = create(
    immer((set) => ({
        ...getInitialState(),

        setTopic: (val) => {
            set((state) => {
                state.topic = val;
            })
        },

        setIsOwner: (val) => {
            set((state) => {
                state.isOwner = val;
            })
        },

        setVideoInfo: (info) =>
            set((state) => {
                //URL.revokeObjectURL(state.videoInfo?.fileObj);
                state.videoInfo = info;
            }),

        setStarted: (val) =>
            set((state) => {
                state.started = val;
            }),

    }))
);
