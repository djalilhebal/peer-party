# Peer Party: Ramblings

Presence indicator:
```js
// add to App
useEffect(() => {
    /**
     * AWAY
     * @see https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
     * @see https://ircv3.net/specs/extensions/away-notify
     */
    function awayHandler() {
        const awayMessage = document.hidden ? 'Tabbed out or minimized' : '';
        api.sendNotice({
            type: COMMAND.AWAY,
            payload: awayMessage,
        });
    }
    
    document.addEventListener('visibilitychange', awayHandler);

    return () => document.removeEventListener('visibilitychange', awayHandler);
}, []);
```

---

```js
function autofillOwner() {
    const nickname = 'Alice';
    const url = 'https://download.blender.org/durian/movies/Sintel.2010.720p.mkv';
    const topic = 'Sintel';
}
function autofillViewer() {
    const nickname = 'Bob'
    cont url = 'https://download.blender.org/durian/movies/Sintel.2010.1080p.mkv';
}
```

---


```js
// An event is like User changed state to: paused at TIMESTAMP.
Message.kind = 'text' | 'event'
```

---

```
acceptConnection
    owner? True
    viewer? False

acceptCommand
    viewer? True
    Owner? 
    if command is addMessage or setVideoState or setNick

if command has replyWith
    Send a response to peerId with replyTo=replyWith
```


## Design evolution

At first, it was event-based,
then refactored to be similar to Redux actions (type and payload),
and then it evolved to look similar to JSON-API.

Interesting:
* https://github.com/redux-utilities/flux-standard-action
* https://en.wikipedia.org/wiki/JSON-RPC
* https://www.jsonrpc.org


PeerJS serves three purposes:
1. A signaling server
    Alternatives:
    * ?
    * [ ] READ: [Choice of Signaling Server in Web Real-Time Communication | by Wipro Tech Blogs | Medium](https://wiprotechblogs.medium.com/choice-of-signaling-server-in-web-real-time-communication-e771c1ccf60d)
2. Data serialization and deserialization layer
    Alternatives:
    * Classic JSON.stringify/parse
    * Protobuf
3. Abstraction layer
    Alternatives:
    * Nothing. The app is simple enough (text-only)
    * [simple-peer by feross](https://github.com/feross/simple-peer)


## Uses / Could use

- Observer pattern.
- PRC-ish pattern.

- We could use JSON-RPC and document it with OpenRPC.

* Why Vite?
    + [ ] READ: https://semaphoreci.com/blog/vite

- VLC HTTP requests

    * https://wiki.videolan.org/VLC_HTTP_requests/

    * Angelmaneuver/vlc-controller.widget: Übersicht widget to control VLC running on a remote machine (e.g. Raspberry pi) via HTTP request. This widget allows you to control VLC on a remote machine from your desktop.
    https://github.com/Angelmaneuver/vlc-controller.widget


## Assumptions

- Tiny scale. \
So we don't worry about windowing (rendering),
or large messages being broadcast to many participants by the host (latency and bandwidth issues).


## Questions

- WebSocket vs WebRTC
    * WebRTC is obv fast for P2P, but if you have more than two peers? (i.e. group call). Logically, I would say that at some point of peer scale, Websocket is faster because each peer has to broadcast the same data to every other peer if you use WebRTC. No?

- What's the point of it being peer-to-peer if you are going to use a server-client model? (Owner is the authority and source of truth.) \
Simpler to implement, IMO.
We kind of needed an authority to handle user registration (`nick`s) and to hide the public "id" (PeerJS id) of participants.
This obviously adds some latency as messages (text messages and sync commands) need to go to the owner before being relayed to others.

### How to tell if all participants are playing the same video?

- File size: Could work, but we do not want to enforce it. \
Imagine `720p.WEB` vs `1280p.BlueRay`.

- Video duration: Unreliable. \
Tested the same file, on the same system, but different browsers report the "duration" differently:
    * 7330.406416 on Firefox 106.0.1 (64-bit)
    * 7330.406417 on Edge Version 106.0.1370.47 (64-bit)
    * 7330.489834 on Brave Version 1.45.113 Chromium: 107.0.5304.62 (Official Build) (64-bit)

- The best we can do now is assume it is, maybe show a warning,
and set the default session title to `owner.video.filename` so others know what they should be playing.


## Features

### Typing

- Throttle

    * KAITO: Is there a way to throlle **exactly once** after the delay?
    Some implementations I've seen can miss the last event.

    * At least lodash and underscore support `leading` and `trailing` options
        + https://stackoverflow.com/a/67964441
        + https://underscorejs.org/docs/modules/throttle.html#section-2
        + https://lodash.com/docs/4.17.15#throttle

    * [ ] [JavaScript Debounce vs. Throttle | Syncfusion Blogs](https://www.syncfusion.com/blogs/post/javascript-debounce-vs-throttle.aspx)

    * [ ] [Difference Between throttling and debouncing a function | Stack Overflow](https://stackoverflow.com/questions/25991367/)


## Subtitles

- Subtitles can be added, but they have to be in the WebVTT format.
    * [Adding captions and subtitles to HTML video - Developer guides | MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)

- **Option 1**:
FFmpeg can convert formats to WebVTT (e.g. `ffmpeg -i x.srt x.vtt`).
The easiest solution would be to load the whole program in the browser and do the conversion there,
Obviously this is not practical.
    * https://github.com/ffmpegwasm/ffmpeg.wasm
        + `ffmpeg-core.wasm` is ~23mb. Unacceptable!

- **Option 2**:
Use VLC via VLC HTTP requests.

- **Option 3**:
Find or write a simple parser in JS.


## Interesting

Debugging:
- about://webrtc-internals/


Stuff to check later:

- "A list of publicly available STUN servers" https://github.com/pradt2/always-online-stun/
    * Google's are fine.

- [ ] READ: [HTTP, WebSocket, gRPC, or WebRTC - Which protocol is best?](https://getstream.io/blog/communication-protocols/)

- [x] READ: [A simple RTCDataChannel sample - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample)

- **gRPC over WebRTC**
    * https://github.com/jsmouret/grpc-over-webrtc
    * https://news.ycombinator.com/item?id=23572660
    
- **Bidirectional JSON-RPC**
    * https://github.com/bigstepinc/jsonrpc-bidirectional

---

END.
