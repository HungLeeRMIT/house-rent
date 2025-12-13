import React from 'react';
import { TrendingUp, Home, Users, DollarSign } from 'lucide-react';

const InteractiveStats = () => {
  const stats = [
    {
      icon: Home,
      value: '5,247',
      label: 'Active Properties',
      change: '+12% this month',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Users,
      value: '10,429',
      label: 'Happy Users',
      change: '+8% this month',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: DollarSign,
      value: '$2.4M',
      label: 'Transactions Processed',
      change: '+25% this month',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: TrendingUp,
      value: '98.5%',
      label: 'Satisfaction Rate',
      change: '+2% this month',
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <section className="py-24 bg-muted/30 relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/2724749/pexels-photo-2724749.jpeg"
          alt="Background"
          className="w-full h-full object-cover opacity-10"
        />
      </div>
      
      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Real-Time Platform Metrics
          </h2>
          <p className="text-xl text-muted-foreground">
            See the impact we're making in the real estate rental market
          </p>
        </div>

        {/* Stats Grid with Glass Morphism */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="relative group"
              >
                {/* Glass Card */}
                <div className="relative backdrop-blur-xl bg-background/60 border border-border rounded-2xl p-8 hover:bg-background/80 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  {/* Gradient Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="h-7 w-7 text-white" />
                  </div>
                  
                  {/* Value */}
                  <div className="text-4xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  
                  {/* Label */}
                  <div className="text-muted-foreground mb-3">
                    {stat.label}
                  </div>
                  
                  {/* Change Indicator */}
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-500 font-medium">{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Text */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground">
            Last updated: <span className="text-foreground font-medium">Just now</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default InteractiveStats;