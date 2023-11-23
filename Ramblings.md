# Peer Party: Ramblings

- Twitch itself uses IRC or at least an IRC-compatible/IRC-extended protocol.


## Getting started

How I started:
```sh
# Create a TypeScript project named 'app'
npm create vite@latest
```

Getting started:
```sh
# Clone it then:
cd peer-party/app
npm install
npm run dev
```

### Testing (Tales)

```sh
node tests/tale-0.js | faucet
```

- Tape
    * faucet "human-readable TAP summarizer"
        + https://github.com/ljharb/faucet
        + `npm install -g faucet`


## Design evolution

PeerParty is inspired by:
- The IRC protocol.
- The SyncPlay protocol.
- RPC, JSON-RPC, Redux/Flux actions, and the command design pattern.
(They all are the same if you believe hard enough.)

---

At first, it was event-based,
then refactored to be similar to Redux actions (type and payload),
and then it evolved to look similar to JSON-API.

Interesting:
* https://github.com/redux-utilities/flux-standard-action
* https://en.wikipedia.org/wiki/JSON-RPC
* https://www.jsonrpc.org


## Assumptions

- Trusted participants.

- Tiny scale. \
So we should't worry too much about
windowing (rendering issues),
memory usage (storing "sessions" and "users"),
or large messages being broadcasted to many participants by the host (latency and bandwidth issues).


## Video sources

- [ ] WebTorrent. Very unimportant.
We assume the user has low bandwidth, so we can't expect them to stream and seed stuff.
Also, and this is the bigger problem, I've checked a few movie torrets. There were no WebTorrent seeders.

- [ ] YouTube. Very unimportant.
Again, who wants to sync YouTube? There are only a few movies and shows there (like **L.O.R.D. Critical World**).
    * YouTube allows its embedders to control it.

- [ ] VLC.
Why is VLC a bad option? Friction.
Could use:
- VLC HTTP requests
    * https://wiki.videolan.org/VLC_HTTP_requests/
    * Angelmaneuver/vlc-controller.widget: Übersicht widget to control VLC running on a remote machine (e.g. Raspberry pi) via HTTP request. This widget allows you to control VLC on a remote machine from your desktop.
    https://github.com/Angelmaneuver/vlc-controller.widget


## Uses / Could use

- Observer pattern.
- PRC-ish pattern.

- We could use JSON-RPC and document it with OpenRPC.

* Why Vite?
    + [ ] READ: https://semaphoreci.com/blog/vite

### PeerJS

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


## Test files

Some movie in the public domain.

- The Stranger 1946
- Charade 1953
- Sintel 2010 (short film, animation, by Blender Foundation)

### Test files: Charade

Test files (Edge/Chrome 118 x64 on Windows 10):

- `CHARADE_1953.mp4`: size 966MB, resolution 624x480, duration 4900.228662, failed to show the video stream (there is only audio).
    * Apparently\* the file uses the MPEG-4 Part 2 format (AKA **MPEG-4 Visual**), specifically the Simple Profile, whatever that means. I don't wanna know. I AM NOT GOING DOWN THAT RABBIT HOLE! \
      \* ffprobe reports `major_brand: mp42` and `mpeg4 (Simple Profile)`.
    * At any rate, Chromium browsers don't support it. Firefox 119 does not. VLC does.

- `CHARADE_1953--ffmpged.mp4`: resolution 624x480, duration 4900.228667, shows the video after transcoding(?) it.
    * Meaning, I simply run through ffmpeg: `ffmpeg -i x.mp4 -q 0 x--ffmpeged.mp4`.
    * This file uses the `AVC1` format.

- `CHARADE_1953.ogv`: size 340.3MB, resolution 400x300, duration 4900.166806.

- `CHARADE_1953_512kb.mp4`: size 339.0MB, resolution 320x240, duration 4900.166806.

Just use the last two.

### Test files: Sintel

https://durian.blender.org/download/
* [ ] http://mirrorblender.top-ix.org/movies/sintel-2048-surround.mp4
* [ ] http://mirrorblender.top-ix.org/movies/sintel-1280-surround.mp4

https://download.blender.org/durian/movies/ 
- `Sintel.2010.720p.mkv` https://download.blender.org/durian/movies/Sintel.2010.720p.mkv
- `Sintel.2010.1080p.mkv` https://download.blender.org/durian/movies/Sintel.2010.1080p.mkv

https://archive.org/details/Sintel
- https://archive.org/download/Sintel/sintel-2048-stereo_512kb.mp4
- https://archive.org/download/Sintel/sintel-2048-stereo.mp4
- https://archive.org/download/Sintel/sintel-2048-stereo.ogv


## Questions

- WebSocket vs WebRTC
    * WebRTC is obv fast for P2P, but if you have more than two peers? (i.e. group call). Logically, I would say that at some point of peer scale, Websocket is faster because each peer has to broadcast the same data to every other peer if you use WebRTC. No?

