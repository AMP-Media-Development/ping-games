import { Link } from 'react-router-dom'
import CodeBlock from '../components/CodeBlock.jsx'

const FEATURES = [
  { icon: '⚡', name: 'WebRTC P2P Multiplayer', desc: 'Real-time peer-to-peer sync at 5–30ms latency. PingBridge handles all WebRTC setup — your game just sends and receives state.' },
  { icon: '🎮', name: 'Two Ready-to-Use Templates', desc: 'Unity WebGL and HTML5 Canvas starter templates with PingBridge pre-wired. Copy, implement, ship.' },
  { icon: '🚀', name: 'Auto-Deploy via CI/CD', desc: 'Every merged PR auto-deploys to the GitHub Pages CDN. No hosting setup, no DevOps — just merge.' },
  { icon: '💬', name: 'Chat-Native Game Invites', desc: 'Players challenge each other directly from Ping chat. Game invites appear as rich Matrix timeline events.' },
  { icon: '🔒', name: 'Protocol Safety Built In', desc: 'PingBridge canonical files are validated byte-for-byte on every PR. No accidental network bypass possible.' },
  { icon: '📦', name: 'Fully Open Source', desc: 'MIT license. Fork it, extend it, learn from it. Every game and the platform itself is open and auditable.' },
]

const QUICKSTART = `# Clone the repo
git clone https://github.com/AMP-Media-Development/ping-games.git
cd ping-games

# HTML5 game — zero build step
cp -r _template-html5 games/my-game
# edit game.js → test in browser → open PR

# Unity WebGL game
cp -r _template games/my-game
# open in Unity → build WebGL → open PR`

const BRIDGE_SNIPPET = `// PingBridge API — HTML5
const bridge = new PingBridge()

bridge.onInit(({ players, isHost }) => {
  startGame(isHost)
})

bridge.onStateSync((state) => {
  // opponent state arrives at <30ms
  applyRemoteState(state)
})

// send your state every frame
bridge.sendStateUpdate({ ball, score, paddle })

// fire when game ends
bridge.sendAction('game_over', { winner })`

const GAMES = [
  {
    icon: '🏓',
    name: 'Pong',
    type: 'unity',
    badge: 'Unity WebGL',
    desc: 'Classic two-player Pong built with Unity. Demonstrates real-time PingBridge state sync and game-over events.',
    url: 'https://AMP-Media-Development.github.io/ping-games/pong/',
  },
  {
    icon: '🪙',
    name: 'Coin Flip',
    type: 'html5',
    badge: 'HTML5 Canvas',
    desc: 'Minimal HTML5 Canvas coin flip game with procedural animations. The simplest possible PingBridge integration.',
    url: 'https://AMP-Media-Development.github.io/ping-games/coinflip/',
  },
]

