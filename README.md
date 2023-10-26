# Peer Party

Create a watch party for locally stored videos\*.
[Try it!](https://peerparty.djalil.me)

\* By this, I <strong>obvio</strong>usly mean legally downloaded movies like _Charade_, _Gaslight_, or _How Awful About Alan_...

<center>
    <img width="400" height="241" alt="Obvio" src="obvio.jpg" />
</center>

The app's logic is nothing extraordinary\* (unlike [Extraordinary Tales][imdb-extraordinary-tales]).
I tried to make something that does its job and be as streamlined as possible:
- It requires no servers, at least none that we need to operate.
You could even host it on IPFS and it'd just work. _That's the theory anyways._
- ...

\* I have simply rehashed the same ideas from my previous projects, mainly:
- [Zero Messenger][zero] (JavaScript, VueJS, inspired by TCP)
- [Chatroom gRPC][chatroom-grpc] (C#, WPF, inspired by IRC)


## Name

- **PeerParty**: A **Peer**-to-peer watch **party**.
    * You create a watch party for your peers/friends.
    * Also, it is a peer-to-peer app.
    * Also, also, the name alliterates!

<details>
Other names I considered:

- **Social Viewing**: it can't get any more descriptive.
    * [Social viewing | Wikipedia](https://en.wikipedia.org/wiki/Social_viewing)

- **Le Social Viewing**: Local social viewing.

- **In Time**: After the sci-fi [movie of the same name][imdb-in-time]. That's all.

- **ParaPlay**: Parallel + Play.

- **SocView**/**SocVue**/**SocSync**/**ViewSoc**
    * Social Viewing.
    * Sockets (WebSocket, WebRTC, Socket.io) + VueJS.
    * Something something **IngSoc** (English Socialism from the novel _1984_).
</details>


## Features

- Video sources
    * Local file (think: `file://*`).

    * [ ] Remote file (`http://*` and `https://*`). Super unimportant.
    What raw files would anyone want to watch? I can only think of the Internet Archive's.

    * [ ] WebTorrent. Very unimportant.
      We assume the user has low bandwidth, so we can't expect them to stream and seed stuff.
      Also, and this is the bigger problem, I've checked a few movie torrets. There were no WebTorrent seeders.

- Video state sync (a la SyncPlay)
    * Position (current time)
    * Paused (vs playing)

- Basic chat features (a la IRC)
    * Nicknames `/nick`
    * Session name or topic `/topic`
    * List of current participants `/who`
    * Auto-scroll + pause on mouse hover
    * Typing indicator
    * [ ] Presence indicator

- Peer-to-peer
    * Well, almost...
    * WebRTC needs servers like a signaling server (we use PeerJS's).


## Getting started

This app was created using Vite (`npm create vite@latest`).

To run locally:
```sh
git clone https://github.com/djalilhebal/peer-party
cd peer-party
npm install
npm run dev
```


## Uses

- React

- [Zustand](https://github.com/pmndrs/zustand)
    * "Bear necessities for state management in React."

- WebRTC

- [PeerJS](https://peerjs.com): WebRTC library.
    * For now, we are using PeerJS STUN server, but Google's might be better.
    * https://jmcker.github.io/Peer-to-Peer-Cue-System/

- [Vite](https://vitejs.dev/): Build tool.


## Motivation / Background

Imagine two friends: Alice and Bob.

They don't have a good enough internet connection to stream a watch party via Discord or whatever. \
Heck, Alice may even have a 30kbps download speed, but that shouldn't matter because she has already downloaded the movie.

[_Still, Alice_][imdb-still-alice] wants to watch the movie with Bob (who also has downloaded the movie), but she doesn't want to bother him any more.
**She wants the process to be as seamless as possible.**

---

When designing this app, I had these goals and assumptions in mind:
- The app should be minimalist and lightweight.
- The user should not install anything (desktop app or browser extension or whatever).
- There should be no backend (none that we maintain anyways).
- Each participant has a local copy of the video.
- The party owner and other participants trust one another.
    This is required (for now) because we need to assume that videos with different lengths or sizes are the same:
    Suppose I want to watch [Charade (1953)][charade_archiveorg] with my friend Light:
    * I have `CHARADE_1953.mp4`, which is 1013924173 bytes and 4900.22 seconds.
    * He has `CHARADE_1953_512kb.mp4`, which is 355508845 bytes and 4900.16 seconds.
    * They are the same movie, but they have different sizes and even different durations!
      I trust that he is going to play the same movie.
    
    Also, diff browsers report diff durations for the exact same file! \
    The only reliable way to verify that both participants have the same file
    is to calculate and compare checksums (takes too long, esp for large files even if we use the simplest algorithms possible, like CRC).
    
    As far as I am concerned, it is [_much ado about nothing_][imdb-much-ado-about-nothing] since we can just trust our friends.


## How it works
(WIP)

Continuing with the same scenario Alice and Bob:

- Alice creates a watch party. They use the nickname "Arisu".
Alice is the party owner.
- Alice creates an RTC Connection.
- Alice automatically issues `/topic <filename>`.

- Bob creates an RTC Connection and connects to Alice's.
- Bob issues a command `/nick Bandersnatch`

- Alice registers their nickname.

- Bob receives a confirmation message. He is now registered as a viewer named "Bandersnatch" (Banda? Sunato Banda? Bandersnatch?).
- Bob requests state from the owner.
- Bob syncs by updating the video state (`position` and `paused`).

- A third participant, Carol, with the nickname "Cheshire" pauses the video.
- A state change event/command is generated by Carol and sent to Alice.
- Alice broadcasts the sync command.

- Bob receives the sync command.

Same process goes for sending messages.

Alice, the party owner, is a centralized "server" and the source of truth.


## Existing solutions

Note: Checked items mean I've skimmed their docs, checked their source code, or/and tried them.

- [x] Local Party
    * https://localparty.netlify.app/
    * https://github.com/sheldor1510/local-party
    * https://github.com/sheldor1510/local-party-api
    * "A website where you can create rooms and chat while watching local video files synchronized with your friends."
    * Works with local files.
    * It uses the file size to know that the files aren't the same.
    * It depends on socket.io, mongoose/MongoDB, etc.
    * Disliked:
        + It does not handle video seek events (try playing a vid and seeking using arrow keys).
        + It broadcasts shit that others don't need to hear + even sensitive data (`roomCode`).
        + It lets the client define the `roomCode`.
        + `members` should be `membersCount`. Also, this property is useless.
        + Even validating `/join` is left to the client.
        + To manage state, it reloads the page.
        + API and protocol designs are meh.
        + [ ] DOUBLE CHECK: Can it run and scale horizontally (by adding multiple instances)? _I think not._
        * :yellow_square: Requires that you enter the room name. (Kinda bothersome and useless.)
        * :yellow_square: The file selector accepts `*/*`, when it should accept only `video/*`.

- [x] Syncplay

    * Works with VLC

    * [What Syncplay is/does | Syncplay](https://syncplay.pl/about/syncplay/)
        + Visited 2022-10-24
        + Opinion: ok
        + [ ] What does this part mean? "affected but not controlled"
            > The following aspects of the media player are affected, but not controlled, by the server:
            >   * OSD / On-screen display (for the display of messages).
            >   * Playback rate (for slowdown due to time difference).

    * [The Syncplay Protocol | Syncplay](https://syncplay.pl/about/protocol/)
        + Visited 2022-10-24
        + Opinion: ok
        + Notes:
            * Designed to be backwards and forwards compatible.
            * "Timeout due to lack of ping is typically set to 4 seconds so it is important that the client sends ‘ping’ heartbeat messages even when the file remains paused and nothing is happening."
            * "`ignoringOnTheFly` means the client/server is not just going with the status quo because there is a forced state change. It basically means “I will ignore state messages from you until you acknowledge that you got this state change message from me”."

- [x] WatchParty
    https://github.com/howardchung/watchparty
    * Stream your own file

- [x] Metastream
    https://app.getmetastream.com/
    * Supports only online websites

- [x] Turtle
    https://turtletv.app/
    https://github.com/shuang854/Turtle

    * Nice minimalist design
    * Supports only online websites
    * KAITO: It could  work with direct files (e.g. mp4).
    I can fork it to support the `file://` protocol by asking the user to open the file instead (using input HTML element and maybe FileReader API).
    * Notes:
        + :yellow_square: Uses Firebase
        + :red_square: Requires the installation of a browser extension.

- [ ] Jelly Party https://www.jelly-party.com

- [ ] https://github.com/steeelydan/sync-party


## License

[CC BY 4.0](https://creativecommons.org/licenses/by/4.0/) © Abdeldjalil HEBAL


[charade_archiveorg]: https://archive.org/details/Charade_1953

[zero]: https://github.com/djalilhebal/zero
[chatroom-grpc]: https://github.com/djalilhebal/univ-cbse-assignments/tree/main/grpc-chatroom

[imdb-still-alice]: https://www.imdb.com/title/tt3316960/
[imdb-much-ado-about-nothing]: https://www.imdb.com/title/tt0107616/
[imdb-extraordinary-tales]: https://www.imdb.com/title/tt3454574/
[imdb-in-time]: https://www.imdb.com/title/tt1637688
