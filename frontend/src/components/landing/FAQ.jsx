import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';

const FAQ = () => {
  const faqs = [
    {
      question: 'How does RentMate verify properties and users?',
      answer: 'We use a multi-step verification process including document verification, identity checks, and property inspections. All landlords must provide proof of ownership, and properties are verified through official records. Tenants undergo background checks to ensure a safe community.'
    },
    {
      question: 'What payment methods are supported?',
      answer: 'RentMate supports multiple payment methods including credit/debit cards, bank transfers, ACH payments, and digital wallets. All transactions are encrypted and processed through secure payment gateways. Landlords receive payments directly to their bank accounts within 1-2 business days.'
    },
    {
      question: 'How does the maintenance request system work?',
      answer: 'Tenants can submit maintenance requests through the app with photos and descriptions. Landlords or property managers receive instant notifications and can assign requests to service providers. The system tracks progress in real-time, and all parties can communicate within the ticket.'
    },
    {
      question: 'Can property managers handle multiple properties?',
      answer: 'Yes! Property managers get access to a comprehensive dashboard that displays all properties, tenants, and activities in one place. You can manage unlimited properties, create teams, assign tasks, and generate consolidated reports across your entire portfolio.'
    },
    {
      question: 'Is my data secure on RentMate?',
      answer: 'Absolutely. We use bank-level 256-bit SSL encryption for all data transmission and storage. Our platform is GDPR compliant, SOC 2 certified, and undergoes regular security audits. We never share your data with third parties without explicit consent.'
    },
    {
      question: 'What happens if I need to break my lease early?',
      answer: 'Lease terms including early termination policies are clearly outlined in your digital lease agreement. You can initiate the process through the platform, and RentMate helps facilitate communication between tenant and landlord to reach an amicable solution according to local laws.'
    },
    {
      question: 'How does pricing work for landlords?',
      answer: 'Landlords can start with our free tier to list up to 3 properties. Our Professional plan ($29/month) allows up to 10 properties with advanced features. Enterprise plans for property managers with 10+ properties include custom pricing, API access, and dedicated support.'
    },
    {
      question: 'Can I schedule property viewings through RentMate?',
      answer: 'Yes! Tenants can request viewing appointments directly through the platform. Landlords can set their availability, and the system automatically syncs with calendars. You\'ll receive reminders, and can even conduct virtual tours through our integrated video call feature.'
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side - Header */}
          <div className="lg:sticky lg:top-24">
            <div className="inline-block px-4 py-2 bg-primary/10 rounded-full mb-6">
              <span className="text-sm font-semibold text-primary">FAQ</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
              Got Questions?
              <span className="block text-primary">We've Got Answers</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Everything you need to know about RentMate. Can't find what you're looking for? Chat with our friendly team.
            </p>
            <Button className="bg-primary hover:bg-primary/90">
              Contact Support
            </Button>
          </div>

          {/* Right Side - Accordion */}
          <div>
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-border rounded-xl px-6 bg-card/50 backdrop-blur-sm hover:shadow-lg transition-shadow"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-5">
                    <span className="font-semibold text-foreground pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground pb-5 leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
};

import { Button } from '../ui/button';

export default FAQ;