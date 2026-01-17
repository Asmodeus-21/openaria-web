import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ChevronRight, CheckCircle2, Target, TrendingUp, Clock, Zap } from 'lucide-react';
import Button from './Button';
import BreadcrumbSchema from './BreadcrumbSchema';
import StructuredData from './StructuredData';
import { getIndustryBySlug, IndustrySolution } from '../data/industryPages';

interface IndustrySolutionPageProps {
  industry?: IndustrySolution;
}

const IndustrySolutionPage: React.FC<IndustrySolutionPageProps> = ({ industry: propIndustry }) => {
  const params = useParams<{ industry: string }>();
  const industrySlug = params.industry || '';

  // Get industry data from slug or from props (for SSR scenarios)
  const industry = useMemo(() => {
    return propIndustry || getIndustryBySlug(industrySlug);
  }, [propIndustry, industrySlug]);

  if (!industry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Industry Not Found</h1>
          <p className="text-slate-400 mb-6">
            This industry solution page is not available yet.
          </p>
          <Button onClick={() => window.location.href = '/'}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Dynamic metadata generation
  const canonicalUrl = `https://openaria.app/solutions/${industry.slug}`;

  const breadcrumbItems = [
    { name: 'Home', url: 'https://openaria.app' },
    { name: 'Solutions', url: 'https://openaria.app/solutions' },
    { name: industry.industryName, url: canonicalUrl }
  ];

  return (
    <>
      {/* Dynamic SEO Head */}
      <Helmet>
        <title>{industry.metaTitle}</title>
        <meta name="description" content={industry.metaDescription} />
        <meta name="keywords" content={industry.keywords.join(', ')} />
        <link rel="canonical" href={canonicalUrl} />
        
        {/* Open Graph */}
        <meta property="og:title" content={industry.metaTitle} />
        <meta property="og:description" content={industry.metaDescription} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="OpenAria" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={industry.metaTitle} />
        <meta name="twitter:description" content={industry.metaDescription} />

        {/* Caching headers for performance */}
        <meta httpEquiv="cache-control" content="public, max-age=3600, s-maxage=86400" />
      </Helmet>

      {/* Structured Data */}
      <BreadcrumbSchema items={breadcrumbItems} />
      <StructuredData pricing={[]} />

      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pt-32 pb-20 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-8 text-sm text-slate-400">
            <a href="/" className="hover:text-blue-400 transition">Home</a>
            <ChevronRight size={16} />
            <a href="/solutions" className="hover:text-blue-400 transition">Solutions</a>
            <ChevronRight size={16} />
            <span className="text-slate-200">{industry.industryName}</span>
          </div>

          {/* Main headline */}
          <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6 leading-tight">
            The Best AI Receptionist for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">{industry.displayName}</span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 max-w-3xl leading-relaxed">
            {industry.useCase}
          </p>

          <p className="text-lg text-slate-400 mb-12 max-w-3xl">
            {industry.description}
          </p>

          <Button
            onClick={() => window.location.href = '/#pricing'}
            className="mb-16 text-lg px-8 py-4"
          >
            Start Your 14-Day Trial
          </Button>

          {/* Quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 pt-16 border-t border-slate-700/50">
            {industry.benefits.slice(0, 3).map((benefit, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <CheckCircle2 className="text-green-400 flex-shrink-0 mt-1" size={24} />
                <div>
                  <p className="text-slate-200 font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-20 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Challenges {industry.displayName} Face
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industry.painPoints.map((painPoint, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-br from-red-500/10 to-red-500/5 border border-red-500/20 hover:border-red-500/40 transition"
              >
                <div className="flex items-start gap-4">
                  <Target className="text-red-400 flex-shrink-0 mt-1" size={24} />
                  <p className="text-slate-200">{painPoint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            How OpenAria Solves These Challenges
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {industry.features.map((feature, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-blue-500/5 border border-blue-500/20 hover:border-blue-500/40 transition"
              >
                <div className="flex items-start gap-4">
                  <Zap className="text-blue-400 flex-shrink-0 mt-1" size={24} />
                  <p className="text-slate-200">{feature}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-white mb-12">
            Results You Can Expect
          </h2>

          <div className="space-y-6">
            {industry.benefits.map((benefit, idx) => (
              <div
                key={idx}
                className="p-6 rounded-lg bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 hover:border-green-500/40 transition"
              >
                <div className="flex items-center gap-4">
                  <TrendingUp className="text-green-400 flex-shrink-0" size={28} />
                  <p className="text-lg text-slate-200 font-medium">{benefit}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your {industry.displayName}?
          </h2>

          <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
            Join hundreds of {industry.industryName} already using OpenAria to answer calls, book appointments, and capture leads 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button
              onClick={() => window.location.href = '/#pricing'}
              className="bg-white text-blue-600 hover:bg-slate-100"
            >
              Start 14-Day Trial
            </Button>
            <Button
              onClick={() => window.location.href = '/'}
              variant="outline"
              className="text-white border-white hover:bg-white/20"
            >
              Learn More
            </Button>
          </div>

          <p className="text-sm text-blue-100 mt-8">
            <Clock size={16} className="inline mr-2" />
            No credit card required. Full platform access.
          </p>
        </div>
      </section>
    </>
  );
};

export default IndustrySolutionPage;