export default function Landing() {
  return (
    <div>
      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <span>🎮</span>
              Open-source · WebRTC multiplayer · MIT license
            </div>

            <h1 className="hero-title">
              Build multiplayer games<br />
              for <span className="accent">Ping</span>
            </h1>

            <p className="hero-subtitle">
              The open game platform for the Ping chat ecosystem.
              Ship WebRTC-powered multiplayer games with two battle-tested
              templates and automatic CDN deployment.
            </p>

            <div className="hero-actions">
              <Link to="/docs" className="btn btn-primary btn-lg">
                Start Building →
              </Link>
              <Link to="/marketplace" className="btn btn-ghost btn-lg">
                Browse Games
              </Link>
            </div>

            <div className="hero-code">
              <CodeBlock code={QUICKSTART} lang="bash" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <div className="stats-bar">
        <div className="container">
          <div className="stats-inner">
            {[
              { num: '2', label: 'Live Games' },
              { num: '<30ms', label: 'P2P Latency' },
              { num: '2', label: 'Templates' },
              { num: 'MIT', label: 'License' },
            ].map(({ num, label }) => (
              <div key={label} className="stat">
                <div className="stat-num">{num}</div>
                <div className="stat-label">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Features ── */}
      <section className="section">
        <div className="container">
          <div className="sec-header centered">
            <div className="sec-label">Why Ping Games</div>
            <h2 className="sec-title">
              Everything you need to ship<br />a multiplayer game
            </h2>
            <p className="sec-sub">
              No WebRTC config. No backend. No infra. Just your game logic.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f) => (
              <div key={f.name} className="feature-card">
                <div className="feature-icon">{f.icon}</div>
                <div className="feature-name">{f.name}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PingBridge ── */}
      <section
        className="section"
        style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="container">
          <div className="split">
            <div>
              <div className="sec-label">PingBridge Protocol</div>
              <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '16px' }}>
                Multiplayer in a few lines of code
              </h2>
              <p style={{ fontSize: '15px', color: 'var(--text-2)', lineHeight: '1.75', marginBottom: '28px' }}>
                PingBridge is the canonical protocol layer between your game and the Ping host.
                It abstracts WebRTC signaling, session management, and state fallback so your game
                only needs to know <em>what</em> to sync — not <em>how</em>.
              </p>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <Link to="/docs" className="btn btn-primary">
                  Read the Protocol Docs
                </Link>
                <a
                  href="https://github.com/AMP-Media-Development/ping-games/blob/main/DEVELOPER_GUIDE.md"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-ghost"
                >
                  Full Dev Guide ↗
                </a>
              </div>
            </div>
            <div>
              <CodeBlock code={BRIDGE_SNIPPET} lang="javascript" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Games ── */}
      <section className="section">
        <div className="container">
          <div className="sec-header centered">
            <div className="sec-label">Games Library</div>
            <h2 className="sec-title">Explore live games</h2>
            <p className="sec-sub">
              Games built on the Ping platform and available for any Ping user to play.
            </p>
          </div>

          <div className="games-grid">
            {GAMES.map((g) => (
              <div key={g.name} className="game-card">
                <div className="game-thumb">
                  {g.icon}
                  <div className="game-thumb-overlay">
                    <a href={g.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary">
                      Play Now
                    </a>
                  </div>
                </div>
                <div className="game-body">
                  <div className="game-header">
                    <div className="game-name">{g.name}</div>
                    <span className={`badge badge-${g.type}`}>{g.badge}</span>
                  </div>
                  <div className="game-desc">{g.desc}</div>
                  <div className="game-footer">
                    <div className="game-tags">
                      <span className="badge badge-accent">Live</span>
                    </div>
                    <a
                      href={g.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-ghost"
                      style={{ fontSize: '13px', padding: '6px 14px' }}
                    >
                      Play →
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '44px' }}>
            <Link to="/marketplace" className="btn btn-ghost btn-lg">
              View All Games →
            </Link>
          </div>
        </div>
      </section>

      {/* ── How to Contribute ── */}
      <section
        className="section-sm"
        style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}
      >
        <div className="container" style={{ textAlign: 'center' }}>
          <div className="sec-label">Contribute</div>
          <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '16px' }}>
            Ship your game in 3 steps
          </h2>
          <p className="sec-sub" style={{ margin: '0 auto 48px' }}>
            Fork → build → PR. It really is that simple.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {[
              { num: '01', title: 'Copy a template', desc: 'Pick Unity or HTML5. Run one cp command to get started.' },
              { num: '02', title: 'Implement your game', desc: "Add your game logic. Use PingBridge for multiplayer — it's already wired." },
              { num: '03', title: 'Open a PR', desc: 'CI validates, reviewers approve, and your game auto-deploys on merge.' },
            ].map((s) => (
              <div key={s.num} className="feature-card" style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--accent)', marginBottom: '12px', fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.03em' }}>{s.num}</div>
                <div className="feature-name">{s.title}</div>
                <div className="feature-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <div className="cta">
        <h2 className="cta-title">Ready to ship your game?</h2>
        <p className="cta-sub">Clone the repo, pick a template, and open a PR.</p>
        <div className="hero-actions">
          <Link to="/docs" className="btn btn-primary btn-lg">
            Read the Docs →
          </Link>
          <a
            href="https://github.com/AMP-Media-Development/ping-games"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost btn-lg"
          >
            View on GitHub ↗
          </a>
        </div>
      </div>
    </div>
  )
}
