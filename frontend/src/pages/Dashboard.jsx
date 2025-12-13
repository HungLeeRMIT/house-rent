import { useAuthStore } from '../store/authStore'
import './Dashboard.css'

function Dashboard() {
  const { user } = useAuthStore()

  return (
    <div className="dashboard-page">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome, {user.username}!</h1>
          <p className="dashboard-role">Role: {user.role}</p>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">🏠</div>
            <h3>My Properties</h3>
            <p className="card-value">0</p>
            <p className="card-description">
              {user.role === 'TENANT' ? 'Properties I\'m renting' : 'Properties I manage'}
            </p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📋</div>
            <h3>Active Leases</h3>
            <p className="card-value">0</p>
            <p className="card-description">Current lease agreements</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💰</div>
            <h3>Payments</h3>
            <p className="card-value">$0</p>
            <p className="card-description">
              {user.role === 'TENANT' ? 'Total paid this month' : 'Total received this month'}
            </p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔧</div>
            <h3>Maintenance Requests</h3>
            <p className="card-value">0</p>
            <p className="card-description">Pending requests</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">💬</div>
            <h3>Messages</h3>
            <p className="card-value">0</p>
            <p className="card-description">Unread messages</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📄</div>
            <h3>Documents</h3>
            <p className="card-value">0</p>
            <p className="card-description">Stored documents</p>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="quick-actions">
            {user.role !== 'TENANT' && (
              <button className="btn btn-primary">➕ Add Property</button>
            )}
            <button className="btn btn-outline">💬 Send Message</button>
            <button className="btn btn-outline">📄 Upload Document</button>
            {user.role === 'TENANT' && (
              <button className="btn btn-outline">🔧 Submit Maintenance Request</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

