import { Link } from 'react-router-dom'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Perfect Rental Home
            </h1>
            <p className="hero-subtitle">
              RentMate connects landlords and tenants in one seamless platform. 
              Search properties, manage leases, and track payments with ease.
            </p>
            <div className="hero-actions">
              <Link to="/properties">
                <button className="btn btn-primary btn-lg">Browse Properties</button>
              </Link>
              <Link to="/register">
                <button className="btn btn-outline btn-lg">Get Started</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">Why Choose RentMate?</h2>
          
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🔍</div>
              <h3>Property Search</h3>
              <p>Browse and filter properties by location, price, and type to find your ideal rental.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Secure Messaging</h3>
              <p>Communicate directly with landlords and tenants through our secure in-app messaging.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💰</div>
              <h3>Payment Tracking</h3>
              <p>Record and track rent payments with automated reminders and transaction history.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🔧</div>
              <h3>Maintenance Requests</h3>
              <p>Submit and manage repair requests with photos and track their status in real-time.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📄</div>
              <h3>Document Management</h3>
              <p>Store and access all your rental documents including leases and invoices securely.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Dashboard Analytics</h3>
              <p>View all your rental information and activities in one intuitive dashboard.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of landlords and tenants using RentMate</p>
            <Link to="/register">
              <button className="btn btn-primary btn-lg">Create Free Account</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

