/**
 * Solutions Directory Layout Wrapper
 * Provides shared structure for all programmatic SEO pages
 */

import React from 'react';

export const metadata = {
  title: 'Industry Solutions | OpenAria AI Receptionist',
  description: 'AI receptionist solutions tailored for 9 specific industries: Dentists, Plumbers, Law Firms, Salons, Vets, Restaurants, Consultants, Gyms, and Real Estate.',
};

export default function SolutionsLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <div className="min-h-screen bg-slate-950">
      {children}
    </div>
  );
}
