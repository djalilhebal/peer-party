import playwright from 'playwright';

export default class ParticipantAgent {

    /**
     * @returns {ParticipantAgent & Page}
     */
    constructor(opts) {
        this.name = opts.name;
        this.page = null;
        /**
         * Chromium channel
         * @type {'msedge' | 'chrome'}
         */
        this.browserType = opts.browserType || 'msedge';

        return new Proxy(this, {
            get(target, property, receiver) {
                //console.debug(`Getting ${property}`);
                if (property in target) {
                    //console.debug('Forwarding to base ParticipantAgent');
                    return target[property];
                } else if (target.page && property in target.page) {
                    //console.debug('Forwarding to page');
                    return target.page[property];
                } else {
                    // XXX: Should throw?
                    console.error(`[ParticipantAgent] Prop '${property}' not found.`);
                    return null;
                }
            }
        });
    }

    /**
     * Create a new `Browser` and `Page`.
     */
    async setup() {
        nar(`${this.name} opens a new page`);
        const browser = await playwright.chromium.launch({
          headless: false,
          channel: this.browserType,
          // FIXME: Args are not being passed/used
          //args: ['--window-name="PPP.Alice"', '--start-fullscreen'],
        });
      
        const context = await browser.newContext();
        const page = await context.newPage();
        this.page = page;

        this._close = async () => {
            await context.close();
            await browser.close();
        }
    }

    /**
     * Close the browser.
     * 
     * Maybe rename to: Cleanup, destory, etc.
     */
    async close() {
        await this._close();
    }

    async toggleVideoPlay() {
        const SPACE = ' ';
        await this.page.press('video', SPACE);
    }
    
    async waitForVideoPlayable() {
        await this.page.waitForFunction(isVideoPlayable);
    }

    async checkVideoPlaying() {
        return await this.page.evaluate(isVideoPlaying);
    }
    
    async checkVideoPlayable() {
        return await this.page.evaluate(isVideoPlayable);
    }

    async checkApproxVideoPosition(timestampStr) {
        const time = parseTimestamp(timestampStr);
        return await this.page.evaluate(isApproxVideoPosition, time);
    }
    
    async seekVideoPosition(timestampStr) {
        const time = parseTimestamp(timestampStr);
        await this.page.evaluate(doVideoSeek, time);
    }

}

/**
 * Parse `HH:MM:SS.mm` to seconds
 * (a la ffmpeg)
 * 
 * @param {string} str
 * @returns {number} timestamp in seconds
 */
function parseTimestamp(str) {
    const parts = str.split(':');
    let result = 0;
    let m = 1;

    while (parts.length > 0) {
        result += m * Number(parts.pop());
        m *= 60;
    }

    return result;
}

function doVideoSeek(timeInSeconds) {
    document.querySelector('video').currentTime = timeInSeconds;
}

/**
 * Is the video's current time approximately {@link timeInSeconds}?
 * 
 * @param {number} timeInSeconds 
 * @param {number} errorMargin in seconds
 * @returns {boolean}
 */
function isApproxVideoPosition(timeInSeconds, errorMargin = 1) {
    const vid = document.querySelector('video');
    const actualTime = vid.currentTime;
    const isCloseEnough = Math.abs(actualTime - timeInSeconds) <= errorMargin;
    return isCloseEnough;
}

function isVideoPlayable() {
    const HAVE_FUTURE_DATA = 3;
    const HAVE_ENOUGH_DATA = 4;
    
    const vid = document.querySelector('video');
    return vid && vid.readyState >= HAVE_FUTURE_DATA;
}

function isVideoPlaying() {
    // XXX: If it's not paused, it doesn't necessarily mean it is actually playing.
    // It may be waiting for data.
    return !document.querySelector('video').paused;
}

export function nar(str) {
    console.info(`[Narrator] ${str}`);
}
