# Contributing to Ping Games

Thanks for your interest in building games for Ping! This guide covers everything you need to contribute.

## Getting Started

### Unity Game
1. **Fork** this repo
2. **Copy** `_template/` to `games/your-game-name/`
3. **Open** the copied folder as a Unity project (2022 LTS or Unity 6 recommended)
4. **Build** your game — `PingBridge.cs` is already set up
5. **Build WebGL** and include the `Build/` directory
6. **Open a PR** against `main`

### HTML5 Game
1. **Fork** this repo
2. **Copy** `_template-html5/` to `games/your-game-name/`
3. **Edit** `game.js` — `ping-bridge.js` is already set up
4. **Test** by opening `index.html` in a browser (bridge auto-simulates init)
5. **Open a PR** against `main`

## Rules

### DO

- Call `PingBridge.Instance.SendReady()` on game start (template does this for you)
- Handle `OnBridgeInit()` with existing state (rejoin support)
- Handle `OnStateSync()` for multiplayer state updates
- Send `SendStateUpdate()` for all state changes
- Send `SendAction()` only for user-visible events (game start, game over, scores)
- Keep state payloads under **64KB**
- Use Matrix user IDs (`@user:server`) for player identification
- Include an **EventSystem** in your scene (for UI button support)
- Test both single-player and multiplayer flows
- Generate sprites/audio procedurally when possible (keeps build size small)

### DO NOT

- Modify `PingBridge.cs`, `PingBridgePlugin.jslib`, or `ping-bridge.js` — CI will reject your PR
- Make HTTP requests from the game
- Use `PlayerPrefs` for multiplayer state (use PingBridge state sync)
- Use `DontDestroyOnLoad` (except PingBridge which already uses it)
- Add the Unity splash screen
- Include copyrighted assets — all assets must be MIT-compatible
- Call `SendAction()` every frame — it creates chat messages

## PR Requirements

Your pull request must include:

- [ ] Game files under `games/your-game-name/`
- [ ] **Unity:** WebGL build in `Build/`, unmodified `PingBridge.cs` and `PingBridgePlugin.jslib`
- [ ] **HTML5:** Unmodified `ping-bridge.js` (matching `_template-html5/`)
- [ ] A `README.md` with game description, controls, and screenshots/GIF
- [ ] An `index.html` entry point

### PR Description Template

```
## Game Name

Brief description of the game.

## Controls
- List controls here

## Multiplayer
- How does multiplayer work?
- What state is synced?

## Screenshots
(attach screenshots or GIF)

## Checklist
- [ ] PingBridge files unmodified
- [ ] WebGL build included
- [ ] Tested in Unity Editor
- [ ] Handles rejoin (OnInit with existing state)
- [ ] State payloads under 64KB
- [ ] No external network requests
- [ ] No Unity splash screen
- [ ] EventSystem in scene
- [ ] All assets MIT-compatible
```

## Review Process

1. CI validates bridge files and build outputs
2. Ping team reviews code and plays the game
3. Internal testing in a real Matrix room
4. Feedback / approval
5. Merge → auto-deploy to GitHub Pages CDN

## Questions?

Open an issue or reach out to the Ping team.
