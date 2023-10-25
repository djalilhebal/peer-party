/**
 * - Rename to VideoManager?
 * - Useful: `.duration, .currentTime, .pause(), .play(), .fastSeek(time)`
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/
 */
export default class VideoPlayer {

    /**
     * @param {HTMLVideoElement} el 
     */
    constructor(el) {
        this.el = el;
    }
    
    /**
     * 
     * @param {boolean} paused 
     */
    setPause(paused) {
        if (paused) {
            this.el.pause();
        } else {
            // if .ended?
            this.el.play();
        }
    }
    
    /**
     * `.currentTime` or `.fastSeek(time)`
     * @param {number} time 
     */
    seek(time) {
        this.currentTime = time;
    }
    
}
