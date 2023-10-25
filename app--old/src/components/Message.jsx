import {memo} from 'react'

export default memo(function Message({ nick, text }) {
    return (
        <article className="message">
            <span className={`message__author`}>{nick}</span>
            {nick}
            <p className="message__text">{text}</p>
        </article>
    );
});
