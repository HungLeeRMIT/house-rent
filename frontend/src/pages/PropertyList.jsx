import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import './PropertyList.css'

function PropertyList() {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    minPrice: '',
    maxPrice: '',
    propertyType: '',
    bedrooms: '',
    availableFrom: '',
  })

  // Debounce function to delay search
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  const performSearch = useCallback(async () => {
    setLoading(true)
    try {
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(([_, value]) => value !== '')
      )
      
      // If no filters, use getAvailable instead of search
      if (Object.keys(cleanFilters).length === 0) {
        const response = await propertyAPI.getAvailable()
        setProperties(response.data)
        return
      }
      
      // Convert availableFrom to ISO format if present
      if (cleanFilters.availableFrom) {
        cleanFilters.availableFrom = cleanFilters.availableFrom
      }
      
      const response = await propertyAPI.search(cleanFilters)
      setProperties(response.data)
    } catch (error) {
      console.error('Error searching properties:', error)
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [filters])

  // Track if initial load is complete
  const initialLoadComplete = useRef(false)

  // Initial load
  useEffect(() => {
    fetchProperties().then(() => {
      initialLoadComplete.current = true
    })
  }, [])

  // Auto-search when filters change (with debounce) - but not on initial mount
  useEffect(() => {
    // Skip auto-search until initial load is complete
    if (!initialLoadComplete.current) {
      return
    }
    
    const debouncedSearch = debounce(performSearch, 500)
    debouncedSearch()
  }, [filters, performSearch])

  const fetchProperties = async () => {
    setLoading(true)
    try {
      const response = await propertyAPI.getAvailable()
      setProperties(response.data)
      return Promise.resolve()
    } catch (error) {
      console.error('Error fetching properties:', error)
      setProperties([])
      return Promise.resolve()
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters({
      ...filters,
      [name]: value,
    })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    performSearch()
  }

  const clearFilters = () => {
    setFilters({
      city: '',
      state: '',
      minPrice: '',
      maxPrice: '',
      propertyType: '',
      bedrooms: '',
      availableFrom: '',
    })
    // fetchProperties will be called by useEffect
  }

  return (
    <div className="property-list-page">
      <div className="container">
        <h1 className="page-title">Available Properties</h1>

        <div className="search-section">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-filters">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="form-input"
                value={filters.city}
                onChange={handleFilterChange}
              />
              <input
                type="text"
                name="state"
                placeholder="State"
                className="form-input"
                value={filters.state}
                onChange={handleFilterChange}
              />
              <input
                type="number"
                name="minPrice"
                placeholder="Min Price ($)"
                className="form-input"
                value={filters.minPrice}
                onChange={handleFilterChange}
                min="0"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="Max Price ($)"
                className="form-input"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                min="0"
              />
              <select
                name="propertyType"
                className="form-select"
                value={filters.propertyType}
                onChange={handleFilterChange}
              >
                <option value="">All Property Types</option>
                <option value="APARTMENT">Apartment</option>
                <option value="HOUSE">House</option>
                <option value="CONDO">Condo</option>
                <option value="TOWNHOUSE">Townhouse</option>
                <option value="STUDIO">Studio</option>
                <option value="OTHER">Other</option>
              </select>
              <input
                type="number"
                name="bedrooms"
                placeholder="Min Bedrooms"
                className="form-input"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                min="0"
              />
              <input
                type="date"
                name="availableFrom"
                placeholder="Available From"
                className="form-input"
                value={filters.availableFrom}
                onChange={handleFilterChange}
                title="Show properties available on or before this date"
              />
            </div>
            <div className="search-actions">
              <button type="submit" className="btn btn-primary">
                Search
              </button>
              <button type="button" onClick={clearFilters} className="btn btn-secondary">
                Clear Filters
              </button>
            </div>
          </form>
        </div>

        {loading ? (
          <div className="loading">
            <div className="loading-spinner"></div>
            <p>Loading properties...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🏠</div>
            <h2>No Properties Found</h2>
            <p>We couldn't find any properties matching your search criteria.</p>
            <p className="empty-state-suggestion">Try adjusting your filters or clearing them to see all available properties.</p>
            <button onClick={clearFilters} className="btn btn-primary">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="results-count">
              Found {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </div>
            <div className="properties-grid">
              {properties.map((property) => (
                <Link to={`/properties/${property.id}`} key={property.id} className="property-card">
                  <div className="property-image" style={{
                    backgroundImage: property.mainImageUrl 
                      ? `url(${property.mainImageUrl})` 
                      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}>
                    {!property.mainImageUrl && (
                      <div style={{ fontSize: '48px' }}>🏠</div>
                    )}
                    <div className="property-type-badge">{property.propertyType}</div>
                    {property.availableFrom && (
                      <div className="availability-badge">
                        Available: {new Date(property.availableFrom).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  <div className="property-content">
                    <h3 className="property-title">{property.title}</h3>
                    <p className="property-location">
                      📍 {property.city}, {property.state}
                    </p>
                    <p className="property-details">
                      🛏️ {property.bedrooms || 'N/A'} beds • 🚿 {property.bathrooms || 'N/A'} baths
                      {property.squareFeet && ` • 📐 ${property.squareFeet} sqft`}
                    </p>
                    <div className="property-footer">
                      <span className="property-price">${property.price?.toLocaleString()}/month</span>
                      <span className="property-status">Available</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default PropertyList
