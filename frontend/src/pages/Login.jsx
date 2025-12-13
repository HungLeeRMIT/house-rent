import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import './Auth.css'

function Login() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await authAPI.login(formData)
      const { token, id, username, email, role } = response.data
      
      setAuth({ id, username, email, role }, token)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to your RentMate account</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Username</label>
              <input
                type="text"
                name="username"
                className="form-input"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="auth-footer">
            Don't have an account? <Link to="/register" className="auth-link">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

