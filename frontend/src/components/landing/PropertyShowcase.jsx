import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MapPin, Bed, Bath, Maximize, Search, SlidersHorizontal, X, Calendar, Home, Building, Building2, Warehouse } from 'lucide-react';

const PropertyShowcase = () => {
  const [priceRange, setPriceRange] = useState([500, 5000]);
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedBeds, setSelectedBeds] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const properties = [
    {
      image: 'https://images.unsplash.com/photo-1686056040370-b5e5c06c4273',
      title: 'Modern Downtown Apartment',
      location: 'Manhattan, New York',
      price: 2500,
      beds: 2,
      baths: 2,
      sqft: '1,200',
      type: 'Apartment',
      featured: true,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1632743441209-8a09b8a37e25',
      title: 'Luxury Penthouse Suite',
      location: 'Brooklyn, New York',
      price: 4200,
      beds: 3,
      baths: 2,
      sqft: '2,100',
      type: 'Penthouse',
      featured: true,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1692133188474-8c5591e6a6a8',
      title: 'Suburban Family Home',
      location: 'Queens, New York',
      price: 3800,
      beds: 4,
      baths: 3,
      sqft: '2,800',
      type: 'House',
      featured: false,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750',
      title: 'Cozy Studio Loft',
      location: 'Manhattan, New York',
      price: 1800,
      beds: 1,
      baths: 1,
      sqft: '650',
      type: 'Studio',
      featured: false,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
      title: 'Spacious Townhouse',
      location: 'Brooklyn, New York',
      price: 4500,
      beds: 4,
      baths: 3,
      sqft: '3,200',
      type: 'Townhouse',
      featured: true,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c',
      title: 'Garden View Apartment',
      location: 'Queens, New York',
      price: 2200,
      beds: 2,
      baths: 1,
      sqft: '1,000',
      type: 'Apartment',
      featured: false,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      title: 'Downtown Loft Space',
      location: 'Manhattan, New York',
      price: 3500,
      beds: 2,
      baths: 2,
      sqft: '1,800',
      type: 'Loft',
      featured: false,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3',
      title: 'Waterfront Condo',
      location: 'Brooklyn, New York',
      price: 3900,
      beds: 3,
      baths: 2,
      sqft: '2,000',
      type: 'Condo',
      featured: true,
      available: true
    },
    {
      image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde',
      title: 'Charming Bungalow',
      location: 'Queens, New York',
      price: 2800,
      beds: 3,
      baths: 2,
      sqft: '1,500',
      type: 'House',
      featured: false,
      available: true
    },
  ];

  // Filter properties based on selected criteria
  const filteredProperties = properties.filter(property => {
    const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];
    const matchesLocation = selectedLocation === 'all' || property.location.includes(selectedLocation);
    const matchesType = selectedType === 'all' || property.type === selectedType;
    const matchesBeds = selectedBeds === 'all' || property.beds === parseInt(selectedBeds);
    return matchesPrice && matchesLocation && matchesType && matchesBeds;
  });

  const resetFilters = () => {
    setPriceRange([500, 5000]);
    setSelectedLocation('all');
    setSelectedType('all');
    setSelectedBeds('all');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30" id="properties">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Asymmetric Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <Badge className="mb-4">Featured Properties</Badge>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground leading-tight">
              Discover Your
              <span className="block text-primary">Next Home</span>
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-lg text-muted-foreground">
              Browse through our curated selection of verified properties. Each listing is carefully vetted to ensure quality and authenticity for our community.
            </p>
          </div>
        </div>

        {/* Advanced Filter Section */}
        <Card className="mb-8 border-2 shadow-lg">
          <div className="p-6">
            {/* Filter Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground">Advanced Search Filters</h3>
                  <p className="text-sm text-muted-foreground">Customize your property search</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {filteredProperties.length} Properties
                </Badge>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowFilters(!showFilters)}
                  className="lg:hidden"
                >
                  {showFilters ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </div>

            {/* Filter Controls */}
            <div className={`space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Row 1: Location and Property Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Location Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    Location
                  </label>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary transition-colors">
                      <SelectValue placeholder="Select location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="Manhattan">Manhattan, New York</SelectItem>
                      <SelectItem value="Brooklyn">Brooklyn, New York</SelectItem>
                      <SelectItem value="Queens">Queens, New York</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Property Type Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-primary" />
                    Property Type
                  </label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger className="h-12 border-2 hover:border-primary transition-colors">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Apartment">🏢 Apartment</SelectItem>
                      <SelectItem value="House">🏠 House</SelectItem>
                      <SelectItem value="Condo">🏘️ Condo</SelectItem>
                      <SelectItem value="Townhouse">🏡 Townhouse</SelectItem>
                      <SelectItem value="Loft">🏭 Loft</SelectItem>
                      <SelectItem value="Studio">📦 Studio</SelectItem>
                      <SelectItem value="Penthouse">🌆 Penthouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Row 2: Price Range and Bedrooms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Price Range Slider */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <span>💰</span>
                    Monthly Rent Range
                  </label>
                  <div className="pt-2 px-2">
                    <Slider
                      min={500}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={setPriceRange}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                          className="w-24 h-10 px-3 border-2 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary bg-background"
                        />
                        <span className="text-muted-foreground">—</span>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                          className="w-24 h-10 px-3 border-2 rounded-lg text-sm font-semibold focus:outline-none focus:border-primary bg-background"
                        />
                      </div>
                      <Badge variant="outline" className="text-sm font-bold">
                        ${priceRange[0]} - ${priceRange[1]}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Bedrooms Filter */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                    <Bed className="w-4 h-4 text-primary" />
                    Bedrooms
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {['all', '1', '2', '3', '4'].map((bed) => (
                      <Button
                        key={bed}
                        variant={selectedBeds === bed ? 'default' : 'outline'}
                        size="lg"
                        onClick={() => setSelectedBeds(bed)}
                        className="h-12 font-semibold"
                      >
                        {bed === 'all' ? 'Any' : bed}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-4 border-t">
                <Button 
                  className="flex-1 h-12 text-base font-semibold gap-2"
                  onClick={() => console.log('Search properties')}
                >
                  <Search className="w-5 h-5" />
                  Search Properties
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12 px-6 gap-2 font-semibold"
                  onClick={resetFilters}
                >
                  <X className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-bold text-foreground">{filteredProperties.length}</span> of <span className="font-bold text-foreground">{properties.length}</span> properties
            </p>
            {(selectedLocation !== 'all' || selectedType !== 'all' || selectedBeds !== 'all' || priceRange[0] !== 500 || priceRange[1] !== 5000) && (
              <Badge variant="secondary" className="gap-1">
                Filters Active
              </Badge>
            )}
          </div>
          <Select defaultValue="featured">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">Featured First</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="beds">Most Bedrooms</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Property Cards - Staggered Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property, index) => (
            <Card 
              key={index} 
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
              style={{ marginTop: index % 2 === 0 ? '0' : '2rem' }}
            >
              <div className="relative overflow-hidden">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                  <Badge className="bg-primary shadow-lg">{property.type}</Badge>
                  {property.featured && (
                    <Badge className="bg-chart-4 text-white border-0 shadow-lg">⭐ Featured</Badge>
                  )}
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white text-sm font-medium drop-shadow-lg">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </div>
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                  {property.title}
                </h3>
                <div className="text-3xl font-bold text-primary mb-4">
                  ${property.price.toLocaleString()}<span className="text-sm text-muted-foreground font-normal">/month</span>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground border-t pt-4">
                  <div className="flex items-center gap-1">
                    <Bed className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{property.beds}</span> Beds
                  </div>
                  <div className="flex items-center gap-1">
                    <Bath className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{property.baths}</span> Baths
                  </div>
                  <div className="flex items-center gap-1">
                    <Maximize className="h-4 w-4" />
                    <span className="font-semibold text-foreground">{property.sqft}</span> sqft
                  </div>
                </div>
                <Button className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results Message */}
        {filteredProperties.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed">
            <div className="flex flex-col items-center gap-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">No Properties Found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your filters to see more results
                </p>
                <Button onClick={resetFilters} variant="outline">
                  Reset All Filters
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Load More Button */}
        {filteredProperties.length > 0 && (
          <div className="mt-12 text-center">
            <Button variant="outline" size="lg" className="px-8">
              Load More Properties
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default PropertyShowcase;