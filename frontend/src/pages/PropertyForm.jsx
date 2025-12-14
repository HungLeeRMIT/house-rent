import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Save, Loader2, AlertCircle, XCircle, Home as HomeIcon, MapPin, DollarSign, Image as ImageIcon } from 'lucide-react'

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

  const handlePropertyTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      propertyType: value
    }))
    if (errors.propertyType) {
      setErrors(prev => ({
        ...prev,
        propertyType: ''
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading property...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/properties')} 
            className="mb-4 gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Properties
          </Button>
          <h1 className="text-4xl font-bold mb-2">
            {isEdit ? 'Edit Property' : 'Create New Property'}
          </h1>
          <p className="text-muted-foreground">
            {isEdit ? 'Update your property details' : 'List a new property for rent'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HomeIcon className="h-5 w-5" />
                Basic Information
              </CardTitle>
              <CardDescription>Provide essential details about your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Property Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Cozy 2BR Apartment in Downtown"
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.title}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe your property, its features, and what makes it special..."
                />
                <p className="text-xs text-muted-foreground">Optional: Help tenants understand what makes your property unique</p>
              </div>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location
              </CardTitle>
              <CardDescription>Where is the property located?</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">
                  Street Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="123 Main Street"
                  className={errors.address ? 'border-destructive' : ''}
                />
                {errors.address && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.address}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">
                    City <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Boston"
                    className={errors.city ? 'border-destructive' : ''}
                  />
                  {errors.city && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">
                    State <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="MA"
                    className={errors.state ? 'border-destructive' : ''}
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="02101"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Property Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Property Details
              </CardTitle>
              <CardDescription>Specify pricing and property characteristics</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">
                    Monthly Rent ($) <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="2000"
                    min="0"
                    step="0.01"
                    className={errors.price ? 'border-destructive' : ''}
                  />
                  {errors.price && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.price}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="propertyType">
                    Property Type <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.propertyType} 
                    onValueChange={handlePropertyTypeChange}
                  >
                    <SelectTrigger className={errors.propertyType ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="HOUSE">House</SelectItem>
                      <SelectItem value="CONDO">Condo</SelectItem>
                      <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                      <SelectItem value="STUDIO">Studio</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.propertyType && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.propertyType}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="availableFrom">
                    Available From <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="availableFrom"
                    name="availableFrom"
                    type="date"
                    value={formData.availableFrom}
                    onChange={handleChange}
                    className={errors.availableFrom ? 'border-destructive' : ''}
                  />
                  {errors.availableFrom && (
                    <p className="text-sm text-destructive flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {errors.availableFrom}
                    </p>
                  )}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    placeholder="2"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    placeholder="1"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="squareFeet">Square Feet</Label>
                  <Input
                    id="squareFeet"
                    name="squareFeet"
                    type="number"
                    value={formData.squareFeet}
                    onChange={handleChange}
                    placeholder="1200"
                    min="0"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Property Images
              </CardTitle>
              <CardDescription>Add photos to showcase your property</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Enter direct image URLs. Make sure the images are publicly accessible.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="mainImageUrl">Main Image URL</Label>
                <Input
                  id="mainImageUrl"
                  name="mainImageUrl"
                  type="url"
                  value={formData.mainImageUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className={errors.mainImageUrl ? 'border-destructive' : ''}
                />
                {errors.mainImageUrl ? (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.mainImageUrl}
                  </p>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    This will be the featured image for your property
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrls">Additional Image URLs</Label>
                <Textarea
                  id="imageUrls"
                  name="imageUrls"
                  value={formData.imageUrls}
                  onChange={handleChange}
                  rows={3}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
                <p className="text-xs text-muted-foreground">
                  Enter comma-separated URLs for additional images
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 justify-between">
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/properties')}
              >
                Cancel
              </Button>
              {isEdit && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={handleUnlist}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  Unlist Property
                </Button>
              )}
            </div>
            <Button 
              type="submit" 
              disabled={submitting}
              className="gap-2"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  {isEdit ? 'Update Property' : 'Create Property'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyForm

