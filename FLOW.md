# Ping Games — Developer Onboarding Flow

> **Vision:** Ping Games is the open-source game platform for the Ping chat ecosystem — inspired by the way Rive provides a marketplace and developer workflow for interactive content. Any developer can build a multiplayer game, submit it via PR, and have it auto-deployed to the Ping platform for players to discover and launch from chat.

---

## Table of Contents

1. [What is Ping Games?](#what-is-ping-games)
2. [Architecture Overview](#architecture-overview)
3. [Prerequisites](#prerequisites)
4. [Repository Structure](#repository-structure)
5. [Local Development Setup](#local-development-setup)
6. [Choosing a Template](#choosing-a-template)
7. [Building Your Game](#building-your-game)
8. [PingBridge Integration](#pingbridge-integration)
9. [Design Specifications](#design-specifications)
10. [Testing Your Game](#testing-your-game)
11. [Submitting a Pull Request](#submitting-a-pull-request)
12. [Review Process](#review-process)
13. [Post-Merge Deployment](#post-merge-deployment)
14. [Maintaining a Game](#maintaining-a-game)
15. [Documentation Site](#documentation-site)

---

## What is Ping Games?

Ping Games is an **open-source, community-driven game platform** integrated into the [Ping](https://ping.live) chat app. Games are:

- **Chat-native** — players challenge each other directly from a Ping room
- **WebRTC-powered** — peer-to-peer real-time sync with 5–30ms latency
- **CDN-hosted** — automatically deployed to GitHub Pages on every merge
- **Protocol-safe** — the PingBridge canonical files are validated on every PR

The platform works like Rive's community marketplace: contributors submit games via pull request, maintainers review and merge, and games are instantly available to all Ping users.

```
Contributor  →  PR (game code)  →  Review  →  Merge  →  Auto-deploy  →  Players
```

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                      Ping Web App                       │
│                                                         │
│   ┌──────────────────────────────────────────────────┐  │
│   │              Embedded Game (iframe)              │  │
│   │                                                  │  │
│   │   Your Game ◄──── PingBridge ────► PostMessage   │  │
│   │   (Unity / HTML5)   (protocol)      interface    │  │
│   └──────────────────────────────────────────────────┘  │
│                          │                              │
│              WebRTC Data Channel (P2P)                  │
│           Matrix Timeline (signaling / fallback)         │
└─────────────────────────────────────────────────────────┘
```

**Key components:**

| Component | Description | Location |
|-----------|-------------|----------|
| `PingBridge.cs` | Unity C# bridge (canonical, do not modify) | `_template/Assets/Scripts/` |
| `PingBridgePlugin.jslib` | Unity WebGL JS interop (canonical) | `_template/Assets/Plugins/WebGL/` |
| `ping-bridge.js` | HTML5 bridge (canonical, do not modify) | `_template-html5/` |
| `games/*/` | Individual game directories | `games/` |

---

## Prerequisites

### For HTML5 games
- **Git** — to clone and submit changes
- **A modern browser** — for local testing
- **Node.js 18+** (optional, only if you use a build tool)

### For Unity games
- **Git** — to clone and submit changes
- **Unity 2022 LTS or Unity 6** — with WebGL Build Support module installed
- **Unity Hub** — recommended for managing Unity versions

### General
- A **GitHub account** — to fork and submit PRs
- Familiarity with the **PR workflow** (fork → branch → commit → PR)

---

## Repository Structure

```
ping-games/
├── games/                         # All live games (one directory per game)
│   ├── pong/                      # Unity WebGL — classic two-player Pong
│   │   ├── Assets/Scripts/PingBridge.cs    (canonical — do NOT modify)
│   │   ├── Assets/Plugins/WebGL/PingBridgePlugin.jslib  (canonical)
│   │   ├── Build/                 # Unity WebGL build output
│   │   │   ├── WebGLBuild.loader.js
│   │   │   ├── WebGLBuild.wasm
│   │   │   └── ...
│   │   └── index.html             # Game entry point
│   └── coinflip/                  # HTML5 Canvas — coin flip game
│       ├── ping-bridge.js         (canonical — do NOT modify)
│       ├── game.js                # Game logic
│       ├── game.css               # Game styles
│       └── index.html             # Game entry point
│
├── _template/                     # Unity WebGL starter template
│   ├── Assets/Scripts/PingBridge.cs
│   ├── Assets/Scripts/GameManager.cs   ← edit this
│   ├── Assets/Plugins/WebGL/PingBridgePlugin.jslib
│   └── README.md
│
├── _template-html5/               # HTML5 starter template
│   ├── ping-bridge.js             (canonical — do NOT modify)
│   ├── game.js                    ← edit this
│   ├── game.css                   ← edit this
│   └── index.html                 ← minimal edits only
│
├── docs-site/                     # React documentation site (GitHub Pages)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
│
├── .github/
│   ├── workflows/
│   │   └── deploy.yml             # Validate + build docs + deploy to Pages
│   ├── canonical/                 # Authoritative bridge file copies
│   └── CODEOWNERS
│
├── FLOW.md                        # This file — developer onboarding
├── DEVELOPER_GUIDE.md             # Deep-dive architecture reference
├── CONTRIBUTING.md                # PR rules and review checklist
└── README.md                      # Quick start
```

---

## Local Development Setup

```bash
# 1. Fork the repo on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/ping-games.git
cd ping-games

# 2. Create a branch for your game
git checkout -b add-my-game-name

# 3. Copy the appropriate template
cp -r _template-html5 games/my-game-name       # for HTML5
cp -r _template       games/my-game-name       # for Unity

# 4. Start building (see "Building Your Game" below)
```

> **Naming convention:** use `kebab-case` for your game directory name (e.g., `space-invaders`, `tic-tac-toe`). This becomes the CDN URL slug.

---

## Choosing a Template

| | `_template/` (Unity) | `_template-html5/` (HTML5) |
|---|---|---|
| **Best for** | Rich 2D/3D games, physics, complex animations | Simple games, canvas-based, puzzle, card |
| **Language** | C# | JavaScript |
| **Build step** | Required (Unity → WebGL) | None (ship source directly) |
| **PingBridge** | `PingBridge.cs` + `PingBridgePlugin.jslib` | `ping-bridge.js` |
| **Review overhead** | Higher (binary assets reviewed) | Lower |
| **Examples** | Pong | Coin Flip |

**Rule of thumb:** if your game can be built with `<canvas>` and vanilla JS in under 500 lines, use the HTML5 template. For anything that benefits from Unity's editor, use Unity.

---

## Building Your Game

### HTML5 Game

Your game lives entirely in `games/my-game/`:

```
games/my-game/
├── ping-bridge.js    ← copy from _template-html5, DO NOT MODIFY
├── index.html        ← entry point, load your scripts here
├── game.js           ← your game logic
└── game.css          ← your styles
```

**`index.html`** must load `ping-bridge.js` before your game script:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Game</title>
  <link rel="stylesheet" href="game.css" />
</head>
<body>
  <canvas id="game-canvas"></canvas>
  <script src="ping-bridge.js"></script>
  <script src="game.js"></script>
</body>
</html>
```

**`game.js`** initializes PingBridge and runs your game loop:

```javascript
const bridge = new PingBridge()
let myState = { /* your game state */ }

bridge.onInit((payload) => {
  const { roomId, players, isHost } = payload
  // Initialize game with room info
  startGame(isHost)
})

bridge.onStateSync((state) => {
  // Merge opponent's state into local game state
  applyRemoteState(state)
})

function tick() {
  // ... update game logic ...
  bridge.sendStateUpdate(myState)  // send state every frame (or on change)
  requestAnimationFrame(tick)
}

// When game ends
function onGameOver(winner) {
  bridge.sendAction('game_over', { winner, score: myState.score })
}
```

### Unity Game

1. **Open Unity Hub** → Add project from disk → select `games/my-game/`
2. **Set build target**: File → Build Settings → WebGL → Switch Platform
3. **Edit `GameManager.cs`** — the template has placeholders for your logic
4. **Build**: File → Build Settings → Build → output to `games/my-game/Build/`
5. **Do not touch** `PingBridge.cs` or `PingBridgePlugin.jslib`

Required build output files (validated by CI):
- `games/my-game/Build/WebGLBuild.loader.js`
- `games/my-game/Build/WebGLBuild.wasm`
- `games/my-game/index.html`

---

## PingBridge Integration

PingBridge is the **canonical protocol layer** between your game and the Ping host. All communication goes through it — your game never makes direct network calls.

### Event Flow

```
Ping Host                    Your Game
    │                            │
    │──── onInit(payload) ──────►│  Game starts, receive room info
    │                            │
    │◄─── sendStateUpdate(s) ────│  You send your game state
    │                            │
    │──── onStateSync(state) ───►│  You receive opponent's state
    │                            │
    │◄─── sendAction(type, p) ───│  Trigger a platform event
```

### HTML5 API Reference

```javascript
// Initialize — call once at startup
const bridge = new PingBridge()

// INBOUND: game is initialized by the Ping host
bridge.onInit((payload) => {
  // payload.roomId      — Matrix room ID
  // payload.players     — array of player objects
  // payload.isHost      — bool: are you the host?
  // payload.rejoined    — bool: did you rejoin a live game?
  // payload.savedState  — last known state if rejoined
})

// INBOUND: receive state from another player (~5–30ms via WebRTC)
bridge.onStateSync((state) => {
  // state — whatever your opponent sent via sendStateUpdate()
})

// OUTBOUND: broadcast your current game state to all players
bridge.sendStateUpdate(state)  // state must be JSON-serializable

// OUTBOUND: send a named action event (appears in Matrix timeline)
bridge.sendAction('game_over', { winner: 'alice', score: 10 })
bridge.sendAction('game_invite', { invitedBy: 'bob' })
```

### Unity (C#) API Reference

```csharp
using UnityEngine;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        // Subscribe to bridge events
        PingBridge.Instance.OnInit     += HandleInit;
        PingBridge.Instance.OnStateSync += HandleStateSync;
    }

    void HandleInit(PingInitPayload payload)
    {
        // payload.roomId, payload.players, payload.isHost
        StartGame(payload.isHost);
    }

    void HandleStateSync(string stateJson)
    {
        var state = JsonUtility.FromJson<GameState>(stateJson);
        ApplyRemoteState(state);
    }

    void Update()
    {
        // Send state on every frame (or throttle to ~10Hz)
        var state = new GameState { /* your fields */ };
        PingBridge.Instance.SendStateUpdate(JsonUtility.ToJson(state));
    }

    void OnGameOver(string winner)
    {
        PingBridge.Instance.SendAction("game_over",
            $"{{\"winner\":\"{winner}\"}}");
    }
}
```

### Canonical Files — Do Not Modify

These files are verified byte-for-byte on every PR. Modifying them will fail CI:

| File | Purpose |
|------|---------|
| `ping-bridge.js` | HTML5 bridge implementation |
| `PingBridge.cs` | Unity C# bridge implementation |
| `PingBridgePlugin.jslib` | Unity WebGL JavaScript interop layer |

If you believe the bridge needs a fix or new feature, open a separate issue — bridge changes are reviewed by platform maintainers only.

---

## Design Specifications

Games must meet these UX standards to pass review:

### Visual
- **Responsive canvas** — scales to fill the iframe container (typically 800×600 or 16:9)
- **Dark background preferred** — games are embedded in Ping's dark UI
- **Loading state** — show a spinner or "Connecting..." before `onInit` fires
- **Reconnection state** — handle `onStateSync` gaps gracefully (opponent disconnect)

### Game Design
- **2-player focus** — design around exactly two players; handle 1-player (waiting) state
- **Clear win condition** — always call `sendAction('game_over', ...)` when the game ends
- **State size** — keep `sendStateUpdate` payload under 4KB (WebRTC data channel limit)
- **Update rate** — send state at 10–60Hz depending on game type; avoid flooding

### Accessibility
- **Keyboard-playable** — primary input must be keyboard (touchscreen optional)
- **No autoplaying audio** — respect browser autoplay policies; start audio on first interaction

---

## Testing Your Game

### HTML5 — Local Test

```bash
# Serve the game directory with any static server
npx serve games/my-game

# Or use Python
python3 -m http.server 8000 --directory games/my-game
```

Open `http://localhost:8000` in your browser. PingBridge will run in **development mode** and mock the Ping host — you'll see console messages for each bridge call.

### Unity — Local Test

1. In Unity Editor, press **Play** — it runs in the Editor with the mock bridge
2. For a full WebGL test, build to `games/my-game/Build/` and serve with `npx serve games/my-game`

### Two-Window Test

For a full multiplayer test, open the same URL in two browser windows side by side. In dev mode, the bridge auto-pairs two instances on `localhost`.

### Pre-PR Checklist

Run these manually before opening a PR:

- [ ] Game loads without console errors
- [ ] `onInit` fires and game starts correctly
- [ ] `sendStateUpdate` is called during gameplay
- [ ] `onStateSync` applies opponent state correctly
- [ ] `sendAction('game_over', ...)` fires on game end
- [ ] `ping-bridge.js` / `PingBridge.cs` are **unmodified** (run `git diff` to verify)
- [ ] `index.html` is present in your game directory
- [ ] Unity: `Build/WebGLBuild.loader.js` and `Build/WebGLBuild.wasm` are present

---

## Submitting a Pull Request

1. **Commit your changes:**
   ```bash
   git add games/my-game/
   git commit -m "feat: add my-game — <one sentence description>"
   ```

2. **Push to your fork:**
   ```bash
   git push origin add-my-game-name
   ```

3. **Open a PR** on GitHub against `AMP-Media-Development/ping-games:main`

4. **Fill in the PR template** — it asks for:
   - Game description and controls
   - Template used (Unity / HTML5)
   - Screenshots or screen recording
   - Self-review checklist

5. **CI will run automatically:**
   - Validates bridge files are canonical
   - Verifies required output files exist
   - Reports any failures as PR status checks

> Do not force-push after a review starts. Add fixup commits instead.

---

## Review Process

PRs are reviewed by **@AMP-Media-Development/game-reviewers** (see CODEOWNERS).

**Review criteria:**

| Area | What reviewers check |
|------|---------------------|
| Protocol compliance | Bridge files unmodified, correct API usage |
| Code quality | No network calls outside PingBridge, no eval, no XSS vectors |
| UX standards | Loading state, win condition, canvas responsiveness |
| Performance | State size, update rate, no memory leaks |
| Game design | 2-player design, clear rules, fun |

**SLA:** First review within 5 business days. Expect 1–2 rounds of feedback for new contributors.

---

## Post-Merge Deployment

After your PR is merged to `main`, the deploy workflow runs automatically:

```
merge to main
    │
    ▼
validate job (bridge file checks, output file checks)
    │
    ▼
deploy job
    ├── build docs site (React)
    ├── assemble _site/
    │     ├── docs-site (root)
    │     ├── pong/
    │     ├── coinflip/
    │     └── your-game/   ← your game is here
    └── deploy to GitHub Pages
```

Your game will be live at:
```
https://AMP-Media-Development.github.io/ping-games/your-game-name/
```

Within minutes of merge, Ping-web will pick up the new CDN URL and the game will appear in the Ping Games marketplace for all users.

---

## Maintaining a Game

Once your game is merged, you are the **primary maintainer**. Expectations:

- **Respond to issues** tagged with your game name within 7 days
- **Test after bridge updates** — when a new canonical bridge version is released, your game's bridge files will be updated via an automated PR; verify your game still works
- **Version compatibility** — games must remain compatible with the current bridge API; breaking changes to the bridge API follow semver and include a migration guide

### Updating Your Game

```bash
# Always work on a feature branch, never commit directly to main
git checkout -b fix/my-game-bug-description
# make changes
git push origin fix/my-game-bug-description
# open a PR — same review process applies
```

### Deprecating / Removing a Game

Open an issue with the `game-removal` label and explain why. Maintainers will deprecate the game listing and remove it from the CDN after a 30-day notice period.

---

## Documentation Site

The `docs-site/` directory contains the React-based documentation and marketplace site, deployed alongside games to GitHub Pages.

### Running the Docs Site Locally

```bash
cd docs-site
npm install
npm run dev
# Open http://localhost:5173/ping-games/
```

### Building the Docs Site

```bash
cd docs-site
npm run build
# Output in docs-site/dist/
```

The CI/CD workflow builds the docs site automatically on every merge. You should not need to commit build artifacts.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page — platform overview and CTAs |
| `/docs` | Developer documentation — this content, rendered |
| `/marketplace` | Game gallery — all live games with play links |
| `/support` | FAQ, community links, bug reporting |

### Contributing to the Docs

Docs content lives in the React components under `docs-site/src/pages/`. Edit the relevant page component and open a PR — same flow as game contributions.

---

*For questions, open an issue on GitHub or reach out in the Ping developer community.*
