import React from 'react';

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  quote: string;
}

export interface PricingPlan {
  name: string;
  price: string;
  period: string;
  features: string[];
  isPopular?: boolean;
  cta: string;
  stripeLink?: string; // URL for Stripe Payment Link
}

export interface Feature {
  title: string;
  description: string;
  icon: React.ElementType;
}

export interface GHLPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  businessType: string;
  sourcePage: string;
  timestamp: string;
  consentEmail: boolean;
  consentSMS: boolean;
  tags: string[];
  selectedPlan?: string;
}