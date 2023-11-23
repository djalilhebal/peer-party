# Transports

No servers, so what "mediums" can we use?
- WebRTC (via PeerJS' public signaling server)
- MQTT (with public brokers).
- ???

Could use
- Supabase https://supabase.com/realtime


## `AbstractSession`

- `AbstractSession` (aka Transport) is `Courier`.
Named after https://docs.jboss.org/jbossesb/docs/4.9/javadoc/esb/org/jboss/soa/esb/couriers/Courier.html
It a courier picks up envelopes and delivers them.


## `PeerSession`

PeerJS session.


## `MqttSession`

An implementation that uses MQTT:
- :green_square: MQTT is designed for shitty devices and network conditions
  and supports auto-reconnecting and QOS policies (at least once, at most once, and exactly once).

Uses:
- MQTT.js https://github.com/mqttjs/MQTT.js
    * Lightweight MQTT library.
- `uuid` https://www.npmjs.com/package/uuid
    * To generate room and participant keys.

Hosts (public brokers):
- `test.mosquitto.org`
    * 2023-11-08 Tested. It works.
- `broker.mqttdashboard.com`
    * 2023-11-08 Tested. It works.
    * See https://www.hivemq.com/mqtt/public-mqtt-broker/
    * See https://www.hivemq.com/article/mqtt-client-library-mqtt-js/


```js
// API is SessionManager?
api
    .setVideoElement(videoEl)
    .setVideoManager(videoManager)
    .setConnection(myConnectionImpl)
    .setStore(appStore);

```

```ts
interface IEnvelope {
    success: boolean
    error?: string
    payload: any
}
```

### Considerations

Security stuff:
- Privacy: Cannot be guaranteed. Anyone can read anything, esp. if they know the topic.
    * At least on HiveHQ, listening to global messages (root wildward `#`) is prohibited.
- Session invalidation: AFAIK, it's impossible since it is just a topic controlled by 3rd party (the broker).
- Impersonation: Anyone can send anything to that topic.
    * We need to implement our own auth mechanism, prob using **JSON Web Token**s.
        + Room key is the owner's public key.
        + We can use the user's public key as the `envelope.senderId`.
        + Each envelope will include a `signature` property.
        + ... what am I trying to do again? I might as well re-invent HTTPS over MQTT.


## Interesting

- [ ] Colyseus
    * https://www.npmjs.com/package/colyseus
    * "Authoritative Multiplayer Framework for Node.js, with clients available for the Web, Unity3d, Defold, Haxe, and Cocos."
    * Does not provide a public (signaling) server.
    * It seems like a prettier version of Socket.IO. Socket.IO have client and server implementations in diff langs inc Java.

---

FIN.
