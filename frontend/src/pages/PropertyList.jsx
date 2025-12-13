import { useState, useEffect, useCallback, useRef } from 'react'
import { Link } from 'react-router-dom'
import { propertyAPI } from '../services/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Search, X, MapPin, Bed, Bath, Square, Calendar, Home as HomeIcon, Loader2 } from 'lucide-react'

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

  const handlePropertyTypeChange = (value) => {
    setFilters({
      ...filters,
      propertyType: value === 'all' ? '' : value,
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

  const hasActiveFilters = Object.values(filters).some(value => value !== '')

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Available Properties</h1>
          <p className="text-muted-foreground">Find your perfect rental home</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
            </CardTitle>
            <CardDescription>Narrow down your search to find the perfect property</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Location Filters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    placeholder="e.g., Boston"
                    value={filters.city}
                    onChange={handleFilterChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    placeholder="e.g., MA"
                    value={filters.state}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Price Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="minPrice">Min Price ($/month)</Label>
                  <Input
                    id="minPrice"
                    name="minPrice"
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxPrice">Max Price ($/month)</Label>
                  <Input
                    id="maxPrice"
                    name="maxPrice"
                    type="number"
                    placeholder="No limit"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
              </div>

              {/* Property Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="propertyType">Property Type</Label>
                  <Select value={filters.propertyType || 'all'} onValueChange={handlePropertyTypeChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="APARTMENT">Apartment</SelectItem>
                      <SelectItem value="HOUSE">House</SelectItem>
                      <SelectItem value="CONDO">Condo</SelectItem>
                      <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                      <SelectItem value="STUDIO">Studio</SelectItem>
                      <SelectItem value="OTHER">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Min Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    placeholder="Any"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    min="0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="availableFrom">Available From</Label>
                  <Input
                    id="availableFrom"
                    name="availableFrom"
                    type="date"
                    value={filters.availableFrom}
                    onChange={handleFilterChange}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <Button type="submit" className="gap-2">
                  <Search className="h-4 w-4" />
                  Search Properties
                </Button>
                {hasActiveFilters && (
                  <Button type="button" variant="outline" onClick={clearFilters} className="gap-2">
                    <X className="h-4 w-4" />
                    Clear Filters
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Results */}
        {loading ? (
          <div className="space-y-6">
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">Loading properties...</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-4 space-y-3">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-8 w-1/3" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : properties.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HomeIcon className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-2xl font-semibold mb-2">No Properties Found</h2>
              <p className="text-muted-foreground mb-6 text-center max-w-md">
                We couldn't find any properties matching your search criteria. Try adjusting your filters.
              </p>
              {hasActiveFilters && (
                <Button onClick={clearFilters} variant="outline">
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                Found <span className="font-semibold text-foreground">{properties.length}</span>{' '}
                {properties.length === 1 ? 'property' : 'properties'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Link key={property.id} to={`/properties/${property.id}`}>
                  <Card className="h-full hover:shadow-lg transition-shadow duration-200 overflow-hidden group">
                    {/* Property Image */}
                    <div 
                      className="h-48 bg-gradient-to-br from-primary/10 to-primary/5 relative overflow-hidden"
                      style={{
                        backgroundImage: property.mainImageUrl ? `url(${property.mainImageUrl})` : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!property.mainImageUrl && (
                        <div className="flex items-center justify-center h-full">
                          <HomeIcon className="h-16 w-16 text-muted-foreground" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <Badge variant="secondary" className="backdrop-blur-sm bg-background/80">
                          {property.propertyType}
                        </Badge>
                      </div>
                      {property.availableFrom && (
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="backdrop-blur-sm bg-background/80 gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(property.availableFrom).toLocaleDateString()}
                          </Badge>
                        </div>
                      )}
                    </div>

                    {/* Property Info */}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {property.title}
                      </h3>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                        <span className="line-clamp-1">{property.city}, {property.state}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Bed className="h-4 w-4" />
                          <span>{property.bedrooms || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Bath className="h-4 w-4" />
                          <span>{property.bathrooms || 'N/A'}</span>
                        </div>
                        {property.squareFeet && (
                          <div className="flex items-center gap-1">
                            <Square className="h-4 w-4" />
                            <span>{property.squareFeet.toLocaleString()}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t">
                        <div>
                          <p className="text-2xl font-bold text-primary">
                            ${property.price?.toLocaleString()}
                          </p>
                          <p className="text-xs text-muted-foreground">per month</p>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          Available
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
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
