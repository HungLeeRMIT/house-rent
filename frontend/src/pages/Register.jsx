import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { authAPI } from '../services/api'
import './Auth.css'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
    role: 'TENANT',
  })
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: '',
      })
    }
    // Clear general error
    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    setLoading(true)

    try {
      await authAPI.register(formData)
      navigate('/login', { state: { message: 'Registration successful! Please login.' } })
    } catch (err) {
      const errorData = err.response?.data
      
      // Handle validation errors with field-specific messages
      if (errorData?.errors) {
        setFieldErrors(errorData.errors)
        setError(errorData.message || 'Please fix the errors below')
      } else {
        // Handle other errors (like username/email already taken)
        setError(errorData?.message || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join RentMate today</p>

          {error && (
            <div className="alert alert-error">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className={`form-input ${fieldErrors.firstName ? 'input-error' : ''}`}
                  value={formData.firstName}
                  onChange={handleChange}
                />
                {fieldErrors.firstName && (
                  <span className="field-error">{fieldErrors.firstName}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className={`form-input ${fieldErrors.lastName ? 'input-error' : ''}`}
                  value={formData.lastName}
                  onChange={handleChange}
                />
                {fieldErrors.lastName && (
                  <span className="field-error">{fieldErrors.lastName}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Username *</label>
              <input
                type="text"
                name="username"
                className={`form-input ${fieldErrors.username ? 'input-error' : ''}`}
                value={formData.username}
                onChange={handleChange}
                required
              />
              {fieldErrors.username && (
                <span className="field-error">{fieldErrors.username}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="email"
                className={`form-input ${fieldErrors.email ? 'input-error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                required
              />
              {fieldErrors.email && (
                <span className="field-error">{fieldErrors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phoneNumber"
                className={`form-input ${fieldErrors.phoneNumber ? 'input-error' : ''}`}
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              {fieldErrors.phoneNumber && (
                <span className="field-error">{fieldErrors.phoneNumber}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Password *</label>
              <input
                type="password"
                name="password"
                className={`form-input ${fieldErrors.password ? 'input-error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                required
              />
              {fieldErrors.password && (
                <span className="field-error">{fieldErrors.password}</span>
              )}
              {!fieldErrors.password && (
                <div className="password-hint">
                  Password must be at least 12 characters and include uppercase, lowercase, number, and special character
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">I am a *</label>
              <select
                name="role"
                className={`form-select ${fieldErrors.role ? 'input-error' : ''}`}
                value={formData.role}
                onChange={handleChange}
                required
              >
                <option value="TENANT">Tenant</option>
                <option value="LANDLORD">Landlord</option>
                <option value="PROPERTY_MANAGER">Property Manager</option>
              </select>
              {fieldErrors.role && (
                <span className="field-error">{fieldErrors.role}</span>
              )}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-block"
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="auth-footer">
            Already have an account? <Link to="/login" className="auth-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
