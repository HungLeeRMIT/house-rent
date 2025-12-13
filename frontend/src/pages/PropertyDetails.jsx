import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import { useAuthStore } from '../store/authStore'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  ArrowLeft, MapPin, Bed, Bath, Square, Calendar, Home as HomeIcon, 
  Loader2, MessageCircle, Eye, Edit, XCircle, User, Mail, Phone 
} from 'lucide-react'

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading property details...</p>
        </div>
      </div>
    )
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="flex flex-col items-center py-12">
            <HomeIcon className="h-20 w-20 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Property Not Found</h2>
            <p className="text-muted-foreground text-center mb-6">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/properties')}>
              Browse Properties
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const isOwner = user && user.role === 'LANDLORD' && property.landlordId === user.id

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)} 
          className="mb-6 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Search
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <Card className="overflow-hidden">
              <div 
                className="h-96 bg-gradient-to-br from-primary/10 to-primary/5 relative"
                style={{
                  backgroundImage: property.mainImageUrl ? `url(${property.mainImageUrl})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!property.mainImageUrl && (
                  <div className="flex items-center justify-center h-full">
                    <HomeIcon className="h-32 w-32 text-muted-foreground" />
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge className="text-base px-4 py-2">
                    {property.propertyType}
                  </Badge>
                </div>
                {property.availableFrom && (
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="text-sm px-3 py-2 gap-2 bg-background/90 backdrop-blur">
                      <Calendar className="h-4 w-4" />
                      Available: {new Date(property.availableFrom).toLocaleDateString()}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Thumbnails */}
              {property.imageUrls && property.imageUrls.trim() && (
                <div className="p-4 grid grid-cols-3 gap-3">
                  {property.imageUrls.split(',').filter(url => url.trim()).slice(0, 3).map((url, index) => (
                    <div
                      key={index}
                      className="h-24 rounded-lg cursor-pointer hover:opacity-80 transition-opacity overflow-hidden"
                      style={{
                        backgroundImage: `url(${url.trim()})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                      onClick={() => window.open(url.trim(), '_blank')}
                      title="Click to view full size"
                    />
                  ))}
                </div>
              )}
            </Card>

            {/* Property Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <CardTitle className="text-3xl">{property.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{property.address}, {property.city}, {property.state} {property.zipCode}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-primary">
                      ${property.price?.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">per month</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Features */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Bed className="h-6 w-6 mb-2 text-primary" />
                    <p className="text-2xl font-semibold">{property.bedrooms || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Bedrooms</p>
                  </div>
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <Bath className="h-6 w-6 mb-2 text-primary" />
                    <p className="text-2xl font-semibold">{property.bathrooms || 'N/A'}</p>
                    <p className="text-sm text-muted-foreground">Bathrooms</p>
                  </div>
                  {property.squareFeet && (
                    <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                      <Square className="h-6 w-6 mb-2 text-primary" />
                      <p className="text-2xl font-semibold">{property.squareFeet.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Sq Ft</p>
                    </div>
                  )}
                  <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                    <HomeIcon className="h-6 w-6 mb-2 text-primary" />
                    <p className="text-xl font-semibold">{property.propertyType}</p>
                    <p className="text-sm text-muted-foreground">Type</p>
                  </div>
                </div>

                {/* Description */}
                {property.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Landlord Info */}
            {property.landlordName && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Property Owner</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{property.landlordName}</p>
                      <p className="text-sm text-muted-foreground">Landlord</p>
                    </div>
                  </div>
                  {property.landlordEmail && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{property.landlordEmail}</span>
                    </div>
                  )}
                  {property.landlordPhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{property.landlordPhone}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Actions</CardTitle>
                <CardDescription>
                  {isOwner ? 'Manage this property' : 'Get in touch with the landlord'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {isOwner ? (
                  <>
                    <Button 
                      className="w-full gap-2" 
                      onClick={() => navigate(`/properties/${id}/edit`)}
                    >
                      <Edit className="h-4 w-4" />
                      Edit Property
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={handleUnlist}
                      disabled={unlisting}
                    >
                      {unlisting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Unlisting...
                        </>
                      ) : (
                        <>
                          <XCircle className="h-4 w-4" />
                          Unlist Property
                        </>
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="w-full gap-2"
                      onClick={handleContactLandlord}
                      disabled={contacting}
                    >
                      {contacting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Opening...
                        </>
                      ) : (
                        <>
                          <MessageCircle className="h-4 w-4" />
                          Message Landlord
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full gap-2"
                      onClick={handleScheduleViewing}
                    >
                      <Eye className="h-4 w-4" />
                      Schedule Viewing
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="outline" className="text-green-600 border-green-600">
                    Available
                  </Badge>
                </div>
                {property.availableFrom && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Available From</span>
                    <span className="font-medium">
                      {new Date(property.availableFrom).toLocaleDateString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Property Type</span>
                  <span className="font-medium">{property.propertyType}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails
