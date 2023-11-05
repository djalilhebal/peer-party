import { useState } from "react";
import RadioCardGroup from "./RadioCardGroup";

// TODO: Move to model/
const Role = {
    OWNER: 'OWNER',
    VIEWER: 'VIEWER',
}

const rolesOptions = [
    {value: Role.OWNER, content: 'Create a new session'},
    {value: Role.VIEWER, content: 'Join'},
];

export default function Login() {
    const [role, setRole] = useState(Role.OWNER);

    // WIP
    const info = {

        /**
         * If the current user is OWNER, its value is read-only and is automatically set to `remoteKey`.
         * Can be manually set by VIEWER.
         * Though try to automatically set from the URL if the param exists.
         */
        roomId: '',

        // See rolesOptions
        // if roomId was found in the URL, assume we are viewer; else, we are owner.
        role: Role.OWNER,

        /**
         * validated by the Owner, can't be changed (for now).
         */ 
        nickname: '',
        nicknameIsValid: null,
        // Waiting for response from the Owner.
        nicknameIsValidating: false,

        videoFile: null,
        videoFilename: null,
        // TODO.
        subtitleFile: null,

        // If it's empty, once the file is selected, set this value to filename.
        roomName: '',
    }

    function handleSubmit(e: any) {
        e.preventDefault();
        console.info('Start');
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Peer Party</h1>

            <label className="debug">
                PeerJS ID
                <input id="remoteKey" readOnly={true} />
            </label>

            <hr />

            <RadioCardGroup
                name="role"
                radios={rolesOptions}
                onSelected={x => setRole(x.value)}
            />

            <hr />

            <label>
                Room code
                <input id="code" readOnly={role === 'owner'} />
            </label>

            <hr />

            <label>
                Nickname
                <input id="nickname" />
                Show an inline loading indicator ("Validating...")
            </label>

            <hr />

            <label>
                Video
                {/* XXX: It should accept only videos HTML can play. */}
                <input id="videofile" type="file" accept="video/*" />
            </label>

            <hr />

            <label>
                Room name
                {/*
                    - not required.
                    - maybe only the OWNER should set it.
                    - its placeholder is filename.
                    - if its value is empty, it automatically gets set to filename when submitting.
                */}
                <input id="roomName" />
            </label>

            <hr />

            <button aria-label="start">Start</button>
        </form>
    );

}
