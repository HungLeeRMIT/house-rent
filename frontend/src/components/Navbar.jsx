import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">🏠</span>
          RentMate
        </Link>
        
        <div className="navbar-menu">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/properties" className="nav-link">Properties</Link>
          
          {user ? (
            <>
              {user.role === 'LANDLORD' && (
                <Link to="/properties/new" className="nav-link">
                  <button className="btn btn-primary btn-sm">+ Create Property</button>
                </Link>
              )}
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <span className="user-name">{user.username}</span>
                <button onClick={handleLogout} className="btn btn-outline btn-sm">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register">
                <button className="btn btn-primary btn-sm">Sign Up</button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

