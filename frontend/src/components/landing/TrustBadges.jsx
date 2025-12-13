import React from 'react';
import { Shield, Award, Lock, Users, TrendingUp, Zap } from 'lucide-react';

const TrustBadges = () => {
  const badges = [
    { icon: Shield, label: 'Verified Secure', value: 'SSL Encrypted' },
    { icon: Award, label: 'Award Winning', value: 'Best Platform 2024' },
    { icon: Users, label: 'Trusted By', value: '10,000+ Users' },
    { icon: Lock, label: 'GDPR Compliant', value: 'Data Protected' },
    { icon: TrendingUp, label: '98% Success Rate', value: 'Proven Results' },
    { icon: Zap, label: '24/7 Support', value: 'Always Available' },
  ];

  return (
    <section className="py-16 bg-background border-y border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {badges.map((badge, index) => {
            const Icon = badge.icon;
            return (
              <div key={index} className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-foreground">{badge.label}</div>
                <div className="text-xs text-muted-foreground">{badge.value}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;