import { useState, useRef, useEffect } from 'react';

import { COMMAND } from '../model/constants';
import { useAppStore } from '../model/store';
import Chat from './Chat';

import './Theater.css';

/**
 * AKA WatchPage
 */
export default function Theater() {
    /**
     * @type {React.MutableRefObject<HTMLVideoElement>}
     */
    const videoRef = useRef(null);
    const messages = useAppStore(state => state.messages);
    const videoInfo = useAppStore(state => state.videoInfo);

    function getLiveVideoState() {
        const position = videoRef.current.currentTime;
        const paused = videoRef.current.paused;
        return {
            position,
            paused,
        };
    }

    function setLiveVideoState(videoState) {
        const v = videoRef.current;
        const { position, paused } = videoState;
        if (paused) {
            v.pause();
        } else {
            v.play();
        }
        v.currentTime = position;
        //v.fastSeek(position);
    }

    useEffect(function registerHandler() {
        const handler = (/** @type {import('../model/types').Envelope} */ data) => {
            if (data.type !== COMMAND.setVideoState) {
                return;
            }
            setLiveVideoState(data.payload);
        }
        api.handlers.add(handler);

        return () => {
            api.handlers.delete(handler);
        };
    }, []);

    function pushVideoState() {
        api.send(null, {
            type: COMMAND.setVideoState,
            payload: getLiveVideoState(),
        });
    }

    return (
        <main className='theater'>
            <video className='theater__video' ref={videoRef}
                src={videoInfo.fileObj}
                controls={true}
                onPause={pushVideoState} onPlay={pushVideoState} onSeeked={pushVideoState}
            />
            <Chat messages={messages} />
        </main>
    )
}
