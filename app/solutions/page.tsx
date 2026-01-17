/**
 * Solutions Hub Page
 * Route: /solutions
 * 
 * Displays all 9 industry solutions with links to individual pages
 * Serves as category/index page for crawl efficiency and user navigation
 */

import React from 'react';
import Link from 'next/link';
import { INDUSTRIES_DATA } from '@/data/industriesSemanticData';
import { ArrowRight, Briefcase } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Receptionist Solutions for 9 Industries | OpenAria',
  description:
    'Explore industry-specific AI receptionist solutions: Dentists, Plumbers, Law Firms, Salons, Vets, Restaurants, Consultants, Gyms, Real Estate. 24/7 call handling & booking.',
  keywords: [
    'AI receptionist solutions',
    'industry-specific call answering',
    'automated appointment booking',
    'business solutions',
  ],
  openGraph: {
    title: 'AI Receptionist Solutions for 9 Industries | OpenAria',
    description: 'Industry-specific solutions for automated call answering and appointment scheduling.',
    url: 'https://openaria.app/solutions',
    type: 'website',
  },
};

export default function SolutionsHubPage(): React.ReactElement {
  return (
    <>
      {/* HERO SECTION */}
      <section className="relative min-h-[500px] bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            Industry-Specific AI Receptionist Solutions
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
            OpenAria provides tailored call answering, appointment scheduling, and lead capture for 9 specific industries. Find your solution below.
          </p>

          <p className="text-lg text-slate-400">
            All solutions include 24/7 availability, HIPAA/compliance support, and integration with industry-standard software.
          </p>
        </div>
      </section>

      {/* SOLUTIONS GRID */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {INDUSTRIES_DATA.map(industry => (
              <Link
                key={industry.slug}
                href={`/solutions/${industry.slug}`}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600/50 hover:border-blue-500/50 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/20"
              >
                {/* Background gradient effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/10 group-hover:to-purple-600/10 transition-all" />

                {/* Card content */}
                <div className="relative p-8">
                  {/* Icon placeholder */}
                  <div className="mb-6 inline-flex items-center justify-center w-14 h-14 rounded-lg bg-blue-600/20 group-hover:bg-blue-600/40 transition">
                    <Briefcase className="text-blue-400" size={28} />
                  </div>

                  {/* Industry name */}
                  <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-blue-300 transition">
                    {industry.industryName}
                  </h3>

                  {/* Short description */}
                  <p className="text-slate-300 mb-6 line-clamp-2">
                    {industry.heroSubheading}
                  </p>

                  {/* Pain points preview */}
                  <div className="mb-6 space-y-2">
                    {industry.painPoints.slice(0, 2).map((point, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-sm text-slate-400">
                        <span className="text-red-400 mt-1">•</span>
                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Link */}
                  <div className="flex items-center gap-2 text-blue-400 font-semibold group-hover:gap-3 transition-all">
                    Explore Solution
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROP SECTION */}
      <section className="py-20 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12 text-center">
            Common Benefits Across All Industries
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: '24/7 Call Answering',
                description: 'Never miss a call again. OpenAria answers instantly, even after business hours.',
              },
              {
                title: 'Automated Booking',
                description: 'Capture appointments and schedule directly into your CRM or calendar system.',
              },
              {
                title: 'Lead Qualification',
                description: 'Only qualified leads reach your team. Save hours on non-viable inquiries.',
              },
              {
                title: 'Industry Integration',
                description: 'Seamless integration with leading software: Clio, OpenDental, ServiceTitan, and more.',
              },
              {
                title: 'Compliance Ready',
                description: 'HIPAA, SOC2, GDPR-compliant data handling for regulated industries.',
              },
              {
                title: 'No Setup Hassle',
                description: '14-day free trial with full platform access. No credit card required.',
              },
            ].map((benefit, idx) => (
              <div key={idx} className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-slate-600/50">
                <h3 className="text-lg font-bold text-white mb-3">{benefit.title}</h3>
                <p className="text-slate-300">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Business?
          </h2>
          <p className="text-xl text-blue-100 mb-12">
            Choose your industry above to see how OpenAria can help you answer more calls, book more appointments, and capture more leads.
          </p>
          <a
            href="/#pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-slate-100 transition transform hover:scale-105"
          >
            Start Your 14-Day Trial
          </a>
        </div>
      </section>
    </>
  );
}
