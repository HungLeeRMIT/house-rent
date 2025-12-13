import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import './PropertyForm.css'

function PropertyForm() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const isEdit = !!id

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    propertyType: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    availableFrom: '',
    mainImageUrl: '',
    imageUrls: '',
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!user) {
      navigate('/login', { state: { returnTo: isEdit ? `/properties/${id}/edit` : '/properties/new' } })
      return
    }

    if (isEdit) {
      fetchProperty()
    }
  }, [id, user, navigate, isEdit])

  const fetchProperty = async () => {
    setLoading(true)
    try {
      const response = await propertyAPI.getById(id)
      const property = response.data
      setFormData({
        title: property.title || '',
        description: property.description || '',
        address: property.address || '',
        city: property.city || '',
        state: property.state || '',
        zipCode: property.zipCode || '',
        price: property.price?.toString() || '',
        propertyType: property.propertyType || '',
        bedrooms: property.bedrooms?.toString() || '',
        bathrooms: property.bathrooms?.toString() || '',
        squareFeet: property.squareFeet?.toString() || '',
        availableFrom: property.availableFrom || '',
        mainImageUrl: property.mainImageUrl || '',
        imageUrls: property.imageUrls || '',
      })
    } catch (error) {
      console.error('Error fetching property:', error)
      if (error.response?.status === 403) {
        alert('You do not have permission to edit this property.')
        navigate('/properties')
      } else {
        alert('Error loading property. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  const validate = () => {
    const newErrors = {}

    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required'
    if (!formData.address.trim()) newErrors.address = 'Address is required'
    if (!formData.city.trim()) newErrors.city = 'City is required'
    if (!formData.state.trim()) newErrors.state = 'State is required'
    if (!formData.price) {
      newErrors.price = 'Price is required'
    } else if (parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be positive' // TC7 - Client-side validation
    }
    if (!formData.propertyType) newErrors.propertyType = 'Property type is required'
    if (!formData.availableFrom) newErrors.availableFrom = 'Availability date is required'

    // Image URL validation (basic)
    if (formData.mainImageUrl && !isValidUrl(formData.mainImageUrl)) {
      newErrors.mainImageUrl = 'Please enter a valid URL'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setSubmitting(true)
    try {
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state.trim(),
        zipCode: formData.zipCode.trim(),
        price: parseFloat(formData.price),
        propertyType: formData.propertyType,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        squareFeet: formData.squareFeet ? parseInt(formData.squareFeet) : null,
        availableFrom: formData.availableFrom,
        mainImageUrl: formData.mainImageUrl.trim() || null,
        imageUrls: formData.imageUrls.trim() || null,
      }

      if (isEdit) {
        await propertyAPI.update(id, submitData)
        alert('Property updated successfully!')
      } else {
        await propertyAPI.create(submitData)
        alert('Property created successfully!')
      }
      
      navigate('/properties')
    } catch (error) {
      console.error('Error saving property:', error)
      if (error.response?.status === 403) {
        alert('You do not have permission to perform this action.')
      } else if (error.response?.status === 400) {
        const errorData = error.response.data
        if (errorData.errors) {
          setErrors(errorData.errors)
          alert('Please fix the validation errors and try again.')
        } else {
          alert(errorData.message || 'Validation failed. Please check your input.')
        }
      } else {
        alert('Error saving property. Please try again.')
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleUnlist = async () => {
    if (!window.confirm('Are you sure you want to unlist this property? It will be hidden from search results.')) {
      return
    }

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
    }
  }

  if (loading) {
    return (
      <div className="property-form-page">
        <div className="container">
          <div className="loading">Loading property...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="property-form-page">
      <div className="container">
        <h1 className="page-title">{isEdit ? 'Edit Property' : 'Create New Property'}</h1>

        <form onSubmit={handleSubmit} className="property-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            
            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={errors.title ? 'error' : ''}
                placeholder="e.g., Cozy 2BR Apartment in Downtown"
              />
              {errors.title && <span className="error-message">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
                placeholder="Describe your property..."
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className={errors.address ? 'error' : ''}
                placeholder="123 Main Street"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className={errors.city ? 'error' : ''}
                  placeholder="Boston"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State *</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className={errors.state ? 'error' : ''}
                  placeholder="MA"
                />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">Zip Code</label>
                <input
                  type="text"
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="02101"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Property Details</h2>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Monthly Rent ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className={errors.price ? 'error' : ''}
                  placeholder="2000"
                  min="0"
                  step="0.01"
                />
                {errors.price && <span className="error-message">{errors.price}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="propertyType">Property Type *</label>
                <select
                  id="propertyType"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  className={errors.propertyType ? 'error' : ''}
                >
                  <option value="">Select type</option>
                  <option value="APARTMENT">Apartment</option>
                  <option value="HOUSE">House</option>
                  <option value="CONDO">Condo</option>
                  <option value="TOWNHOUSE">Townhouse</option>
                  <option value="STUDIO">Studio</option>
                  <option value="OTHER">Other</option>
                </select>
                {errors.propertyType && <span className="error-message">{errors.propertyType}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="availableFrom">Available From *</label>
                <input
                  type="date"
                  id="availableFrom"
                  name="availableFrom"
                  value={formData.availableFrom}
                  onChange={handleChange}
                  className={errors.availableFrom ? 'error' : ''}
                />
                {errors.availableFrom && <span className="error-message">{errors.availableFrom}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="bedrooms">Bedrooms</label>
                <input
                  type="number"
                  id="bedrooms"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  placeholder="2"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="bathrooms">Bathrooms</label>
                <input
                  type="number"
                  id="bathrooms"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  placeholder="1"
                  min="0"
                  step="0.5"
                />
              </div>

              <div className="form-group">
                <label htmlFor="squareFeet">Square Feet</label>
                <input
                  type="number"
                  id="squareFeet"
                  name="squareFeet"
                  value={formData.squareFeet}
                  onChange={handleChange}
                  placeholder="1200"
                  min="0"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Images</h2>

            <div className="form-group">
              <label htmlFor="mainImageUrl">Main Image URL</label>
              <input
                type="url"
                id="mainImageUrl"
                name="mainImageUrl"
                value={formData.mainImageUrl}
                onChange={handleChange}
                className={errors.mainImageUrl ? 'error' : ''}
                placeholder="https://example.com/image.jpg"
              />
              {errors.mainImageUrl && <span className="error-message">{errors.mainImageUrl}</span>}
              <small className="form-hint">Enter a URL to an image</small>
            </div>

            <div className="form-group">
              <label htmlFor="imageUrls">Additional Image URLs</label>
              <textarea
                id="imageUrls"
                name="imageUrls"
                value={formData.imageUrls}
                onChange={handleChange}
                rows="3"
                placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
              />
              <small className="form-hint">Enter comma-separated URLs for additional images</small>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate('/properties')} className="btn btn-secondary">
              Cancel
            </button>
            {isEdit && (
              <button type="button" onClick={handleUnlist} className="btn btn-warning">
                Unlist Property
              </button>
            )}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (isEdit ? 'Update Property' : 'Create Property')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm

