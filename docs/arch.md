# Design of PeerParty
(WIP)

It is like SocketIO but there is only one room ("the session").


## UX

The main UI is like YouTube's or Twitch's "theater mode".

Structure:
```jsx
<App>
    <Welcome>
        <Host>
        <Join>
    <Theater>
        <Video>
        <RightPanel>
            <Title>
            <Participants>
            <History>
            <TypingIndicator>
            <MessageInput>
```


## Messaging

```ts
interface MessagingAPI {
    broadcast(x: Envelope, excludeDestinations: string[]);
    send(x: Envelope);
    sendNotice(x: Envelope);
    sendRequest(x: Envelope);
}

interface Envelope {
    payload: any,
    senderId?: string,
    correlationId?: string,
    timestamp?: string,
}
```

There are two types of envelopes:
- **Requests** expect responses.
They MUST contain `correlationId`.
- **Notices** expect no response (fire and forget).
They MUST NOT contain `correlationId`.

<aside>
  JADE uses `replyWith=someId` (A sends request to B) and `inReplyTo=someId` (B sends response to A),
  while we just use `correlationId=someId` for both sides.
</aside>

### Envelope

It's like a Flux Action x JMS Message (`ObjectMessage`) x IRC Message.

- [Message (Java EE 6 )](https://docs.oracle.com/javaee%2F6%2Fapi%2F%2F/javax/jms/Message.html)

- [ObjectMessage (Java EE 6 )](https://docs.oracle.com/javaee%2F6%2Fapi%2F%2F/javax/jms/ObjectMessage.html)

- [Creating and Sending a Simple Message (The Java EE 5 Tutorial)](https://docs.oracle.com/cd/E19316-01/819-3669/bnbhs/index.html)

- [JMS Request/Reply Example - Enterprise Integration Patterns](https://www.enterpriseintegrationpatterns.com/patterns/messaging/RequestReplyJmsExample.html)


## Interesting

### Chat UIs

- [ ] [Chatbots | Carbon Design System](https://carbondesignsystem.com/community/patterns/chatbot/content/)

- [ ] Alibaba / ChatUI https://github.com/alibaba/ChatUI
    * "The UI design language and React library for Conversational UI"

- [ ] Detaysoft / react-chat-elements https://github.com/Detaysoft/react-chat-elements

---

END.
