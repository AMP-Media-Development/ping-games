import { useState } from 'react'
import { Link } from 'react-router-dom'

const GH = 'https://github.com/AMP-Media-Development/ping-games'
const CDN = 'https://AMP-Media-Development.github.io/ping-games'

const GAMES = [
  {
    id: 'pong',
    icon: '🏓',
    name: 'Pong',
    type: 'unity',
    badge: 'Unity WebGL',
    status: 'live',
    author: 'AMP Media',
    desc: 'Classic two-player Pong with WebRTC real-time state sync. Demonstrates PingBridge protocol integration, game-over events, and Unity WebGL build pipeline.',
    features: ['Real-time ball physics', 'Score tracking', 'Game-over events', 'WebRTC P2P sync'],
    url: `${CDN}/pong/`,
    source: `${GH}/tree/main/games/pong`,
  },
  {
    id: 'coinflip',
    icon: '🪙',
    name: 'Coin Flip',
    type: 'html5',
    badge: 'HTML5 Canvas',
    status: 'live',
    author: 'AMP Media',
    desc: 'A minimal HTML5 Canvas coin flip game with procedurally generated animations. The simplest possible PingBridge reference implementation for HTML5 games.',
    features: ['Procedural animations', 'Instant gameplay', 'Zero dependencies', 'Canvas rendering'],
    url: `${CDN}/coinflip/`,
    source: `${GH}/tree/main/games/coinflip`,
  },
]

const FILTERS = ['All', 'Unity', 'HTML5', 'Live']

export default function Marketplace() {
  const [filter, setFilter] = useState('All')

  const visible = GAMES.filter((g) => {
    if (filter === 'All') return true
    if (filter === 'Unity') return g.type === 'unity'
    if (filter === 'HTML5') return g.type === 'html5'
    if (filter === 'Live') return g.status === 'live'
    return true
  })

  return (
    <div style={{ paddingTop: 'var(--nav-h)' }}>
      {/* Header */}
      <div
        style={{
          background: 'var(--bg-2)',
          borderBottom: '1px solid var(--border)',
          padding: '56px 0 48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse 70% 60% at 50% 100%, rgba(13,189,139,0.07), transparent)',
            pointerEvents: 'none',
          }}
        />
        <div className="container" style={{ position: 'relative' }}>
          <div className="sec-label">Marketplace</div>
          <h1 className="sec-title" style={{ marginBottom: '14px' }}>
            Games Library
          </h1>
          <p className="sec-sub">
            All games built on the Ping platform, available for any Ping user
            to discover and launch directly from chat.
          </p>
          <div style={{ marginTop: '28px', display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link to="/docs" className="btn btn-primary">
              Build a Game →
            </Link>
            <a href={GH} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
              View Source ↗
            </a>
          </div>
        </div>
      </div>

      {/* Games list */}
      <div className="section">
        <div className="container">
          {/* Filters */}
          <div className="filter-bar">
            {FILTERS.map((f) => (
              <button
                key={f}
                className={`filter-btn${filter === f ? ' active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
                {f !== 'All' && (
                  <span style={{ marginLeft: '6px', opacity: 0.6, fontSize: '12px' }}>
                    ({f === 'Unity' ? GAMES.filter(g => g.type === 'unity').length
                      : f === 'HTML5' ? GAMES.filter(g => g.type === 'html5').length
                      : f === 'Live' ? GAMES.filter(g => g.status === 'live').length
                      : GAMES.length})
                  </span>
                )}
              </button>
            ))}
          </div>

          {visible.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-2)' }}>
              No games match this filter yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {visible.map((game) => (
                <GameRow key={game.id} game={game} />
              ))}
            </div>
          )}

          {/* Contribute CTA */}
          <div
            style={{
              marginTop: '64px',
              padding: '40px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--r-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '24px',
              flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>
                Want to add your game?
              </div>
              <div style={{ fontSize: '14px', color: 'var(--text-2)' }}>
                Fork the repo, copy a template, build your game, and open a PR.
                It&apos;ll be live here after review.
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexShrink: 0 }}>
              <Link to="/docs" className="btn btn-primary">
                Get Started
              </Link>
              <a href={`${GH}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
                Contributing Guide ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GameRow({ game }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r-lg)',
        display: 'flex',
        gap: '28px',
        overflow: 'hidden',
        transition: 'border-color var(--ease)',
      }}
      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-strong)'}
      onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
    >
      {/* Thumb */}
      <div
        style={{
          width: '200px',
          flexShrink: 0,
          background: 'var(--bg-2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '72px',
          position: 'relative',
        }}
      >
        {game.icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, padding: '24px 24px 24px 0', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '20px', fontWeight: '700' }}>{game.name}</span>
          <span className={`badge badge-${game.type}`}>{game.badge}</span>
          {game.status === 'live' && <span className="badge badge-accent">Live</span>}
        </div>

        <p style={{ fontSize: '14px', color: 'var(--text-2)', lineHeight: '1.7', marginBottom: '16px' }}>
          {game.desc}
        </p>

        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '20px' }}>
          {game.features.map((f) => (
            <span key={f} className="badge badge-gray" style={{ fontSize: '11.5px' }}>{f}</span>
          ))}
        </div>

        <div style={{ display: 'flex', gap: '10px', marginTop: 'auto', flexWrap: 'wrap' }}>
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            Play Now
          </a>
          <a
            href={game.source}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
            style={{ fontSize: '13px', padding: '8px 16px' }}
          >
            View Source ↗
          </a>
        </div>
      </div>
    </div>
  )
}
