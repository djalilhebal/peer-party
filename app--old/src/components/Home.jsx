import { useEffect, useState } from 'react';

import { useAppStore } from '../model/store';

import TransportService from '../services/TransportService';
import CommandsService from '../services/CommandsService';

import RadioCard from './RadioCard';
import Step from './Step';

function getKeyFromUrl() {
    const searchParams = new URLSearchParams(document.location.search);
    const val = searchParams.get('key');
    return val;
}

/**
 * 
 * @param {any} state 
 * @returns {boolean}
 */
function calculateCanStart(state) {
    const { isOwner, videoInfo } = state;
    if (isOwner) {
        return !!videoInfo.fileObj;
    } else {
        return state.current && videoInfo.fileObj;
    }
}


/**
 * Boarding page?
 */
export default function Home() {
    const state = useAppStore();
    const [key, setKey] = useState(getKeyFromUrl);
    const keyedLink = `https://peerparty.djalil.me?key=${key}`
    const canStart = calculateCanStart(state);
    const { isOwner, setIsOwner, setStarted } = state;

    useEffect(function init() {
        TransportService.init();
    }, []);

    useEffect(function () {
        TransportService.isSender = !isOwner;
    }, [isOwner]);

    useEffect(function () {
        if (key && !isOwner) {
            const peerId = key;
            TransportService.join(peerId);
        }
    }, [key]);

    /**
     * @type {string?}
     */
    const extensionlessName = state?.videoInfo?.name.substring(0, state?.videoInfo?.name?.lastIndexOf('.'));
    const topicOrFilename = state.topic || extensionlessName || '';

    function onTopicChange(e) {
        const val = e.target.value;
        state.setTopic(val);
    }

    async function onShareClicked() {
        const shareData = {
            title: "PeerParty",
            text: "Let's watch together on PeerParty!",
            url: keyedLink,
        };
        await navigator.share(shareData);
    }

    function onStartClicked() {
        setStarted(true);
    }

    function onFileChanged(e) {
        /** @type {FileList} */
        const files = e.target.files;
        if (files.length === 1) {
            const file = files[0];
            const { name, size } = file;
            const fileObj = URL.createObjectURL(file);
            const videoInfo = { fileObj, name, size };
            state.setVideoInfo(videoInfo);
        }
    }

    return (
        <section>
            <h1>PeerParty</h1>

            <Step>
                Hey, what do you want to do? <br />
                <div className="radiogroup">
                    <RadioCard name="owner" checked={isOwner} onSelect={() => setIsOwner(true)}>Host</RadioCard>
                    <RadioCard name="owner" checked={!isOwner} onSelect={() => setIsOwner(false)}>Join</RadioCard>
                </div>
            </Step>

            <Step>
                <label>Nickname</label>
                <input minLength={3} type="text" required />
            </Step>

            <Step>
                <label>Party key</label>
                <input onChange={e => setKey(e.target.value)} value={key} readOnly={isOwner} />

                {key && isOwner
                    ?
                    <div className="share-section">
                        Link to party:
                        <textarea value={keyedLink} readOnly={true}></textarea>
                        <button onClick={onShareClicked}>Share</button>
                    </div>
                    :
                    null
                }
            </Step>

            <Step>
                Video file: <input type="file" accept="video/*" onChange={onFileChanged} required />
                <br />
                Party name: <input type="text" onChange={onTopicChange} value={topicOrFilename} required />
            </Step>

            <Step>
                <button disabled={!canStart} onClick={onStartClicked}>Start</button>
            </Step>

        </section>
    );
}
