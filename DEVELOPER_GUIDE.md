# Ping Games — Developer Guide

Build multiplayer games for the [Ping](https://ping.live) chat platform. Games connect to Ping rooms for real-time state synchronization, allowing players to challenge each other directly from chat.

---

## Architecture

### How Games Connect to Ping

```
┌──────────────────┐      react-unity-webgl       ┌──────────────────┐
│   Your Game      │ <===========================> │  PingGameBridge  │
│   (Unity WASM    │   GameReady / GameAction      │  (React host)    │
│    or iframe)    │   GameStateUpdate             │                  │
└──────────────────┘   OnInit / OnStateSync        └────────┬─────────┘
                                                            │
                                              ┌─────────────┼────────────┐
                                              │             │            │
                                         State Events  Timeline Evts  Cache API
                                         (durable,     (fast, chat    (CDN assets
                                          rejoin)       messages)      cached)
                                              │             │            │
                                              └─────────────┼────────────┘
                                                            │
                                                   ┌────────▼─────────┐
                                                   │    Ping Room     │
                                                   └──────────────────┘
```

### Game Types

There are **three ways** to build a game for Ping:

| Type | Template | Bridge | Best For | Example |
|------|----------|--------|----------|---------|
| **Unity WebGL** | `_template/` | `PingBridge.cs` (C#) | Rich 2D/3D games | Pong |
| **HTML5 / iframe** | `_template-html5/` | `ping-bridge.js` (JS) | Canvas/JS games, Phaser, Three.js | Any web game |
| **Direct Canvas** | *(built into Ping-web)* | Direct Ping API | Simple first-party games | Coin Flip |

**Unity** and **HTML5** games live in this repo and deploy to CDN. **Direct Canvas** games are TypeScript components built directly into Ping-web (no CDN, no iframe, no bridge overhead) — these are for first-party games maintained by the Ping team.

### CDN

All builds deploy to GitHub Pages:

```
https://AMP-Media-Development.github.io/ping-games/{game-name}/
  ├── Build/                  ← Unity WebGL files (Unity games only)
  ├── index.html              ← Entry point (all games)
  ├── game.js, game.css       ← Game files (HTML5 games)
  └── ...
```

---

## The PingBridge Protocol

PingBridge handles all communication between your game and the Ping host. Your game never makes network requests directly.

### Events Reference

| Direction | Event | Purpose |
|-----------|-------|---------|
| Game → Host | `GameReady` | Game loaded, ready for init data |
| Game → Host | `GameStateUpdate(json)` | Sync game state to all players |
| Game → Host | `GameAction(json)` | Post event to chat timeline |
| Host → Game | `OnInit(json)` | Player info + existing state |
| Host → Game | `OnStateSync(json)` | State update from another player |

### OnInit Payload

```json
{
  "userId": "@alice:ping.live",
  "gameId": "uuid-of-session",
  "roomId": "!room:ping.live",
  "state": "{...}"
}
```

`state` is an empty string if this is a new game, or a JSON string of existing state if rejoining.

### State Rules

- Payloads must be under **64KB** (state event limit)
- State should be a **complete snapshot**, not a diff
- Include a **timestamp** for ordering
- Use **Ping user IDs** (`@user:server`) for player references

### Action Rules

- Use `SendAction()` only for **user-visible** events (game_invite, game_started, game_over, restart)
- Do NOT call every frame — each call creates a chat message
- Payload: `{"action": "game_over", "payload": {"winner": "left", "score": 5}}`

---

## Building a Unity Game

### Step 1: Copy the Template

```bash
cp -r _template games/my-game
```

### Step 2: Implement GameManager

Edit `Assets/Scripts/GameManager.cs` — follow the TODOs:

```csharp
public void OnBridgeInit(string userId, string gameId, string roomId, string stateJson)
{
    if (!string.IsNullOrEmpty(stateJson) && stateJson != "{}")
    {
        // Rejoin: restore state from existing game
        var state = JsonUtility.FromJson<MyGameState>(stateJson);
        RestoreGame(state);
    }
    else
    {
        // New game: show lobby
        StartNewGame(userId, gameId);
    }
}

public void OnStateSync(string stateJson)
{
    var state = JsonUtility.FromJson<MyGameState>(stateJson);
    ApplyRemoteState(state);
}
```

### Step 3: Add EventSystem

Your scene MUST include an EventSystem for buttons to work. The SceneBuilder template does this automatically:

```csharp
var eventSystemGo = new GameObject("EventSystem");
eventSystemGo.AddComponent<EventSystem>();
eventSystemGo.AddComponent<InputSystemUIInputModule>();
```

### Step 4: Build WebGL

Use **Ping Games > Build WebGL** or manually:

1. File > Build Settings > WebGL
2. Player Settings: Compression **Disabled**, Exceptions **None**, Template **PingMinimal**
3. Build to `Build/` directory

### Step 5: Test

In Unity Editor, PingBridge auto-simulates the init call so you can test without the host.

---

## Building an HTML5 / iframe Game

### Step 1: Copy the Template

```bash
cp -r _template-html5 games/my-game
```

### Step 2: Implement game.js

The template includes `ping-bridge.js` which wraps the postMessage protocol. Your `game.js` uses it like this:

```javascript
// Set up callbacks
PingBridge.onInit = function (userId, gameId, roomId, existingState) {
    if (existingState && existingState.phase) {
        // Rejoin: restore from existing state
        restoreGame(existingState);
    } else {
        // New game
        startNewGame(userId, gameId);
    }
};

PingBridge.onStateSync = function (state) {
    applyRemoteState(state);
};

// Send state when something changes
PingBridge.sendStateUpdate({ phase: "playing", score: 42 });

// Send action for chat-visible events
PingBridge.sendAction("game_over", { winner: "Player 1", score: 100 });

// Signal ready (call this when your game has loaded)
PingBridge.sendReady();
```

### Step 3: Test Standalone

Open `index.html` directly in a browser. `ping-bridge.js` auto-detects standalone mode (not in iframe) and simulates an init call so you can test without the Ping host.

### Step 4: Add Assets

Put images, audio, or other assets in an `assets/` directory. The CI deploy copies `*.js`, `*.css`, `index.html`, and `assets/` to the CDN.

### HTML5 File Structure

```
games/my-game/
  index.html       ← Entry point (loads bridge + your game)
  ping-bridge.js   ← DO NOT MODIFY (copied from _template-html5/)
  game.js          ← Your game logic
  game.css         ← Your styles
  assets/          ← Images, audio, etc. (optional)
  README.md        ← Game docs, controls, screenshots
```

### Raw postMessage Protocol

If you prefer not to use `ping-bridge.js` (e.g., using a framework with its own module system), here's the raw protocol:

```javascript
// Game → Host
window.parent.postMessage({ type: "PING_GAME_READY" }, "*");
window.parent.postMessage({ type: "PING_GAME_STATE_UPDATE", payload: { ... } }, "*");
window.parent.postMessage({ type: "PING_GAME_ACTION", action: "game_over", payload: { ... } }, "*");

// Host → Game
window.addEventListener("message", (event) => {
    if (event.data.type === "PING_GAME_INIT") { /* event.data.payload: { userId, gameId, roomId, state } */ }
    if (event.data.type === "PING_GAME_STATE_SYNC") { /* event.data.payload: { ...state } */ }
});
```

---

## Integration into Ping Web

Once your game is deployed to CDN, the Ping team adds it to Ping-web:

1. **Wrapper component** — loads your game via CDN URLs
2. **GamesDialog registration** — adds it to the game library
3. **Event tile** (optional) — renders your timeline messages as rich cards
4. **Pre-cache** (optional) — loads assets during idle time

See the [full integration example](https://github.com/AMP-Media-Development/ping-games/blob/main/DEVELOPER_GUIDE.md) in the Developer Guide.
