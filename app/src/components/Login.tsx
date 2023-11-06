import { useState } from "react";
import RadioCardGroup, { RadioCardOption } from "./RadioCardGroup";
import { Role } from "../model/Role";

const rolesOptions = [
    {value: Role.OWNER, content: 'Create a new session'},
    {value: Role.VIEWER, content: 'Join'},
];

export default function Login({setVideoInfo}: any) {
    const [formData, setFormData] = useState(function getInitialFormData() {
        return {
            /**
             * If the current user is OWNER, its value is read-only and is automatically set to `remoteKey`.
             * Can be manually set by VIEWER.
             * Though try to automatically set from the URL if the param exists.
             */
            roomCode: '',
    
            // See rolesOptions
            // if roomCode was found in the URL, assume we are viewer; else, we are owner.
            role: '',
    
            /**
             * validated by the Owner, can't be changed (for now).
             */ 
            nickname: '',
            nicknameIsValid: null,
            // Waiting for response from the Owner.
            nicknameIsValidating: false,
    
            /**
             * Currently we are using videoInfo.name as default value (and placeholder) for room name.
             * 
             * - `name` contains extension. It's like calling Node's `Path.basename(videoFilePath)`.
             *   e.g. `CHARADE_1953.ogv`.
             */
            videoInfo: null as null | {
                fileObj: string,
                name: string,
            },
            // TODO.
            subtitleFile: null,
    
            // If it's empty and we role is owner, it is set to `videoInfo.name` when starting.
            roomName: '',
        }
    });

    // WIP
    const info = formData;
    const canStart = info.role && info.nickname && formData.videoInfo;

    function handleSubmit(e: any) {
        e.preventDefault();

        console.info(formData);
        setVideoInfo(info.videoInfo);
    }

    function handleChange(e: any) {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }

    function handleRoleSelect(x: RadioCardOption) {
        setFormData((prevState) => ({...prevState, role: x.value}));
    }

    function handleFileChange(e: any) {
        const files: FileList = e.target.files;
        if (files.length === 1) {
            const file = files[0];
            const { name } = file;
            const fileObj = URL.createObjectURL(file);
            const videoInfo = { fileObj, name };
            setFormData(prev => ({...prev, videoInfo}));
        } else if (files.length === 0) {
            // Maybe a file was selected then unselected...
            // Imagine this scenario: Clicks select file > Selects file > Clicks select file > Cancels.
            // Maybe we should not create the file obj until we actually **start**.
            // The obj will be revoked once the page is closed anyways.
            if (formData.videoInfo?.fileObj) {
                URL.revokeObjectURL(formData.videoInfo.fileObj);
                //formData.videoInfo.fileObj = null;
            }
            setFormData(prev => ({...prev, videoInfo: null}));
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <h1>Peer Party</h1>

            <label className="debug">
                My PeerJS ID
                <input id="myRemoteKey" readOnly={true} />
            </label>

            <hr />

            <RadioCardGroup
                name="role"
                radios={rolesOptions}
                onSelected={handleRoleSelect}
            />

            <hr />

            <label>
                Room code
                <input id="roomCode"
                    name="roomCode" value={formData.roomCode} onChange={handleChange}
                    readOnly={formData.role === Role.OWNER} />
            </label>

            <hr />

            <label>
                Nickname
                <input id="nickname"
                    minLength={1}
                    name="nickname" value={formData.nickname} onChange={handleChange}
                    />
                <span>
                    Show an inline loading indicator ("Validating...")
                </span>
            </label>

            <hr />

            <label>
                Video
                {/* XXX: It should accept only videos HTML can play. */}
                <input id="videofile" type="file" accept="video/*" onChange={handleFileChange} />
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
                <input id="roomName"
                    placeholder={formData.videoInfo?.name || "Some watch party"}
                    name="roomName" value={formData.roomName} onChange={handleChange}
                    />
            </label>

            <hr />

            <button aria-label="start" disabled={!canStart}>Start</button>
        </form>
    );

}
