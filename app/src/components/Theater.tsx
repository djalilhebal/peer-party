
export default function Theater({videoInfo}: {videoInfo: {fileObj: string}}) {

    return (
        <>
            <video src={videoInfo.fileObj} controls></video>
        </>
    );
}
