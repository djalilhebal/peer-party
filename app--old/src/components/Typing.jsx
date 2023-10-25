import { TYPING } from "../model/constants";
import { useAppStore } from "../model/store";

/**
 * A la IRC.
 * 
 * Pure.
 * 
 * @param {import("../model/types").Participant} participant
 * @param {number} relativeTime
 * @return {boolean}
 */
function shouldAssumeTyping(participant, relativeTime) {
    // - "At least 6 seconds have passed since the last typing=active notification was received."
    const ACTIVE_WINDOW_IN_MILLIS = 6 * 1000;
    const x = participant.typing;
    return x.status === TYPING.active
            && relativeTime - x.time < ACTIVE_WINDOW_IN_MILLIS;
}

export default function Typing() {
    const participants = useAppStore(state => state.participants);
    const currentParticipantId = useAppStore(state => state.userId);
    
    // Nicks of participants that are currently typing (not including the current user).
    const timeNow = Date.now();
    const typingNicks = participants
                            .filter(x => shouldAssumeTyping(x, timeNow))
                            .filter(x => x.userId !== currentParticipantId)
                            .map(x => x.nick);

    const typingList = typingNicks.join(', ');

    return (
        <p className={`typing ${typingNicks.length === 0 ? 'typing--empty' : ''}`}
            title={typingList}
        >
            Typing: {typingList}.
        </p>
        );
}
