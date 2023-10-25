import { useState, useRef, useEffect } from 'react';

import CommandsService from '../services/CommandsService';
import { COMMAND, TYPING } from '../model/constants';

import Message from './Message';
import Typing from './Typing';

import './Chat.css'

/**
 * @param {string} text 
 * @returns {boolean}
 */
function isSlashCommand(text) {
    return text.startsWith('/');
}

export default function Chat({ messages }) {
    const [autoScroll, setAutoScroll] = useState(true);
    const anchorRef = useRef(null);
    const textRef = useRef(null);

    useEffect(function scroll() {
        if (autoScroll) {
            anchorRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    });

    /**
     * @param {string} text 
     * @returns 
     * @see https://ircv3.net/specs/client-tags/typing
     */
    function handleTyping(text) {
        if (isSlashCommand(text)) {
            return;
        }

        CommandsService.sendNotification(null, {
            type: COMMAND.typing,
            payload: {
                status: TYPING.active,
            },
        });
    }

    /**
     * 
     * @param {KeyboardEvent} e
     * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/shiftKey
     */
    async function handleKeyDown(e) {
        const text = textRef.current.value;

        if (e.key === 'Enter' && !e.shiftKey) {
            textRef.current.value = '';

            CommandsService.sendNotification(null, {
                type: COMMAND.typing,
                payload: {
                    status: TYPING.done,
                }
            });

            await CommandsService.sendRequest({
                type: COMMAND.message,
                payload: text,
            });
        }

        handleTyping(text);
    }

    return (
        <section
            className="theater__chat"
            onMouseEnter={() => setAutoScroll(false)}
            onMouseLeave={() => setAutoScroll(true)}
        >
            <ul className="messages">
                {messages.map(m => <li key={m.id}><Message {...m} /></li>)}
                <li ref={anchorRef} id="anchor"></li>
            </ul>
            <Typing />
            <form>
                {/*@ts-ignore*/}
                <textarea ref={textRef} onKeyDown={handleKeyDown} />
            </form>
        </section>
    );
}
