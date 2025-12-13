import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import './PropertyDetails.css'

function PropertyDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [contacting, setContacting] = useState(false)
  const [unlisting, setUnlisting] = useState(false)

  useEffect(() => {
    fetchProperty()
  }, [id])

  const fetchProperty = async () => {
    try {
      const response = await propertyAPI.getById(id)
      setProperty(response.data)
    } catch (error) {
      console.error('Error fetching property:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleContactLandlord = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/properties/${id}` } })
      return
    }
    
    setContacting(true)
    // Navigate to messaging with landlord
    // For now, show contact info or navigate to messages
    if (property.landlordId) {
      navigate(`/messages?to=${property.landlordId}&property=${id}`)
    } else {
      setTimeout(() => {
        setContacting(false)
        alert('Contact feature coming soon! This will open a messaging interface.')
      }, 500)
    }
  }

  const handleScheduleViewing = () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/properties/${id}` } })
      return
    }
    
    alert('Schedule viewing feature coming soon!')
  }

  const handleUnlist = async () => {
    if (!user) {
      navigate('/login', { state: { returnTo: `/properties/${id}` } })
      return
    }

    if (!window.confirm('Are you sure you want to unlist this property? It will be hidden from search results.')) {
      return
    }

    setUnlisting(true)
    try {
      await propertyAPI.unlist(id)
      alert('Property unlisted successfully!')
      navigate('/properties')
    } catch (error) {
      console.error('Error unlisting property:', error)
      if (error.response?.status === 403) {
        alert('You do not have permission to unlist this property.')
      } else {
        alert('Error unlisting property. Please try again.')
      }
    } finally {
      setUnlisting(false)
    }
  }

  if (loading) {
    return (
      <div className="property-details-page">
        <div className="container">
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading property details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="property-details-page">
        <div className="container">
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h2>Property Not Found</h2>
            <p>The property you're looking for doesn't exist or has been removed.</p>
            <button onClick={() => navigate('/properties')} className="btn btn-primary">
              Browse Properties
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="property-details-page">
      <div className="container">
        <button onClick={() => navigate(-1)} className="btn btn-secondary back-btn">
          ← Back to Search
        </button>

        <div className="property-details-card">
          <div className="property-header">
            <div className="property-image-gallery">
              <div 
                className="property-main-image"
                style={{
                  backgroundImage: property.mainImageUrl 
                    ? `url(${property.mainImageUrl})` 
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!property.mainImageUrl && (
                  <div style={{ fontSize: '96px' }}>🏠</div>
                )}
                <div className="property-type-badge-large">{property.propertyType}</div>
                {property.availableFrom && (
                  <div className="availability-badge-large">
                    Available: {new Date(property.availableFrom).toLocaleDateString()}
                  </div>
                )}
              </div>
              {/* Additional images */}
              {property.imageUrls && property.imageUrls.trim() && (
                <div className="property-image-thumbnails">
                  {property.imageUrls.split(',').filter(url => url.trim()).slice(0, 3).map((url, index) => (
                    <div 
                      key={index}
                      className="image-thumbnail"
                      style={{
                        backgroundImage: `url(${url.trim()})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onClick={() => {
                        // Could implement image gallery modal here
                        window.open(url.trim(), '_blank')
                      }}
                      title="Click to view full size"
                    />
                  ))}
                </div>
              )}
              {(!property.imageUrls || !property.imageUrls.trim()) && (
                <div className="property-image-thumbnails">
                  <div className="image-thumbnail"></div>
                  <div className="image-thumbnail"></div>
                  <div className="image-thumbnail"></div>
                </div>
              )}
            </div>
          </div>

          <div className="property-info">
            <div className="property-main-info">
              <h1 className="property-title-large">{property.title}</h1>
              <p className="property-location-large">
                📍 {property.address}, {property.city}, {property.state} {property.zipCode}
              </p>
              <div className="property-price-large">${property.price?.toLocaleString()}/month</div>
            </div>

            <div className="property-features">
              <div className="feature-item">
                <span className="feature-icon">🛏️</span>
                <div>
                  <div className="feature-value">{property.bedrooms || 'N/A'}</div>
                  <div className="feature-label">Bedrooms</div>
                </div>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🚿</span>
                <div>
                  <div className="feature-value">{property.bathrooms || 'N/A'}</div>
                  <div className="feature-label">Bathrooms</div>
                </div>
              </div>
              {property.squareFeet && (
                <div className="feature-item">
                  <span className="feature-icon">📐</span>
                  <div>
                    <div className="feature-value">{property.squareFeet.toLocaleString()}</div>
                    <div className="feature-label">Sq Ft</div>
                  </div>
                </div>
              )}
              <div className="feature-item">
                <span className="feature-icon">🏠</span>
                <div>
                  <div className="feature-value">{property.propertyType}</div>
                  <div className="feature-label">Type</div>
                </div>
              </div>
            </div>

            {property.description && (
              <div className="property-description">
                <h2>Description</h2>
                <p>{property.description}</p>
              </div>
            )}

            {property.landlordName && (
              <div className="landlord-info">
                <h3>Property Owner</h3>
                <p><strong>Name:</strong> {property.landlordName}</p>
                {property.landlordEmail && (
                  <p><strong>Email:</strong> {property.landlordEmail}</p>
                )}
                {property.landlordPhone && (
                  <p><strong>Phone:</strong> {property.landlordPhone}</p>
                )}
              </div>
            )}

            <div className="property-actions">
              {user && user.role === 'LANDLORD' && property.landlordId === user.id ? (
                <>
                  <button 
                    className="btn btn-primary btn-lg"
                    onClick={() => navigate(`/properties/${id}/edit`)}
                  >
                    ✏️ Edit Property
                  </button>
                  <button 
                    className="btn btn-outline btn-lg"
                    onClick={handleUnlist}
                    disabled={unlisting}
                  >
                    {unlisting ? 'Unlisting...' : '🚫 Unlist Property'}
                  </button>
                </>
              ) : (
                <>
                  <button 
                    className="btn btn-primary btn-lg" 
                    onClick={handleContactLandlord}
                    disabled={contacting}
                  >
                    {contacting ? 'Opening...' : '💬 Message Landlord'}
                  </button>
                  <button 
                    className="btn btn-outline btn-lg"
                    onClick={handleScheduleViewing}
                  >
                    📅 Schedule Viewing
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
