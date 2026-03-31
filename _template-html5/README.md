# HTML5 Game Template

Starter template for building an HTML5/JavaScript game for Ping. Use this for games built with vanilla JS, Phaser, Three.js, or any web framework.

## What's Included

```
_template-html5/
  index.html       <- Entry point (loads bridge + your game)
  ping-bridge.js   <- DO NOT MODIFY (postMessage bridge to Ping host)
  game.js          <- YOUR game logic (edit this!)
  game.css         <- YOUR game styles (edit this!)
```

## Getting Started

1. Copy this folder: `cp -r _template-html5 games/my-game`
2. Edit `game.js` — follow the TODOs
3. Open `index.html` in a browser to test (bridge auto-simulates init)
4. Open a PR

## Key Rules

- **DO NOT** modify `ping-bridge.js`
- **DO** call `PingBridge.sendReady()` when your game loads
- **DO** call `PingBridge.sendStateUpdate(state)` for all state changes
- **DO** call `PingBridge.sendAction(action, payload)` only for notable events
- **DO** handle `PingBridge.onInit` with existing state (rejoin)

See the [Developer Guide](../DEVELOPER_GUIDE.md) for full details.
