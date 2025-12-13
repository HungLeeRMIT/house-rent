import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, Quote } from 'lucide-react';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Tenant',
      company: 'Marketing Professional',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      rating: 5,
      text: 'Finding my dream apartment was effortless with RentMate. The search filters are incredibly intuitive, and I was able to communicate directly with landlords. Moved in within 2 weeks!',
      highlight: 'Found home in 2 weeks'
    },
    {
      name: 'Michael Chen',
      role: 'Landlord',
      company: '12 Properties',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      rating: 5,
      text: 'As a landlord managing multiple properties, RentMate has been transformative. Rent tracking, maintenance management, and tenant screening are now completely automated. My vacancy rate dropped by 40%!',
      highlight: '40% vacancy reduction'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Property Manager',
      company: 'Premium Real Estate',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
      rating: 5,
      text: 'Managing 50+ properties used to require a team of 5. With RentMate, I handle everything solo with better results. The dashboard gives me complete visibility, and tenants love the self-service features.',
      highlight: 'Managing 50+ properties solo'
    },
    {
      name: 'David Thompson',
      role: 'Tenant',
      company: 'Software Engineer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
      rating: 5,
      text: 'The maintenance request system is phenomenal. I can submit issues with photos, track progress in real-time, and my landlord responds within hours. It\'s completely transparent and efficient.',
      highlight: 'Real-time maintenance tracking'
    },
    {
      name: 'Lisa Anderson',
      role: 'Landlord',
      company: '5 Properties',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
      rating: 5,
      text: 'Document storage is a game-changer! All lease agreements, invoices, and important docs in one secure place. No more digging through emails or filing cabinets. Plus, rent collection is automated.',
      highlight: 'Fully automated operations'
    },
    {
      name: 'James Wilson',
      role: 'Property Manager',
      company: 'Urban Properties Ltd',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
      rating: 5,
      text: 'The analytics and reporting features help me make data-driven decisions. Our occupancy rates improved by 25%, and tenant satisfaction scores are at an all-time high. Best investment we\'ve made.',
      highlight: '25% occupancy increase'
    },
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-4">
            <span className="text-sm font-semibold text-primary">Success Stories</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Loved by Thousands
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See what our community says about their RentMate experience
          </p>
        </div>

        {/* Testimonials Grid - Masonry Style */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="break-inside-avoid border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-card/50 backdrop-blur-sm">
              <CardContent className="p-6">
                {/* Quote Icon */}
                <Quote className="h-10 w-10 text-primary/20 mb-4" />
                
                {/* Stars */}
                <div className="flex space-x-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                
                {/* Testimonial Text */}
                <p className="text-foreground mb-4 leading-relaxed">
                  "{testimonial.text}"
                </p>
                
                {/* Highlight Badge */}
                <div className="inline-block px-3 py-1 bg-primary/10 rounded-full mb-4">
                  <span className="text-xs font-semibold text-primary">{testimonial.highlight}</span>
                </div>
                
                {/* Author */}
                <div className="flex items-center space-x-3 pt-4 border-t border-border">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;