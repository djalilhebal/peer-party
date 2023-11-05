# SubSimplex

Simply convert subtitles to WebVTT.
_#serverles #nodejs #webcomponent #ffmpeg_

<details>
<summary>Tasteless intro</summary>
    
Lemme start by admitting that I have cancer.
No, not IRL, but the type that lets you stay alive and suffer for at least 40 or 50 more years.
IDK why I keep procrastinating, getting sidetracked, and never getting anything done.

As Lady Amalthea (A.K.A. The Last Unicorn) would say, <q lang="fr">Je sens ce corps mourir !</q>, which is French for "I can feel this whole body dying all around me!"...
</details>

Suppose you have a video or movie like The Last Unicorn (obtain from legitimate means like buying the DVD, obvio).
You want to embed it in a web page (PeerParty) in addition to the French subtitles file (say, `unicorn.fr.srt`).
Unfortunately, the web support only WebVTT (`*.vtt`).

This project is my attempt at coming up with a no-nonsense way to convert and view subtitles on the web.

- [ ] Used by PeerParty.


## Usage

### Client

`lib/`

Just import the WebComponent and use it as you would use `<track>`.
```html
<script src="dist/SubSimplexTrack.js"></script>

<video controls src="unicorn.mp4">
    <!--
        <track kind="subtitles" src="x.vtt" />
    -->
    <SubSimplexTrack src="unicorn.fr.srt" />
</video>
```

### Server

`server/`

Or "serverless".

Make sure you have `ffmpeg` installed on your serverless image(?).

In our case, we are using Vercel:

Option 0: Use a platform-independent version of ffmpeg.
- [x] ~~ffmpeg.wasm~~ https://github.com/ffmpegwasm/ffmpeg.wasm
    + As of 2023-11-05, its FAQ states that the project does not work with nodejs.

Option 1: Install it as a node package.

- [ ] TRY https://github.com/kribblo/node-ffmpeg-installer

Option 2: Install it "normally":

- [x] [Build image | Vercel Docs](https://vercel.com/docs/deployments/build-image)
    * TLDR: Vercel does not include `ffmpeg`. Gotta install it ourselves.

- [ ] [FFMPEG Install on EC2 - Amazon Linux - Server Fault](https://serverfault.com/questions/374912)


## Uses / Built With

- [ ] https://github.com/fluent-ffmpeg/node-fluent-ffmpeg

- [ ] Express

- [ ] Vercel


## How it Works

Client
```js
class SubSimplexTrack extends HTMLElement {
    static defaultApi = 'https://subsimplex.vercel.app';

    constructor() {
        super();
    }

    work() {
        // original = load the subtitles contents
        // converted = await fetch post to subsimplex
        // create a new track and add it or replace the old one
    }
}
```

Server
```js
// Express?
// inputs = get content and format (ext of the file) from the request
// converted = use ffmpeg to convert it to vtt
// output = return the output with correct headers

const app = require('express')();
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);

console.info({ffmpegPath});

app.post('/api/convert-to-vtt', (req, res) => {
    // Validate the req...

    // Process the request
    const inputStream = req.file; // TODO
    const inputFormat = req.file?.extension; // TODO

    const command = ffmpeg();
    command.input(inputStream);
    // TBD: Optional?
    if (inputFormat) {
        command.inputFormat(inputFormat);
    }
    command
        .outputFormat('vtt')
        .output(res)
        .run();

    res.end();
});
```


## Ramblings

### Server

- List supported subs formats. \
In `ffmpeg -codecs`, we are looking for lines that match `/^D.S/` (meaning, can decode subtitles).

- Can ffmpeg tell the subs format from just its content? \
`ffprobe` can (tested a few extensionless files: `.srt`, `.vtt`, `.ass`, and `.sub`).

### Client

- [ ] https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_custom_elements


## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) © Abdeldjalil HEBAL