- WebSocket can use TPC, right? UDP prob.
But can messages be lost?
    * [ ] READ: https://www.digitalsamba.com/blog/packet-loss-in-webrtc

- What's the point of it being peer-to-peer if you are going to use a server-client model? (Owner is the authority and source of truth.) \
Simpler to implement, IMO.
We kind of needed an authority to handle user registration (`nick`s) and to hide the public "id" (PeerJS id) of participants.
This obviously adds some latency as messages (text messages and sync commands) need to go to the owner before being relayed to others.

- [ ] Do we need to mimic syncplay's ignore on flight thing? Or is Alice being the source of truth enough?
Time-stamping (by peers) doesn't mean much, does it? (It's not about trust but clock sync.)

- [ ] Can we use a (public) MQTT broker as a signaling server?
Probably, but at this point, why not just MQTT instead of direct WebSocket connection?
In fact, our functionality is no different from what it does.


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


## Inviting participants

For some reason, I don't like the Share API at least on desktop.

Maybe we should use it if we are on mobile.

### Share API

Sharing using the [Share API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Share_API)

### Copying to clipboard

Copy the room code or link.

**Options**:

- https://github.com/zenorocha/clipboard.js
    * Uses: `execCommand` (deprecated).
    * KAITO: It is very popular (33.5K stars on GitHub, Oct. 2023), but I think it's meh. \
    It relies on a deprecated API and its non-standard commands `copy` and `cut` (although they are supported by relevant browsers ATM), \
    and it even has external dependencies (like npm packages `select` and `good-listener`).

- Feross's library https://github.com/feross/clipboard-copy
    * Uses: Clipboard API > `execCommand` (deprecated).

- https://github.com/sudodoki/copy-to-clipboard
    * Uses: Clipboard API > `execCommand` (deprecated) > IE-specific stuff > `prompt` fallback.
    * Even the `execCommand` approach is handeled better than Feross's version.

- Just use the native Clipboard API.
    * We are targetting the latest browsers anyways.
    * See [Clipboard: writeText() method - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard/writeText)


## Typing indicator

- Throttle

    * KAITO: Is there a way to throlle **exactly once** after the delay?
    Some implementations I've seen can miss the last event.

    * At least lodash and underscore support `leading` and `trailing` options
        + https://stackoverflow.com/a/67964441
        + https://underscorejs.org/docs/modules/throttle.html#section-2
        + https://lodash.com/docs/4.17.15#throttle

    * [ ] [JavaScript Debounce vs. Throttle | Syncfusion Blogs](https://www.syncfusion.com/blogs/post/javascript-debounce-vs-throttle.aspx)

    * [ ] [Difference Between throttling and debouncing a function | Stack Overflow](https://stackoverflow.com/questions/25991367/)


## Presence indicator

Not important.

Maybe show a crossed-out eye icon to signify that the participant has tabbed out for example.

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


## Subtitles

What if we want to watch _Rashomon (1950)_ with subtitles?

- Subtitles can be added, but they have to be in the WebVTT format.
    * [Adding captions and subtitles to HTML video - Developer guides | MDN](https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Adding_captions_and_subtitles_to_HTML5_video)

- **Non-option 1**:
Use VLC via VLC HTTP requests.

- **Option 1**:
FFmpeg can convert formats to WebVTT (as in `ffmpeg -i x.srt x.vtt`).
The easiest solution would be to load the whole program in the browser and do the conversion there.
Needless to say, this is not practical.
    * https://github.com/ffmpegwasm/ffmpeg.wasm
        + `ffmpeg-core.wasm` is ~23mb. Unacceptable!

- **Option 2**:
Find or write a simple parser in JS.

- **Option 3**:
SubSimplex.


## If we had to rely on a server / serverless platform

- If we had to use a server(less?) thingy:
[Vercel docs mention Ably and Firebase Realtime Database](https://vercel.com/guides/publish-and-subscribe-to-realtime-data-on-vercel) (among others).
These two options have decent free plans, decent for prototyping and testing, I mean.


## Interesting

Interesting stuff I've come across (somewhat related to the project).

Debugging:
- about://webrtc-internals/


Stuff to check later:

- "A list of publicly available STUN servers" https://github.com/pradt2/always-online-stun/
    * Google's are fine.

- [ ] READ: [HTTP, WebSocket, gRPC, or WebRTC - Which protocol is best?](https://getstream.io/blog/communication-protocols/)

- [x] READ: [A simple RTCDataChannel sample - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API/Simple_RTCDataChannel_sample)

- https://github.com/miroslavpejic85/mirotalk

- **gRPC over WebRTC**
    * https://github.com/jsmouret/grpc-over-webrtc
    * https://news.ycombinator.com/item?id=23572660
    
- **Bidirectional JSON-RPC**
    * https://github.com/bigstepinc/jsonrpc-bidirectional

---

END.
