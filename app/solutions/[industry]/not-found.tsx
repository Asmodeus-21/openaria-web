/**
 * Not Found Page for Solutions Route
 * Renders when an invalid industry slug is requested
 * Prevents soft 404 errors and improves crawl budget efficiency
 */

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function NotFound(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
      <div className="text-center">
        {/* 404 Graphic */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-slate-600 mb-2">404</h1>
          <div className="h-1 w-24 bg-gradient-to-r from-blue-600 to-purple-600 mx-auto rounded-full" />
        </div>

        {/* Error Message */}
        <h2 className="text-4xl font-bold text-white mb-4">Industry Not Found</h2>
        <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
          The industry solution you're looking for doesn't exist yet. Please choose from our available solutions below.
        </p>

        {/* Navigation Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/solutions"
            className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <ArrowLeft size={20} />
            Browse All Solutions
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-8 py-4 border border-slate-500 text-slate-300 font-semibold rounded-lg hover:border-slate-400 transition"
          >
            Back to Home
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-16 p-8 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-2xl mx-auto">
          <h3 className="text-lg font-semibold text-white mb-4">Available Industries:</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-left">
            {[
              'Dentists',
              'Plumbers',
              'Law Firms',
              'Hair Salons',
              'Veterinary Clinics',
              'Restaurants',
              'Consultants',
              'Fitness Studios',
              'Real Estate Agents',
            ].map(industry => (
              <p key={industry} className="text-slate-300">
                ✓ {industry}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
