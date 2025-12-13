import React from 'react';
import { Button } from '../ui/button';
import { Play, CheckCircle2 } from 'lucide-react';

const VideoDemo = () => {
  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
          {/* Left Content - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <div className="inline-block px-4 py-2 bg-white/10 rounded-full backdrop-blur-sm border border-white/20">
              <span className="text-sm font-semibold">See It In Action</span>
            </div>
            
            <h2 className="text-4xl sm:text-5xl font-bold leading-tight">
              Experience RentMate
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
                In 2 Minutes
              </span>
            </h2>
            
            <p className="text-lg text-gray-300 leading-relaxed">
              Watch how RentMate transforms the rental experience for tenants, landlords, and property managers with our intuitive platform.
            </p>
            
            <div className="space-y-3">
              {['Property search and filtering', 'Instant messaging system', 'Payment and document management'].map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 flex-shrink-0" />
                  <span className="text-gray-200">{item}</span>
                </div>
              ))}
            </div>
            
            <Button size="lg" className="bg-white text-slate-900 hover:bg-gray-100">
              Start Free Trial
            </Button>
          </div>
          
          {/* Right Video - Takes 3 columns */}
          <div className="lg:col-span-3">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
              {/* Video Thumbnail */}
              <img
                src="https://images.unsplash.com/photo-1582407947304-fd86f028f716"
                alt="Demo video"
                className="w-full h-[400px] object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
              
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-2xl">
                  <Play className="h-8 w-8 text-slate-900 ml-1" fill="currentColor" />
                </button>
              </div>
              
              {/* Duration Badge */}
              <div className="absolute bottom-6 right-6 px-4 py-2 bg-black/50 backdrop-blur-md rounded-full border border-white/20">
                <span className="text-white text-sm font-medium">2:15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoDemo;