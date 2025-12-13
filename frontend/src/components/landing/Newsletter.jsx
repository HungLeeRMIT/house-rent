import React from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Mail } from 'lucide-react';

const Newsletter = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background with Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1515263487990-61b07816b324"
          alt="Newsletter background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/90 to-blue-600/90"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      }}></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-6">
            <Mail className="h-8 w-8 text-white" />
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Stay Updated with Real Estate Insights
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get the latest property listings, market trends, and exclusive offers delivered to your inbox weekly.
          </p>
          
          {/* Newsletter Form */}
          <div className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3 backdrop-blur-xl bg-white/10 p-2 rounded-2xl border border-white/20">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-white/90 border-0 h-12 text-base focus-visible:ring-2 focus-visible:ring-white"
              />
              <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-semibold">
                Subscribe
              </Button>
            </div>
            <p className="text-sm text-white/70 mt-4">
              Join 5,000+ subscribers. Unsubscribe anytime.
            </p>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex items-center justify-center space-x-8 mt-12">
            <div className="text-white/80 text-sm">
              <span className="font-bold text-white">5K+</span> Subscribers
            </div>
            <div className="w-px h-8 bg-white/30"></div>
            <div className="text-white/80 text-sm">
              <span className="font-bold text-white">Weekly</span> Updates
            </div>
            <div className="w-px h-8 bg-white/30"></div>
            <div className="text-white/80 text-sm">
              <span className="font-bold text-white">No</span> Spam
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;