import playwright from 'playwright';

/**
 * @typedef {import("playwright").Page} Page
 */

export default class ParticipantAgent {
    /**
     * 
     * - Maybe I should just use TypesSript...
     * @private
     */
    constructor(opts) {
        /**
         * @type {string}
         */
        this.name = opts.name;

        /**
         * @type {Page}
         */
        this.page = null;

        /**
         * Chromium channel
         * @type {'msedge' | 'chrome'}
         */
        this.browserType = opts.browserType || 'msedge';
    }

    /**
     * @param opts
     * @returns {ParticipantAgent & Page}
     */
    static create(opts) {
        const participant = new ParticipantAgent(opts);
        const proxiedParticipant = new Proxy(participant, {
            get(target, property, receiver) {
                //console.debug(`Getting ${property}`);
                if (property in target) {
                    //console.debug('Forwarding to base ParticipantAgent');
                    return target[property];
                } else if (target.page && property in target.page) {
                    //console.debug('Forwarding to Page');
                    return target.page[property];
                } else {
                    // XXX: Should throw?
                    console.error(`[ParticipantAgent] Prop '${property}' not found.`);
                    return null;
                }
            }
        });
        
        return proxiedParticipant;
    }
    
    /**
     * Create a new `Browser` and `Page`.
     */
    async setup() {
        const browser = await playwright.chromium.launch({
          headless: false,
          channel: this.browserType,
          // FIXME: Args are not being passed/used
          //args: ['--window-name="PPP.Alice"', '--start-fullscreen'],
        });
      
        const context = await browser.newContext();
        const page = await context.newPage();
        this.page = page;

        this._setupLocators();

        this._close = async () => {
            await context.close();
            await browser.close();
        }
    }

    /**
     * Define locators
     */
    _setupLocators() {
        // by find area role 'textbox' or id 'chat-input'
        // or area label 'Send a message'
        // or placeholder 'Send a message'
        this.messageBox = this.page.getByRole('textbox');
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
    
    async checkApproxState({paused, timestamp}) {
        const actuallyPlaying = await this.checkVideoPlaying();
        if (paused && actuallyPlaying) {
            return false;
        }

        const actuallyApprox = await this.checkApproxVideoPosition(timestamp);
        return actuallyApprox;
    }

    async seekVideoPosition(timestampStr) {
        const time = parseTimestamp(timestampStr);
        await this.page.evaluate(doVideoSeek, time);
    }

    async sendMessage(msg) {
        await this.page.messageBox.fill(msg);
        await this.page.messageBox.press('Enter');
    }

    async seesMessage(msg, shouldWait = false) {
        const msgLocator = this.page.locator('#messagesList').getByText(msg);
        if (shouldWait) {
            await msgLocator.waitFor();
            return true;
        } else {
            return await msgLocator.isVisible();
        }
    }

    toString() {
        return this.name;
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

// TODO: Move this and similar functions to dom-utils.js
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
