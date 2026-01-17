// Industry solutions data for programmatic SEO landing pages
// Format: {industry: IndustrySolution}

export interface IndustrySolution {
  id: string;
  industryName: string;
  displayName: string;
  slug: string;
  painPoints: string[];
  useCase: string;
  description: string;
  features: string[];
  benefits: string[];
  cta: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
}

export const INDUSTRY_SOLUTIONS: Record<string, IndustrySolution> = {
  dentists: {
    id: 'dentists',
    industryName: 'Dentists',
    displayName: 'Dental Practices',
    slug: 'dentists',
    painPoints: [
      'Missing patient calls during busy hours',
      'Manual appointment scheduling consuming staff time',
      'No-shows due to lack of reminders',
      'Patient inquiries going unanswered after hours',
      'Difficulty capturing new patient information'
    ],
    useCase: 'Automated patient intake, appointment scheduling, and 24/7 call handling for dental practices',
    description: 'OpenAria handles all patient calls 24/7, books appointments directly into your calendar, and captures patient information automatically. No more missed calls or scheduling conflicts.',
    features: [
      'Automatic appointment booking',
      'Patient history recall',
      'Insurance verification inquiries',
      'Treatment reminders',
      'New patient intake forms',
      'Emergency triage'
    ],
    benefits: [
      '40% fewer no-shows with automated reminders',
      'Fill 60% more appointments automatically',
      'Reduce staff workload by 20+ hours/week',
      'Never miss a patient call again'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Dentists | OpenAria',
    metaDescription: 'Automated appointment scheduling and 24/7 patient call handling for dental practices. Never miss a patient call again.',
    keywords: ['AI receptionist for dentists', 'dental practice appointment scheduling', 'automated dental office', 'dental patient intake']
  },

  plumbers: {
    id: 'plumbers',
    industryName: 'Plumbers',
    displayName: 'Plumbing Services',
    slug: 'plumbers',
    painPoints: [
      'Emergency calls coming in outside business hours',
      'Dispatcher overloaded with phone calls',
      'Missed job opportunities due to unanswered calls',
      'Customers waiting on hold',
      'Manual job intake causing errors'
    ],
    useCase: 'Emergency call handling, job intake, and appointment scheduling for plumbing services operating 24/7',
    description: 'OpenAria answers every plumbing call instantly, qualifies emergencies, takes job details, and schedules appointments—even during off-hours. Your dispatchers focus on what matters.',
    features: [
      'Emergency call triage',
      'Job details collection',
      'Appointment scheduling',
      'Customer callback management',
      'Service area verification',
      'Payment collection for service calls'
    ],
    benefits: [
      'Never miss an emergency call again',
      'Reduce dispatcher workload by 50%',
      'Increase job bookings by 35%',
      'Improve response times by hours'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Plumbers | OpenAria',
    metaDescription: '24/7 emergency call handling and job scheduling for plumbing businesses. Never miss a customer call.',
    keywords: ['AI receptionist for plumbers', 'emergency plumbing calls', 'plumbing job scheduling', 'plumber dispatcher software']
  },

  lawyers: {
    id: 'lawyers',
    industryName: 'Lawyers',
    displayName: 'Law Firms',
    slug: 'lawyers',
    painPoints: [
      'Client calls interrupting attorney billable hours',
      'Receptionist costs consuming 15-20% of overhead',
      'Missed consultation requests',
      'Inconsistent client communication',
      'Inability to handle after-hours inquiries'
    ],
    useCase: 'Professional call handling and consultation scheduling for law firms maximizing attorney productivity',
    description: 'OpenAria professionally screens calls, qualifies consultation requests, and schedules appointments. Your attorneys focus on legal work, not phone management.',
    features: [
      'Professional call screening',
      'Consultation qualification',
      'Calendar integration for attorney availability',
      'Client information capture',
      'Callback scheduling',
      'Confidentiality-compliant handling'
    ],
    benefits: [
      'Eliminate receptionist costs ($40-60k/year)',
      'Increase billable attorney hours by 10%',
      'Never miss a consultation lead again',
      'Professional, consistent client experience'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Law Firms | OpenAria',
    metaDescription: 'Professional AI call screening and consultation scheduling for attorneys. Never interrupt billable hours again.',
    keywords: ['AI receptionist for lawyers', 'law firm call handling', 'attorney appointment scheduling', 'legal consultation booking']
  },

  salons: {
    id: 'salons',
    industryName: 'Salons',
    displayName: 'Hair & Beauty Salons',
    slug: 'salons',
    painPoints: [
      'Phone constantly ringing during service hours',
      'Stylists interrupted from clients',
      'No way to handle calls when all stylists are booked',
      'Cancellations and no-shows costing revenue',
      'Manual booking creating appointment conflicts'
    ],
    useCase: 'Automated appointment booking and no-show reduction for salons',
    description: 'OpenAria answers salon calls, checks availability in real-time, books appointments, and sends reminders. Your stylists stay focused on clients.',
    features: [
      'Real-time availability checking',
      'Stylist preference matching',
      'Automated booking',
      'No-show prevention reminders',
      'Service selection',
      'Customer preference notes'
    ],
    benefits: [
      'Reduce no-shows by 50%',
      'Book 40% more appointments',
      'Eliminate phone interruptions',
      'Improve customer satisfaction'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Hair Salons | OpenAria',
    metaDescription: 'Automated appointment booking and no-show reduction for beauty salons. Never interrupt your stylists again.',
    keywords: ['AI receptionist for salons', 'salon appointment booking', 'hair salon scheduling software', 'beauty salon AI']
  },

  veterinarians: {
    id: 'veterinarians',
    industryName: 'Veterinarians',
    displayName: 'Veterinary Clinics',
    slug: 'veterinarians',
    painPoints: [
      'Staff handling calls instead of caring for animals',
      'Pet owners unable to reach clinic during busy times',
      'Missed emergency calls',
      'No documentation of caller information',
      'Scheduling conflicts and double-bookings'
    ],
    useCase: 'Pet health inquiry handling and appointment scheduling for veterinary clinics',
    description: 'OpenAria handles pet owner calls professionally, qualifies health concerns, and books appointments. Your veterinary team focuses on animal care.',
    features: [
      'Pet health concern qualification',
      'Emergency triage routing',
      'Vaccination record inquiries',
      'Appointment booking',
      'Pet and owner information capture',
      'Refill and prescription requests'
    ],
    benefits: [
      'Free up staff to focus on animal care',
      'Increase appointment bookings by 30%',
      'Better emergency response',
      'Reduced wait times for callers'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Veterinary Clinics | OpenAria',
    metaDescription: 'Automated appointment scheduling and call handling for veterinary practices. Never miss a pet emergency.',
    keywords: ['AI receptionist for vets', 'veterinary appointment scheduling', 'vet clinic call handling', 'pet hospital receptionist']
  },

  restaurants: {
    id: 'restaurants',
    industryName: 'Restaurants',
    displayName: 'Restaurants & Cafes',
    slug: 'restaurants',
    painPoints: [
      'Phone ringing during peak service hours',
      'Servers forced to answer calls instead of serving tables',
      'Missed reservation requests',
      'Manual reservation system error-prone',
      'Catering inquiries going unanswered'
    ],
    useCase: 'Reservation booking and order taking for restaurants and food service businesses',
    description: 'OpenAria books reservations, answers menu questions, takes orders, and handles catering inquiries 24/7. Your staff serves guests, not phones.',
    features: [
      'Real-time reservation booking',
      'Menu inquiry handling',
      'Table preference selection',
      'Catering inquiry qualification',
      'Special dietary requirement documentation',
      'No-show reduction'
    ],
    benefits: [
      'Increase reservation bookings by 25%',
      'Reduce no-shows with reminders',
      'Eliminate phone interruptions during service',
      'Capture catering opportunities'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Restaurants | OpenAria',
    metaDescription: 'Automated reservation booking and order handling for restaurants. Never interrupt service again.',
    keywords: ['AI receptionist for restaurants', 'restaurant reservation system', 'automated booking software', 'food service AI']
  },

  consultants: {
    id: 'consultants',
    industryName: 'Consultants',
    displayName: 'Consulting Firms',
    slug: 'consultants',
    painPoints: [
      'Leads going to competitors due to slow response',
      'Admin staff answering phones instead of doing strategic work',
      'Missed international client calls',
      'No consistent lead qualification process',
      'Manual scheduling creating bottlenecks'
    ],
    useCase: 'Lead qualification and consultation booking for high-value consulting businesses',
    description: 'OpenAria qualifies inbound leads, understands project scope, and books consultations. Your team focuses on strategy and delivery, not lead intake.',
    features: [
      'Sophisticated lead qualification',
      'Project scope understanding',
      'Budget range discovery',
      'Timeline capture',
      'Consultant availability matching',
      'Follow-up scheduling'
    ],
    benefits: [
      'Qualify 3x more leads efficiently',
      'Reduce sales cycle by 40%',
      'Focus on high-quality prospects only',
      'Never miss a potential client'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Consulting Firms | OpenAria',
    metaDescription: 'Automated lead qualification and consultation booking for consultants. Never miss a high-value lead.',
    keywords: ['AI receptionist for consultants', 'lead qualification software', 'consulting sales automation', 'business development AI']
  },

  fitness: {
    id: 'fitness',
    industryName: 'Fitness',
    displayName: 'Gyms & Fitness Studios',
    slug: 'fitness',
    painPoints: [
      'Staff interrupted from training clients with phone calls',
      'Missed membership inquiries and sales',
      'No-shows hurting class attendance',
      'Trial class scheduling done manually',
      'Unable to handle after-hours signup requests'
    ],
    useCase: 'Membership inquiry handling and class booking for fitness businesses',
    description: 'OpenAria answers member inquiries, schedules trial classes, manages cancellations, and handles membership questions. Your trainers stay focused on fitness.',
    features: [
      'Membership tier explanation',
      'Trial class booking',
      'Class schedule management',
      'Cancellation handling',
      'Fitness goal consultation',
      'Referral inquiry handling'
    ],
    benefits: [
      'Increase trial class bookings by 50%',
      'Reduce no-shows with reminders',
      'Capture after-hours leads',
      'Improve member experience'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Gyms & Fitness Studios | OpenAria',
    metaDescription: 'Automated membership inquiry and class booking for fitness businesses. Never miss a signup again.',
    keywords: ['AI receptionist for gyms', 'fitness studio booking', 'gym membership inquiry', 'class scheduling software']
  },

  realestate: {
    id: 'realestate',
    industryName: 'Real Estate',
    displayName: 'Real Estate Agencies',
    slug: 'real-estate',
    painPoints: [
      'Agents in showings missing buyer calls',
      'Property inquiry details not captured consistently',
      'Slow response times losing leads to competitors',
      'Manual scheduling causing missed showings',
      'After-hours inquiries abandoned'
    ],
    useCase: 'Property inquiry handling and showing scheduling for real estate agents',
    description: 'OpenAria qualifies property inquiries, schedules showings, and captures buyer details—even after hours. Your agents focus on closing deals.',
    features: [
      'Property inquiry qualification',
      'Showing scheduling',
      'Buyer budget and preferences capture',
      'Neighborhood question answering',
      'MLS integration',
      'Follow-up scheduling'
    ],
    benefits: [
      'Increase property inquiries converted by 35%',
      'Schedule 3x more showings',
      'Never miss a hot lead',
      'Speed up sales cycles'
    ],
    cta: 'Start Your 14-Day Trial',
    metaTitle: 'Best AI Receptionist for Real Estate Agents | OpenAria',
    metaDescription: 'Automated property inquiry and showing scheduling for real estate businesses. Never miss a buyer.',
    keywords: ['AI receptionist for realtors', 'property inquiry automation', 'real estate lead management', 'showing scheduling software']
  },
};

// Get all industry slugs for static generation
export function getIndustrySlugs(): string[] {
  return Object.keys(INDUSTRY_SOLUTIONS);
}

// Get industry data by slug
export function getIndustryBySlug(slug: string): IndustrySolution | null {
  return INDUSTRY_SOLUTIONS[slug] || null;
}

// Get all industries sorted by name
export function getAllIndustries(): IndustrySolution[] {
  return Object.values(INDUSTRY_SOLUTIONS).sort((a, b) => 
    a.industryName.localeCompare(b.industryName)
  );
}
