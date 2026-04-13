import { Link } from 'react-router-dom'

const GH = 'https://github.com/AMP-Media-Development/ping-games'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">
              <div className="logo-mark">🎮</div>
              Ping Games
            </div>
            <p className="footer-desc">
              Open-source multiplayer game platform for the Ping chat ecosystem.
              Built by the community, for the community.
            </p>
          </div>

          <div>
            <div className="footer-col-title">Platform</div>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/marketplace">Marketplace</Link></li>
              <li><Link to="/docs">Documentation</Link></li>
              <li><Link to="/support">Support</Link></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Developers</div>
            <ul className="footer-links">
              <li><a href={GH} target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href={`${GH}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer">Contributing</a></li>
              <li><a href={`${GH}/issues`} target="_blank" rel="noopener noreferrer">Issues</a></li>
              <li><a href={`${GH}/blob/main/FLOW.md`} target="_blank" rel="noopener noreferrer">Onboarding Guide</a></li>
            </ul>
          </div>

          <div>
            <div className="footer-col-title">Resources</div>
            <ul className="footer-links">
              <li><a href="https://ping.live" target="_blank" rel="noopener noreferrer">Ping App</a></li>
              <li><a href="https://AMP-Media-Development.github.io/ping-games/pong/" target="_blank" rel="noopener noreferrer">Play Pong</a></li>
              <li><a href="https://AMP-Media-Development.github.io/ping-games/coinflip/" target="_blank" rel="noopener noreferrer">Play Coin Flip</a></li>
              <li><a href={`${GH}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer">MIT License</a></li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} AMP Media Development. Released under the MIT License.</span>
          <span>Built for the Ping community</span>
        </div>
      </div>
    </footer>
  )
}
