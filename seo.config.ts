/**
 * SEO Configuration & Metadata System
 * Centralized metadata for all pages to ensure consistency and easy updates
 */

export interface PageMetadata {
  title: string;
  description: string;
  keywords?: string[];
  canonical?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  twitterCard?: 'summary' | 'summary_large_image';
  structuredData?: any;
}

const SITE_URL = 'https://openaria.app';
const COMPANY_NAME = 'OpenAria';
const TWITTER_HANDLE = '@openariahq';

// Home page
export const HOME_META: PageMetadata = {
  title: 'AI Receptionist for Businesses | OpenAria',
  description: 'OpenAria is a 24/7 AI receptionist that answers calls, books appointments, and captures leads. Never miss a customer call again.',
  keywords: ['AI receptionist', 'AI call answering', 'virtual receptionist', 'AI phone service', 'call answering service'],
  canonical: SITE_URL,
  ogType: 'website',
  ogImage: `${SITE_URL}/og-home.jpg`,
  twitterCard: 'summary_large_image',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'AI Receptionist for Modern Businesses',
    sameAs: [
      'https://www.facebook.com/ariareceptionist',
      'https://www.linkedin.com/company/aria-ai',
      'https://twitter.com/ariareceptionist'
    ]
  }
};

// AI Receptionist page
export const AI_RECEPTIONIST_META: PageMetadata = {
  title: 'AI Receptionist for Businesses | OpenAria - 24/7 Call Answering',
  description: 'OpenAria AI Receptionist answers calls 24/7, qualifies leads, books appointments, and sends data to your CRM. See how OpenAria increases revenue by reducing missed calls.',
  keywords: ['AI receptionist', 'virtual receptionist', 'AI call answering', 'automated receptionist', 'AI receptionist software'],
  canonical: `${SITE_URL}/ai-receptionist`,
  ogType: 'article',
  ogImage: `${SITE_URL}/og-receptionist.jpg`,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: 'AI Receptionist for Businesses | ARIA',
    description: 'Everything you need to know about AI receptionists and how ARIA can transform your business communications.',
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME
    },
    datePublished: new Date().toISOString(),
    image: `${SITE_URL}/og-receptionist.jpg`
  }
};

// AI Call Answering page
export const AI_CALL_ANSWERING_META: PageMetadata = {
  title: 'AI Call Answering Service | OpenAria - Never Miss a Call Again',
  description: 'OpenAria AI call answering service handles inbound calls, captures lead information, books appointments, and routes urgent calls 24/7. Reduce missed calls by 100%.',
  keywords: ['call answering service', 'AI call answering', 'automated call answering', 'virtual phone service', 'after-hours call answering'],
  canonical: `${SITE_URL}/ai-call-answering`,
  ogType: 'article',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'AI Call Answering Service',
    provider: {
      '@type': 'Organization',
      name: COMPANY_NAME
    },
    description: 'Intelligent call answering powered by AI. Answer calls 24/7, capture leads, book appointments.'
  }
};

// Industry pages
export const INDUSTRY_PAGES: Record<string, PageMetadata> = {
  'real-estate': {
    title: 'AI Receptionist for Real Estate | OpenAria - Qualify Leads Instantly',
    description: 'OpenAria AI receptionist for real estate agents and brokers. Qualify buyer & seller inquiries, schedule showings, capture lead data automatically.',
    keywords: ['AI receptionist for real estate', 'real estate lead generation', 'property inquiry automation', 'real estate phone service'],
    canonical: `${SITE_URL}/industries/real-estate`,
    ogType: 'article'
  },
  'healthcare': {
    title: 'AI Receptionist for Healthcare | OpenAria - HIPAA Compliant Call Handling',
    description: 'OpenAria AI receptionist for medical offices, dental practices, and clinics. Handle appointment requests, patient inquiries, and follow-ups securely.',
    keywords: ['AI receptionist for healthcare', 'medical appointment scheduling', 'clinic phone service', 'HIPAA compliant AI'],
    canonical: `${SITE_URL}/industries/healthcare`,
    ogType: 'article'
  },
  'hvac': {
    title: 'AI Receptionist for HVAC Companies | OpenAria - Emergency Service Dispatch',
    description: 'OpenAria AI receptionist for HVAC contractors. Capture emergency calls, schedule service appointments, dispatch technicians 24/7.',
    keywords: ['HVAC dispatch software', 'HVAC scheduling automation', 'plumbing call answering', 'emergency service dispatch'],
    canonical: `${SITE_URL}/industries/hvac`,
    ogType: 'article'
  },
  'law-firms': {
    title: 'AI Receptionist for Law Firms | OpenAria - Client Intake & Lead Capture',
    description: 'OpenAria AI receptionist for lawyers and law firms. Qualify potential clients, capture case information, and route calls to the right attorney.',
    keywords: ['AI receptionist for law firms', 'legal intake automation', 'client qualification software', 'attorney call handling'],
    canonical: `${SITE_URL}/industries/law-firms`,
    ogType: 'article'
  }
};

// Blog pages
export const BLOG_PAGES: Record<string, PageMetadata> = {
  'ai-receptionist-vs-human': {
    title: 'AI Receptionist vs Human: The Complete Comparison | OpenAria Blog',
    description: 'Compare AI receptionists and human receptionists. Learn the pros, cons, and when to use each for your business.',
    keywords: ['AI receptionist vs human', 'virtual receptionist', 'automated vs manual'],
    canonical: `${SITE_URL}/blog/ai-receptionist-vs-human`
  },
  'missed-calls-cost': {
    title: 'How Missed Calls Cost Your Business Money | OpenAria Blog',
    description: 'Discover the hidden costs of missed calls. Learn how lost leads, missed appointments, and reduced revenue add up.',
    keywords: ['missed calls', 'lost business', 'revenue impact', 'lead generation'],
    canonical: `${SITE_URL}/blog/missed-calls-cost`
  },
  'small-business-ai-receptionist': {
    title: 'Best AI Receptionist for Small Business in 2024 | OpenAria',
    description: 'Small business guide to choosing the right AI receptionist. Features, pricing, and implementation tips.',
    keywords: ['AI receptionist small business', 'affordable virtual receptionist', 'small business phone service'],
    canonical: `${SITE_URL}/blog/small-business-ai-receptionist`
  }
};

/**
 * Sitemap Routes
 * Used to generate sitemap.xml
 */
export const SITEMAP_ROUTES = [
  { url: '/', priority: 1.0, changefreq: 'weekly' as const },
  { url: '/ai-receptionist', priority: 0.95, changefreq: 'weekly' as const },
  { url: '/ai-call-answering', priority: 0.9, changefreq: 'weekly' as const },
  { url: '/industries/real-estate', priority: 0.8, changefreq: 'monthly' as const },
  { url: '/industries/healthcare', priority: 0.8, changefreq: 'monthly' as const },
  { url: '/industries/hvac', priority: 0.8, changefreq: 'monthly' as const },
  { url: '/industries/law-firms', priority: 0.8, changefreq: 'monthly' as const },
  { url: '/blog/ai-receptionist-vs-human', priority: 0.7, changefreq: 'monthly' as const },
  { url: '/blog/missed-calls-cost', priority: 0.7, changefreq: 'monthly' as const },
  { url: '/blog/small-business-ai-receptionist', priority: 0.7, changefreq: 'monthly' as const },
  { url: '/legal', priority: 0.5, changefreq: 'yearly' as const },
];

export const getSiteUrl = () => SITE_URL;
export const getTwitterHandle = () => TWITTER_HANDLE;
export const getCompanyName = () => COMPANY_NAME;
