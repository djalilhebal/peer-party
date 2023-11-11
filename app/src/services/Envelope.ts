export default interface Envelope {
    senderId?: string,
    destinationId?: string,
    payload: any,
}

export class Envelopes {

    /**
     * Clone
     */
    static copy(x: Envelope): Envelope {
        // XXX: We could use Ramda.clone, but this works.
        // Or maybe https://developer.mozilla.org/en-US/docs/Web/API/structuredClone
        return JSON.parse(JSON.stringify(x));
    }

    static isValid(str: string) {
        // It's valid if it's a valid JSON.
        try {
            const parsed = JSON.parse(str);
            return true;
        } catch (ignoredErr) {
            return false;
        }
    }

    static parse(str: string): Envelope {
        return JSON.parse(str);
    }

}
