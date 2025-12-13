import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Play, Search, MapPin } from 'lucide-react';
import { Input } from '../ui/input';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
          alt="Luxury property"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 right-10 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-8">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
            <span className="text-sm font-medium text-white">10,000+ Active Properties</span>
          </div>
          
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6">
            Find Your Perfect
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Rental Home
            </span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl">
            Connect with verified landlords, manage properties seamlessly, and experience hassle-free renting for tenants, landlords, and property managers.
          </p>

          {/* Search Bar */}
          <div className="bg-white rounded-2xl p-2 shadow-2xl mb-8 max-w-3xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1 flex items-center px-4 py-3 bg-gray-50 rounded-xl">
                <MapPin className="h-5 w-5 text-gray-400 mr-3" />
                <Input 
                  placeholder="Enter location or property name"
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                />
              </div>
              <Button size="lg" className="px-8 py-6 text-base">
                <Search className="mr-2 h-5 w-5" />
                Search Properties
              </Button>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-12">
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm group">
              <Play className="mr-2 h-5 w-5" />
              Watch Demo
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
              List Your Property
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-white">10K+</div>
              <div className="text-sm text-gray-300">Happy Tenants</div>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-white">5K+</div>
              <div className="text-sm text-gray-300">Verified Properties</div>
            </div>
            <div className="backdrop-blur-md bg-white/10 p-4 rounded-xl border border-white/20">
              <div className="text-3xl font-bold text-white">98%</div>
              <div className="text-sm text-gray-300">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <div className="flex flex-col items-center animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full p-1">
            <div className="w-1.5 h-3 bg-white/70 rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;