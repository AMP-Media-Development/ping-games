## Game Name

<!-- Brief description of the game -->

## Controls

<!-- List controls (keyboard, mouse, touch) -->

## Multiplayer

<!-- How does multiplayer work? What state is synced? -->

## Screenshots

<!-- Attach screenshots or a GIF of gameplay -->

## Checklist

- [ ] Game files under `games/<game-name>/`
- [ ] WebGL build included in `Build/`
- [ ] **Unity:** `PingBridge.cs` unmodified (matches `_template/`)
- [ ] **Unity:** `PingBridgePlugin.jslib` unmodified (matches `_template/`)
- [ ] **HTML5:** `ping-bridge.js` unmodified (matches `_template-html5/`)
- [ ] Tested in Unity Editor (PingBridge auto-simulates init)
- [ ] Handles rejoin (`OnInit` with existing state)
- [ ] `OnStateSync` works for multiplayer
- [ ] State payloads under 64KB
- [ ] `SendAction()` only for notable events (not every frame)
- [ ] No external network requests
- [ ] No Unity splash screen
- [ ] EventSystem present in scene
- [ ] All assets are MIT-compatible
- [ ] `README.md` with description, controls, screenshots
- [ ] `index.html` fallback page included
