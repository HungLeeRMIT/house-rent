import React from 'react';
import { Button } from '../ui/button';
import { Users, Building2, Briefcase, CheckCircle2, ArrowRight } from 'lucide-react';

const UserRoles = () => {
  const roles = [
    {
      icon: Users,
      title: 'Tenants',
      subtitle: 'Find Your Dream Home',
      description: 'Search, apply, and manage your rental journey with ease. Connect directly with landlords and enjoy a seamless living experience.',
      features: [
        'Access 5000+ verified properties',
        'Virtual tours and 3D walkthroughs',
        'Direct landlord communication',
        'Digital lease signing',
        'One-click rent payments',
        'Instant maintenance requests'
      ],
      image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92',
      gradient: 'from-blue-600 to-cyan-600',
      stats: { properties: '5,000+', users: '8,000+' }
    },
    {
      icon: Building2,
      title: 'Landlords',
      subtitle: 'Maximize Your Returns',
      description: 'List properties, screen tenants, collect rent, and manage everything from a single dashboard. Grow your real estate portfolio effortlessly.',
      features: [
        'List unlimited properties',
        'AI-powered tenant screening',
        'Automated rent collection',
        'Expense tracking & reports',
        'Maintenance workflow management',
        'Vacancy rate optimization'
      ],
      image: 'https://images.unsplash.com/photo-1580041065738-e72023775cdc',
      gradient: 'from-emerald-600 to-teal-600',
      stats: { properties: '3,500+', users: '2,000+' }
    },
    {
      icon: Briefcase,
      title: 'Property Managers',
      subtitle: 'Scale Your Operations',
      description: 'Oversee multiple properties, coordinate teams, and deliver exceptional service. Enterprise-grade tools for professional management.',
      features: [
        'Multi-property dashboard',
        'Team collaboration tools',
        'Advanced analytics & reporting',
        'Bulk operations management',
        'Custom workflow automation',
        'API access for integrations'
      ],
      image: 'https://images.pexels.com/photos/5077049/pexels-photo-5077049.jpeg',
      gradient: 'from-purple-600 to-pink-600',
      stats: { properties: '15,000+', users: '500+' }
    },
  ];

  return (
    <section id="user-roles" className="py-24 bg-muted/20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            Built for Every Real Estate Professional
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Tailored experiences for tenants, landlords, and property managers with role-specific features
          </p>
        </div>

        {/* Role Cards - Alternating Layout */}
        <div className="space-y-24">
          {roles.map((role, index) => {
            const Icon = role.icon;
            const isReverse = index % 2 !== 0;
            
            return (
              <div key={index} className="relative">
                {/* Background Gradient Blob */}
                <div className={`absolute ${isReverse ? 'right-0' : 'left-0'} top-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br ${role.gradient} opacity-5 rounded-full blur-3xl`}></div>
                
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${isReverse ? 'lg:grid-flow-dense' : ''}`}>
                  {/* Content Side */}
                  <div className={`relative z-10 ${isReverse ? 'lg:col-start-2' : ''}`}>
                    <div className={`inline-flex items-center space-x-3 px-5 py-2 rounded-full bg-gradient-to-r ${role.gradient} mb-6`}>
                      <Icon className="h-6 w-6 text-white" />
                      <span className="text-white font-semibold">For {role.title}</span>
                    </div>
                    
                    <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                      {role.subtitle}
                    </h3>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {role.description}
                    </p>
                    
                    {/* Stats */}
                    <div className="flex space-x-8 mb-8">
                      <div>
                        <div className="text-3xl font-bold text-foreground">{role.stats.properties}</div>
                        <div className="text-sm text-muted-foreground">Properties Managed</div>
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-foreground">{role.stats.users}</div>
                        <div className="text-sm text-muted-foreground">Active {role.title}</div>
                      </div>
                    </div>
                    
                    {/* Features List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                      {role.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    <Button size="lg" className={`bg-gradient-to-r ${role.gradient} hover:opacity-90 text-white`}>
                      Get Started as {role.title.slice(0, -1)}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </div>
                  
                  {/* Image Side with Glass Card */}
                  <div className={`relative ${isReverse ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                    <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                      <img
                        src={role.image}
                        alt={role.title}
                        className="w-full h-[500px] object-cover"
                      />
                      {/* Glass Morphism Overlay Card */}
                      <div className="absolute bottom-8 left-8 right-8 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white text-sm font-medium mb-1">Success Rate</div>
                            <div className="text-white text-3xl font-bold">98.5%</div>
                          </div>
                          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                            <Icon className="h-8 w-8 text-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UserRoles;