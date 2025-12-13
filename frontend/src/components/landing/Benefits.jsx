import React from 'react';
import { Shield, Clock, TrendingUp, Globe, Lock, Zap } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Bank-level encryption protects your data and transactions.',
    },
    {
      icon: Clock,
      title: 'Save Time',
      description: 'Automate repetitive tasks and focus on what matters.',
    },
    {
      icon: TrendingUp,
      title: 'Increase Efficiency',
      description: 'Reduce vacancy periods and streamline operations.',
    },
    {
      icon: Globe,
      title: 'Access Anywhere',
      description: 'Manage your rentals from any device, anytime.',
    },
    {
      icon: Lock,
      title: 'Data Privacy',
      description: 'Your information is protected with industry standards.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Quick loading times and instant updates.',
    },
  ];

  return (
    <section className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Why Choose RentMate?
          </h2>
          <p className="text-lg text-muted-foreground">
            Experience the difference with our cutting-edge platform designed for modern rental management.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={index}
                className="flex flex-col items-center text-center p-6 rounded-xl hover:bg-background transition-colors duration-300"
              >
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Benefits;