import React from 'react';
import { Card, CardContent } from '../ui/card';
import { UserPlus, Search as SearchIcon, FileCheck, Key } from 'lucide-react';

const HowItWorks = () => {
  const steps = [
    {
      icon: UserPlus,
      step: '01',
      title: 'Create Your Account',
      description: 'Sign up as a tenant, landlord, or property manager in just a few clicks.',
    },
    {
      icon: SearchIcon,
      step: '02',
      title: 'Browse Properties',
      description: 'Search and filter through available properties that match your criteria.',
    },
    {
      icon: FileCheck,
      step: '03',
      title: 'Connect & Communicate',
      description: 'Message landlords, submit applications, and manage all documentation securely.',
    },
    {
      icon: Key,
      step: '04',
      title: 'Move In & Manage',
      description: 'Complete your lease, track payments, and handle maintenance all in one place.',
    },
  ];

  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            How RentMate Works
          </h2>
          <p className="text-lg text-muted-foreground">
            Get started in four simple steps and transform your rental experience.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="relative border-border bg-background hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shadow-md">
                    {step.step}
                  </div>
                  
                  <div className="mt-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {step.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;