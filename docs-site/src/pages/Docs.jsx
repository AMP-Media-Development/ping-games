import { useState, useEffect, useRef } from 'react'
import CodeBlock from '../components/CodeBlock.jsx'

const GH = 'https://github.com/AMP-Media-Development/ping-games'

const NAV = [
  {
    group: 'Getting Started',
    links: [
      { id: 'overview', label: 'Overview' },
      { id: 'prerequisites', label: 'Prerequisites' },
      { id: 'quickstart-html5', label: 'Quick Start — HTML5' },
      { id: 'quickstart-unity', label: 'Quick Start — Unity' },
    ],
  },
  {
    group: 'PingBridge Protocol',
    links: [
      { id: 'how-it-works', label: 'How It Works' },
      { id: 'html5-api', label: 'HTML5 API Reference' },
      { id: 'unity-api', label: 'Unity API Reference' },
      { id: 'canonical-files', label: 'Canonical Files' },
    ],
  },
  {
    group: 'Design Specs',
    links: [
      { id: 'visual-specs', label: 'Visual Requirements' },
      { id: 'game-design', label: 'Game Design Rules' },
    ],
  },
  {
    group: 'Contributing',
    links: [
      { id: 'submission', label: 'Submission Checklist' },
      { id: 'review', label: 'Review Process' },
      { id: 'cicd', label: 'CI/CD Pipeline' },
    ],
  },
]

const QUICKSTART_HTML5 = `git clone https://github.com/AMP-Media-Development/ping-games.git
cd ping-games

# Copy the HTML5 template
cp -r _template-html5 games/my-game-name

# Serve locally and open in browser
npx serve games/my-game-name
# → http://localhost:3000`

const QUICKSTART_UNITY = `git clone https://github.com/AMP-Media-Development/ping-games.git
cd ping-games

# Copy the Unity template
cp -r _template games/my-game-name

# Open in Unity Hub:
#   File → Add project from disk → games/my-game-name/

# Build for WebGL:
#   File → Build Settings → WebGL → Switch Platform → Build
#   Output path: games/my-game-name/Build/`

const HTML5_GAME_JS = `const bridge = new PingBridge()
let state = { score: 0, position: { x: 0, y: 0 } }

// Called when Ping initializes the game
bridge.onInit((payload) => {
  const { roomId, players, isHost, rejoined, savedState } = payload
  if (rejoined && savedState) {
    state = savedState  // restore after disconnect
  }
  startGame(isHost)
})

// Called when an opponent sends state (~5–30ms via WebRTC)
bridge.onStateSync((remoteState) => {
  applyOpponentState(remoteState)
})

// Game loop — send your state each frame (or throttle to 10–30Hz)
function tick() {
  updateGameLogic()
  bridge.sendStateUpdate(state)
  requestAnimationFrame(tick)
}

// Fire when game ends
function onGameOver(winner) {
  bridge.sendAction('game_over', { winner, finalScore: state.score })
}`

const UNITY_GAME_MANAGER = `using UnityEngine;

public class GameManager : MonoBehaviour
{
    void Start()
    {
        PingBridge.Instance.OnInit      += HandleInit;
        PingBridge.Instance.OnStateSync += HandleStateSync;
    }

    void HandleInit(PingInitPayload payload)
    {
        // payload.isHost, payload.players, payload.roomId
        StartGame(payload.isHost);
    }

    void HandleStateSync(string stateJson)
    {
        var remote = JsonUtility.FromJson<GameState>(stateJson);
        ApplyRemoteState(remote);
    }

    void Update()
    {
        // Throttle to ~20Hz to stay within state-size budget
        if (Time.frameCount % 3 == 0)
        {
            var state = new GameState { /* your fields */ };
            PingBridge.Instance.SendStateUpdate(JsonUtility.ToJson(state));
        }
    }

    void EndGame(string winner)
    {
        PingBridge.Instance.SendAction("game_over",
            $"{{\"winner\":\"{winner}\"}}");
    }
}`

