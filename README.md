# Ping Games

Open-source multiplayer games for the [Ping](https://ping.live) chat platform. Games connect to Matrix rooms for real-time state synchronization, allowing players to challenge each other directly from chat.

## How It Works

```
Your Game  <──  PingBridge  ──>  Matrix Room
(Unity/HTML5)   (protocol)       (state sync)
```

Games are built as **Unity WebGL** or **HTML5** projects. The **PingBridge** protocol handles all communication between your game and the Ping host — you never make network requests directly.

Built games are hosted on **GitHub Pages** and loaded by Ping-web via CDN URLs.

## Quick Start

### Unity Game
```bash
git clone https://github.com/AMP-Media-Development/ping-games.git
cd ping-games
cp -r _template games/my-game-name
# Open games/my-game-name/ in Unity → edit GameManager.cs → build WebGL → open PR
```

### HTML5 Game
```bash
git clone https://github.com/AMP-Media-Development/ping-games.git
cd ping-games
cp -r _template-html5 games/my-game-name
# Edit game.js → test index.html in browser → open PR
```

## Two Templates

| Template | Use When | Stack |
|----------|----------|-------|
| **[`_template/`](_template/)** | Rich 2D/3D games | Unity WebGL + C# |
| **[`_template-html5/`](_template-html5/)** | Simple/canvas games | Vanilla JS/HTML5 |

Both templates include **PingBridge** pre-configured. The bridge handles all Matrix communication — your game just calls `sendStateUpdate()` and `sendAction()`.

## Games

| Game | Type | Status |
|------|------|--------|
| [Pong](games/pong/) | Unity WebGL | Live |
| [Coin Flip](games/coinflip/) | HTML5 Canvas | Live |

## Documentation

- **[Developer Guide](DEVELOPER_GUIDE.md)** — Full architecture, PingBridge protocol, build instructions
- **[Contributing](CONTRIBUTING.md)** — How to add a new game
- **[Unity Template](_template/README.md)** — Unity game starter
- **[HTML5 Template](_template-html5/README.md)** — HTML5 game starter

## CDN

All deployed games are available at:

```
https://AMP-Media-Development.github.io/ping-games/{game-name}/
```

## License

MIT — see [LICENSE](LICENSE).
