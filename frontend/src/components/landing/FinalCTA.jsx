import React from 'react';
import { Button } from '../ui/button';
import { ArrowRight, Check } from 'lucide-react';

const FinalCTA = () => {
  return (
    <section className="py-32 bg-gradient-to-br from-slate-50 to-gray-100 dark:from-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
        <div className="absolute top-1/4 -left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Main CTA Card */}
          <div className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border border-border rounded-3xl p-12 sm:p-16 shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div>
                <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
                  <span className="text-sm font-semibold text-primary">Start Today</span>
                </div>
                
                <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6 leading-tight">
                  Ready to Transform Your Rental Experience?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of tenants, landlords, and property managers who trust RentMate for seamless property management.
                </p>
                
                {/* Features List */}
                <div className="space-y-3 mb-8">
                  {['No credit card required', 'Free 14-day trial', 'Cancel anytime'].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3">
                      <div className="w-6 h-6 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <span className="text-foreground">{item}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" className="text-base group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                  <Button size="lg" variant="outline" className="text-base">
                    Schedule Demo
                  </Button>
                </div>
              </div>
              
              {/* Right Visual Element */}
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914"
                    alt="Get started"
                    className="w-full h-80 object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                  
                  {/* Floating Stats Card */}
                  <div className="absolute bottom-6 left-6 right-6 backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 rounded-xl p-4 border border-white/20">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold text-foreground">10K+</div>
                        <div className="text-xs text-muted-foreground">Users</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">5K+</div>
                        <div className="text-xs text-muted-foreground">Properties</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-foreground">98%</div>
                        <div className="text-xs text-muted-foreground">Rating</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Trust Badges Below */}
          <div className="mt-12 text-center">
            <p className="text-sm text-muted-foreground mb-4">Trusted by leading real estate professionals</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-50">
              {['REAL ESTATE PRO', 'PROPERTY EXPERTS', 'RENTAL LEADERS', 'TRUSTED HOMES'].map((brand, idx) => (
                <div key={idx} className="text-lg font-bold text-foreground">{brand}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;