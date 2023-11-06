# Automated testing

(WIP)

Something like [playwright-test-2023-10-25.js](https://gist.github.com/djalilhebal/bf0beabb6433cf132231729ad8166745)


## Scenario 1: Toxic Alice.

- Alice enters the website.
- Alice fills the form as the owner, selects Charade, and starts the session.
- Alice starts playing the video.
- Alice shares the session link with Bob.

- Bob enters the website using Alice's link (which includes the session ID), selects Charade, and joins.
- Bob types, "Yo!"
- Some time passes, something dramatic happens, Bob wants to comment on it.
- Bob pauses the video and seeks back rewinds to to 24:40.
- Bob types, "Dude, did you see that?"

- Alice replies, "stfu and watch"

Bob's video should be playing.


## Interesting

- [ ] BDD vs E2E testing?

- [ ] READ: https://www.browserstack.com/guide/best-test-automation-frameworks

- Playwright https://playwright.dev
    * Has Java version as well!

- JBehave https://jbehave.org
    * KAITO: looks super cool.

- Gauge https://gauge.org
    * Uses markdown to author test cases and scenarios.
    Seems similar to JBehave.

- Mocha https://mochajs.org
    * Seems simple enough.

---

END.
