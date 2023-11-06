import { VideoState } from "./VideoState";

export default class VideoManager {
    videoEl: HTMLVideoElement;

    constructor(videoEl: HTMLVideoElement) {
        this.videoEl = videoEl;
    }

    getState(): VideoState {
        return {
            paused: this.videoEl.paused,
            position: this.videoEl.currentTime,
        };
    }
    
    /**
     * Returns whether the vid was actually changed.
     * For example, if the vid is paused and someone pauses it again, its state has not really changed.
     */
    setState(newState: VideoState) {
        if (newState.paused) {
            this.videoEl.pause();
        } else {
            this.videoEl.play();
        }

        this.videoEl.currentTime = newState.position;

        return true;
    }

}
