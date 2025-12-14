import React from 'react';
import { Search, MessageSquare, CreditCard, Wrench, FileText, LayoutDashboard, Shield, TrendingUp } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: Search,
      title: 'Smart Property Search',
      description: 'AI-powered search with filters for location, price, amenities, and instant matching.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: MessageSquare,
      title: 'Secure Messaging',
      description: 'End-to-end encrypted communication between tenants and landlords.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: CreditCard,
      title: 'Payment Tracking',
      description: 'Automated rent collection, payment reminders, and transaction history.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Wrench,
      title: 'Maintenance Hub',
      description: 'Submit, track, and resolve maintenance requests with photo uploads.',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FileText,
      title: 'Document Vault',
      description: 'Secure cloud storage for leases, contracts, and important documents.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: LayoutDashboard,
      title: 'Smart Dashboards',
      description: 'Real-time analytics and insights tailored to your role.',
      color: 'from-teal-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Verified Listings',
      description: 'Every property and user verified for safety and authenticity.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: TrendingUp,
      title: 'Market Insights',
      description: 'Real-time market data, pricing trends, and occupancy rates.',
      color: 'from-yellow-500 to-orange-500'
    },
  ];

  return (
    <section id="features" className="py-24 bg-background relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        {/* Center-aligned Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Powerful Features</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Everything You Need in One Platform
          </h2>
          <p className="text-xl text-muted-foreground">
            Streamline your entire rental journey with our comprehensive suite of tools
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const isLarge = index === 0 || index === 3;
            
            return (
              <div
                key={index}
                className={`group relative p-8 rounded-2xl backdrop-blur-sm bg-card/50 border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                  isLarge ? 'lg:col-span-2 lg:row-span-1' : ''
                }`}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 rounded-2xl bg-gradient-to-br ${feature.color}`}></div>
                
                <div className="relative">
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;