const HTML5_API_TABLE = [
  { method: 'bridge.onInit(cb)', desc: 'Called once when Ping initializes the game', returns: 'void' },
  { method: 'bridge.onStateSync(cb)', desc: 'Called when a remote player sends state', returns: 'void' },
  { method: 'bridge.sendStateUpdate(obj)', desc: 'Broadcast your game state to all players', returns: 'void' },
  { method: 'bridge.sendAction(type, payload)', desc: 'Fire a named event (creates a Matrix timeline entry)', returns: 'void' },
]

const UNITY_API_TABLE = [
  { method: 'PingBridge.Instance.OnInit', desc: 'C# event: fired on game init', returns: 'event Action<PingInitPayload>' },
  { method: 'PingBridge.Instance.OnStateSync', desc: 'C# event: fired on remote state receipt', returns: 'event Action<string>' },
  { method: 'PingBridge.Instance.SendStateUpdate(json)', desc: 'Broadcast JSON state string', returns: 'void' },
  { method: 'PingBridge.Instance.SendAction(type, json)', desc: 'Fire a named action event', returns: 'void' },
]

export default function Docs() {
  const [active, setActive] = useState('overview')
  const sectionRefs = useRef({})

  const scrollTo = (id) => {
    setActive(id)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' }
    )
    const sections = document.querySelectorAll('.docs-section[id]')
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])

  return (
    <div className="docs-wrap">
      {/* Sidebar */}
      <aside className="docs-sidebar">
        {NAV.map(({ group, links }) => (
          <div key={group} className="sidebar-group">
            <div className="sidebar-group-label">{group}</div>
            {links.map(({ id, label }) => (
              <button
                key={id}
                className={`sidebar-link${active === id ? ' active' : ''}`}
                onClick={() => scrollTo(id)}
              >
                {label}
              </button>
            ))}
          </div>
        ))}
      </aside>

      {/* Content */}
      <main className="docs-main">
        <h1>Developer Documentation</h1>
        <p className="docs-lead">
          Everything you need to build, test, and ship a multiplayer game for the Ping platform.
          Start with the Quick Start for your preferred stack, then read the PingBridge API reference.
        </p>

        {/* ── Overview ── */}
        <div id="overview" className="docs-section">
          <h2>Overview</h2>
          <p>
            Ping Games is an open game platform for the <a href="https://ping.live" target="_blank" rel="noopener noreferrer">Ping</a> chat ecosystem.
            Games are built as <strong>Unity WebGL</strong> or <strong>HTML5</strong> projects, connected to the Ping host
            via the <strong>PingBridge protocol</strong>, and deployed automatically to GitHub Pages on every merged PR.
          </p>
          <p>
            The architecture is intentionally simple: your game only needs to send and receive state.
            All WebRTC negotiation, Matrix signaling, and session management is handled by PingBridge.
          </p>
          <div className="callout callout-info">
            <div className="callout-title">Key Principle</div>
            <p>
              Your game should never make direct network requests. All communication goes through
              <code>bridge.sendStateUpdate()</code> and <code>bridge.sendAction()</code>.
              PingBridge handles everything else.
            </p>
          </div>

          <h3>How a game session works</h3>
          <p>
            When a player accepts a game invite in Ping chat, the Ping web app loads your game in an iframe.
            PingBridge (loaded with your game) connects to the Ping host via PostMessage, which then establishes
            a WebRTC data channel between the two players. Once the channel is open, state flows at 5–30ms latency.
            Matrix timeline events are used as a fallback when WebRTC is unavailable.
          </p>
        </div>

        {/* ── Prerequisites ── */}
        <div id="prerequisites" className="docs-section">
          <h2>Prerequisites</h2>
          <h3>HTML5 games</h3>
          <ul>
            <li><strong>Git</strong> — to clone and submit changes</li>
            <li><strong>A modern browser</strong> — Chrome, Firefox, or Safari for testing</li>
            <li>Node.js 18+ (optional — only if you use a build tool or bundler)</li>
          </ul>
          <h3>Unity games</h3>
          <ul>
            <li><strong>Git</strong> — to clone and submit changes</li>
            <li><strong>Unity 2022 LTS or Unity 6</strong> — with WebGL Build Support module installed via Unity Hub</li>
          </ul>
          <h3>Both</h3>
          <ul>
            <li>A <strong>GitHub account</strong> to fork the repo and open PRs</li>
          </ul>
        </div>

        {/* ── Quick Start HTML5 ── */}
        <div id="quickstart-html5" className="docs-section">
          <h2>Quick Start — HTML5</h2>
          <p>
            HTML5 games require no build step. You edit source files directly and ship them as-is.
            This is the fastest path from zero to a working multiplayer game.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <div className="step-title">Clone and copy the template</div>
                <div className="step-desc">
                  <CodeBlock code={QUICKSTART_HTML5} lang="bash" />
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <div className="step-title">Edit <code>game.js</code></div>
                <div className="step-desc">
                  Implement your game logic in <code>games/my-game-name/game.js</code>.
                  The template has placeholder functions for <code>onInit</code>, <code>onStateSync</code>,
                  and the game loop. Fill them in with your logic.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <div className="step-title">Test locally and open a PR</div>
                <div className="step-desc">
                  Open <code>http://localhost:3000</code> in two browser windows side by side.
                  PingBridge auto-pairs them in dev mode for a full multiplayer test.
                  When happy, push your branch and open a PR.
                </div>
              </div>
            </div>
          </div>

          <p>
            Your game directory must contain: <code>ping-bridge.js</code> (unmodified), <code>game.js</code>, and <code>index.html</code>.
            CSS and asset files are optional but supported.
          </p>
        </div>

        {/* ── Quick Start Unity ── */}
        <div id="quickstart-unity" className="docs-section">
          <h2>Quick Start — Unity</h2>
          <p>
            Unity games target the WebGL build platform. The template includes <code>PingBridge.cs</code>
            and the required WebGL plugin pre-configured. You only need to edit <code>GameManager.cs</code>.
          </p>

          <div className="steps">
            <div className="step">
              <div className="step-num">1</div>
              <div className="step-body">
                <div className="step-title">Clone and copy the template</div>
                <div className="step-desc">
                  <CodeBlock code={QUICKSTART_UNITY} lang="bash" />
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">2</div>
              <div className="step-body">
                <div className="step-title">Edit <code>GameManager.cs</code></div>
                <div className="step-desc">
                  Your game logic goes in <code>Assets/Scripts/GameManager.cs</code>.
                  Subscribe to <code>PingBridge.Instance.OnInit</code> and <code>OnStateSync</code> events,
                  and call <code>SendStateUpdate</code> in your <code>Update</code> loop.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">3</div>
              <div className="step-body">
                <div className="step-title">Build to <code>games/my-game/Build/</code></div>
                <div className="step-desc">
                  In Unity: <em>File → Build Settings → WebGL → Build</em>.
                  Set the output path to <code>games/my-game-name/Build/</code>.
                  The CI validator checks for <code>WebGLBuild.loader.js</code> and <code>WebGLBuild.wasm</code>.
                </div>
              </div>
            </div>
            <div className="step">
              <div className="step-num">4</div>
              <div className="step-body">
                <div className="step-title">Commit the build output and open a PR</div>
                <div className="step-desc">
                  Commit the entire <code>games/my-game-name/</code> directory including the <code>Build/</code>
                  folder. Unity WebGL builds are binary but required for the CDN.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── How It Works ── */}
        <div id="how-it-works" className="docs-section">
          <h2>How PingBridge Works</h2>
          <p>
            PingBridge is a <strong>PostMessage-based IPC layer</strong> between your game (running in an iframe)
            and the Ping web host (the parent frame). The bridge exposes a simple event model:
            your game reacts to inbound events and fires outbound ones.
          </p>
          <p>
            Internally, the Ping host establishes a <strong>WebRTC data channel</strong> between the two players
            using Matrix timeline events for signaling. Once the channel is open, state sent via
            <code>sendStateUpdate()</code> travels peer-to-peer at 5–30ms latency.
            If WebRTC is unavailable, Ping falls back to Matrix timeline delivery (~100ms).
          </p>

          <div className="callout callout-warn">
            <div className="callout-title">State size limit</div>
            <p>
              Keep each <code>sendStateUpdate()</code> payload under <strong>4 KB</strong> (WebRTC data channel
              message limit). For large game states, send diffs instead of full state on every frame.
            </p>
          </div>
        </div>

        {/* ── HTML5 API ── */}
        <div id="html5-api" className="docs-section">
          <h2>HTML5 API Reference</h2>
          <p>
            The HTML5 bridge is a single script (<code>ping-bridge.js</code>) that exposes a class-based API.
            Load it before your game script in <code>index.html</code>.
          </p>
          <CodeBlock code={HTML5_GAME_JS} lang="javascript" />

          <h3>Methods</h3>
          <table className="api-table">
            <thead>
              <tr><th>Method</th><th>Description</th><th>Returns</th></tr>
            </thead>
            <tbody>
              {HTML5_API_TABLE.map((row) => (
                <tr key={row.method}>
                  <td><code>{row.method}</code></td>
                  <td>{row.desc}</td>
                  <td><code>{row.returns}</code></td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3>onInit payload fields</h3>
          <table className="api-table">
            <thead>
              <tr><th>Field</th><th>Type</th><th>Description</th></tr>
            </thead>
            <tbody>
              {[
                { field: 'roomId', type: 'string', desc: 'Matrix room ID for this game session' },
                { field: 'players', type: 'Player[]', desc: 'Array of player objects in the room' },
                { field: 'isHost', type: 'boolean', desc: 'True if this client is the session host' },
                { field: 'rejoined', type: 'boolean', desc: 'True if the player reconnected to an active game' },
                { field: 'savedState', type: 'object|null', desc: 'Last known state if rejoined is true' },
              ].map((r) => (
                <tr key={r.field}>
                  <td><code>{r.field}</code></td>
                  <td><code>{r.type}</code></td>
                  <td>{r.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Unity API ── */}
        <div id="unity-api" className="docs-section">
          <h2>Unity (C#) API Reference</h2>
          <p>
            The Unity bridge is a singleton MonoBehaviour (<code>PingBridge.cs</code>).
            Subscribe to its events in your <code>GameManager</code> and call its methods to send state.
          </p>
          <CodeBlock code={UNITY_GAME_MANAGER} lang="csharp" />

          <h3>Members</h3>
          <table className="api-table">
            <thead>
              <tr><th>Member</th><th>Description</th><th>Type</th></tr>
            </thead>
            <tbody>
              {UNITY_API_TABLE.map((row) => (
                <tr key={row.method}>
                  <td><code>{row.method}</code></td>
                  <td>{row.desc}</td>
                  <td><code>{row.returns}</code></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Canonical Files ── */}
        <div id="canonical-files" className="docs-section">
          <h2>Canonical Files</h2>
          <p>
            The following files are <strong>owned by platform maintainers</strong> and validated byte-for-byte
            on every PR. Modifying them will cause CI to fail immediately.
          </p>
          <table className="api-table">
            <thead>
              <tr><th>File</th><th>Template</th><th>Purpose</th></tr>
            </thead>
            <tbody>
              {[
                { file: 'ping-bridge.js', tpl: '_template-html5/', purpose: 'HTML5 bridge implementation' },
                { file: 'PingBridge.cs', tpl: '_template/', purpose: 'Unity C# bridge component' },
                { file: 'PingBridgePlugin.jslib', tpl: '_template/', purpose: 'Unity WebGL JS interop layer' },
              ].map((r) => (
                <tr key={r.file}>
                  <td><code>{r.file}</code></td>
                  <td><code>{r.tpl}</code></td>
                  <td>{r.purpose}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="callout callout-info">
            <div className="callout-title">Bridge change requests</div>
            <p>
              If you need a new feature or have found a bug in the bridge, open an issue tagged
              <code>bridge-change</code>. Platform maintainers manage all bridge modifications.
            </p>
          </div>
        </div>

        {/* ── Visual Specs ── */}
        <div id="visual-specs" className="docs-section">
          <h2>Visual Requirements</h2>
          <ul>
            <li><strong>Responsive canvas</strong> — must scale to fill the iframe container (typically 800×600 or 16:9 aspect ratio)</li>
            <li><strong>Dark background preferred</strong> — games are embedded in Ping's dark theme UI</li>
            <li><strong>Loading state</strong> — display a loading indicator before <code>onInit</code> fires</li>
            <li><strong>Disconnect handling</strong> — show a clear message if the opponent disconnects; handle gracefully</li>
          </ul>
        </div>

        {/* ── Game Design Rules ── */}
        <div id="game-design" className="docs-section">
          <h2>Game Design Rules</h2>
          <ul>
            <li><strong>2-player focus</strong> — design for exactly two players; handle the waiting state when the second player hasn't joined</li>
            <li><strong>Clear win condition</strong> — always call <code>sendAction('game_over', ...)</code> when the game ends</li>
            <li><strong>State size</strong> — keep <code>sendStateUpdate()</code> payloads under 4 KB</li>
            <li><strong>Update rate</strong> — send state at 10–60 Hz depending on game type; avoid flooding the channel</li>
            <li><strong>Keyboard-primary input</strong> — primary control scheme must be keyboard-based</li>
            <li><strong>No autoplay audio</strong> — respect browser autoplay policies; start audio on first user interaction</li>
          </ul>
        </div>

        {/* ── Submission Checklist ── */}
        <div id="submission" className="docs-section">
          <h2>Submission Checklist</h2>
          <p>Complete this checklist before opening a PR:</p>
          <ul>
            <li>Game directory is under <code>games/my-game-name/</code> (kebab-case)</li>
            <li><code>index.html</code> is present and loads the game</li>
            <li>Bridge files are unmodified — run <code>git diff</code> to verify</li>
            <li><code>onInit</code> is handled; game starts after receiving the payload</li>
            <li><code>onStateSync</code> is handled; opponent state is applied correctly</li>
            <li><code>sendStateUpdate()</code> is called during active gameplay</li>
            <li><code>sendAction('game_over', ...)</code> fires when the game ends</li>
            <li>Game tested locally in two browser windows simultaneously</li>
            <li>No console errors on load or during gameplay</li>
            <li><em>Unity only:</em> <code>Build/WebGLBuild.loader.js</code> and <code>Build/WebGLBuild.wasm</code> are committed</li>
          </ul>
        </div>

        {/* ── Review Process ── */}
        <div id="review" className="docs-section">
          <h2>Review Process</h2>
          <p>
            PRs are reviewed by <code>@AMP-Media-Development/game-reviewers</code> (see{' '}
            <a href={`${GH}/blob/main/.github/CODEOWNERS`} target="_blank" rel="noopener noreferrer">CODEOWNERS</a>).
            First review within 5 business days. Expect 1–2 rounds of feedback for new contributors.
          </p>
          <table className="api-table">
            <thead>
              <tr><th>Area</th><th>What reviewers check</th></tr>
            </thead>
            <tbody>
              {[
                { area: 'Protocol compliance', check: 'Bridge files unmodified; correct API usage; no direct network calls' },
                { area: 'Code quality', check: 'No eval, no XSS vectors, no inline scripts in HTML' },
                { area: 'UX standards', check: 'Loading state, win condition, responsive canvas, disconnect handling' },
                { area: 'Performance', check: 'State size under 4 KB, reasonable update rate, no memory leaks' },
                { area: 'Game design', check: '2-player design, clear rules, playable and fun' },
              ].map((r) => (
                <tr key={r.area}>
                  <td><strong>{r.area}</strong></td>
                  <td>{r.check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── CI/CD ── */}
        <div id="cicd" className="docs-section">
          <h2>CI/CD Pipeline</h2>
          <p>
            Every push to <code>main</code> triggers the deploy workflow. PRs trigger the validate job only.
          </p>
          <h3>validate job (PRs and pushes)</h3>
          <ul>
            <li>Compares each game's bridge files against the canonical copies — fails if any differ</li>
            <li>Verifies <code>index.html</code> exists for each game</li>
            <li>Verifies Unity build output files exist when a <code>Build/</code> directory is present</li>
          </ul>
          <h3>deploy job (pushes to main only)</h3>
          <ul>
            <li>Builds the docs React site</li>
            <li>Assembles a <code>_site/</code> directory: docs site at root, games at <code>/game-name/</code></li>
            <li>Uploads and deploys to GitHub Pages via <code>actions/deploy-pages</code></li>
          </ul>
          <p>
            After merge, your game is live at:{' '}
            <code>https://AMP-Media-Development.github.io/ping-games/your-game-name/</code>
          </p>
        </div>
      </main>
    </div>
  )
}
