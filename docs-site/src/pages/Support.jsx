import { useState } from 'react'
import { Link } from 'react-router-dom'

const GH = 'https://github.com/AMP-Media-Development/ping-games'

const RESOURCES = [
  {
    icon: '📖',
    title: 'Documentation',
    desc: 'Full developer guide covering PingBridge protocol, templates, API reference, and contribution workflow.',
    action: { label: 'Read the Docs', internal: '/docs' },
  },
  {
    icon: '🐛',
    title: 'Bug Reports',
    desc: 'Found a bug in the platform, a game, or the PingBridge protocol? Open a GitHub issue with reproduction steps.',
    action: { label: 'Open an Issue ↗', href: `${GH}/issues/new` },
  },
  {
    icon: '💡',
    title: 'Feature Requests',
    desc: 'Have an idea for a new API, template feature, or platform improvement? Start a GitHub Discussion.',
    action: { label: 'Start a Discussion ↗', href: `${GH}/discussions` },
  },
  {
    icon: '🔀',
    title: 'Contributing',
    desc: 'Want to add a game, fix a bug, or improve documentation? Read the contributing guide to get started.',
    action: { label: 'Contributing Guide ↗', href: `${GH}/blob/main/CONTRIBUTING.md` },
  },
]

const FAQS = [
  {
    q: 'How do I test my game locally before opening a PR?',
    a: 'Serve your game directory with any static file server — for example, `npx serve games/my-game`. Then open `http://localhost:3000` in two browser windows side by side. PingBridge runs in dev mode on localhost and auto-pairs the two instances for a full multiplayer test.',
  },
  {
    q: 'Can I use a framework like Phaser, Three.js, or Pixi.js?',
    a: 'Absolutely. The HTML5 template is framework-agnostic — it\'s just vanilla JS with PingBridge loaded. You can add any library you like via a CDN link or bundler. The only requirement is that `ping-bridge.js` remains unmodified and is loaded before your game script.',
  },
  {
    q: 'What Unity version should I use?',
    a: 'Unity 2022 LTS or Unity 6. Both are supported. The template targets WebGL build output. Make sure you have the WebGL Build Support module installed via Unity Hub.',
  },
  {
    q: 'My game state is larger than 4 KB — what should I do?',
    a: 'Send diffs instead of full state. On each frame, compute only what changed since the last update and send that delta. For very large game worlds, consider sending a full sync every few seconds and diffs in between.',
  },
  {
    q: 'Can I use external APIs or make network requests from my game?',
    a: 'No. All network communication must go through PingBridge — `sendStateUpdate()` and `sendAction()`. Games that make direct network calls will be rejected during review. This is a security requirement to prevent data exfiltration and to keep game code auditable.',
  },
  {
    q: 'How long does the review process take?',
    a: 'First review within 5 business days for new contributors. Expect 1–2 rounds of feedback. Games that pass the CI checks automatically and include a screen recording in the PR description tend to move through review fastest.',
  },
  {
    q: 'Can I update my game after it\'s merged?',
    a: 'Yes. Open a new PR with your changes — the same review process applies. Never commit directly to main. If you\'re fixing a critical bug, flag it in your PR description for expedited review.',
  },
  {
    q: 'What happens when PingBridge gets a new version?',
    a: 'The platform maintainers open an automated PR against each game\'s bridge files. You\'ll be notified via GitHub and should verify your game still works correctly. Breaking changes in the bridge follow semver and include a migration guide.',
  },
  {
    q: 'How do I handle the case where a player disconnects mid-game?',
    a: 'Monitor the gap between `onStateSync` calls. If you stop receiving updates for more than ~3 seconds, assume the opponent has disconnected and show a reconnecting/waiting state. Don\'t end the game immediately — WebRTC can temporarily drop and reconnect. If the opponent rejoins, PingBridge will resume calling `onStateSync` automatically.',
  },
  {
    q: 'My game needs more than two players — is that supported?',
    a: 'The current PingBridge protocol is designed for two-player sessions (matching Ping\'s one-to-one chat model). If you\'re building a game that supports more than two players, open a GitHub Discussion — this is on the roadmap but not yet supported.',
  },
]

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false)

  // Convert backtick-wrapped text to <code> elements
  const renderAnswer = (text) => {
    const parts = text.split(/`([^`]+)`/)
    return parts.map((part, i) =>
      i % 2 === 1 ? <code key={i}>{part}</code> : part
    )
  }

  return (
    <div className={`faq-item${open ? ' open' : ''}`}>
      <button className="faq-q" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span className="faq-chevron">▼</span>
      </button>
      <div className="faq-a">
        <div className="faq-a-inner">{renderAnswer(a)}</div>
      </div>
    </div>
  )
}

export default function Support() {
  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          padding: '56px 0 48px',
        }}
      >
        <div className="container">
          <div className="sec-label">Support</div>
          <h1 className="sec-title" style={{ marginBottom: '14px' }}>
            How can we help?
          </h1>
          <p className="sec-sub">
            Find answers in the docs, open an issue on GitHub, or browse the FAQ below.
          </p>
        </div>
      </div>

      <div className="section">
        <div className="container">
          {/* Resource Cards */}
          <div className="support-grid">
            {RESOURCES.map((r) => (
              <div key={r.title} className="support-card">
                <div className="support-icon">{r.icon}</div>
                <div className="support-title">{r.title}</div>
                <div className="support-desc">{r.desc}</div>
                {r.action.internal ? (
                  <Link to={r.action.internal} className="btn btn-ghost" style={{ fontSize: '13px', alignSelf: 'flex-start' }}>
                    {r.action.label}
                  </Link>
                ) : (
                  <a
                    href={r.action.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost"
                    style={{ fontSize: '13px', alignSelf: 'flex-start' }}
                  >
                    {r.action.label}
                  </a>
                )}
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              padding: '24px 28px',
              background: 'var(--accent-dim)',
              border: '1px solid rgba(13,189,139,0.2)',
              borderRadius: 'var(--r-lg)',
              marginBottom: '72px',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ fontWeight: '600', marginBottom: '4px' }}>Onboarding Guide (FLOW.md)</div>
              <div style={{ fontSize: '13.5px', color: 'var(--text-2)' }}>
                The complete step-by-step guide for new contributors — from setup to post-merge deployment.
              </div>
            </div>
            <a
              href={`${GH}/blob/main/FLOW.md`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
              style={{ flexShrink: 0 }}
            >
              Read FLOW.md ↗
            </a>
          </div>

          {/* FAQ */}
          <div style={{ marginBottom: '24px', textAlign: 'center' }}>
            <div className="sec-label">FAQ</div>
            <h2 className="sec-title" style={{ fontSize: 'clamp(24px, 3.5vw, 40px)', marginBottom: '8px' }}>
              Frequently Asked Questions
            </h2>
            <p style={{ fontSize: '16px', color: 'var(--text-2)', marginBottom: '48px' }}>
              Common questions from game developers contributing to Ping Games.
            </p>
          </div>

          <div className="faq">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>

          {/* Still need help */}
          <div style={{ textAlign: 'center', marginTop: '64px', padding: '48px 24px' }}>
            <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '10px' }}>
              Still have a question?
            </div>
            <p style={{ fontSize: '15px', color: 'var(--text-2)', marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
              Open a GitHub Discussion for questions that don&apos;t fit into a bug report,
              or check the full Developer Guide for deep technical details.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a
                href={`${GH}/discussions`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
              >
                GitHub Discussions ↗
              </a>
              <a
                href={`${GH}/blob/main/DEVELOPER_GUIDE.md`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost btn-lg"
              >
                Full Dev Guide ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
