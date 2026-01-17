/**
 * Semantic SEO Data Architecture for Programmatic SEO Campaign
 * OpenAria AI Receptionist - Industry-Specific NLU Entity Enrichment
 * 
 * Design Principle: High Information Gain via Named Entities, Industry Jargon, and JTBD Triggers
 * Each industry vertical includes: domain-specific keywords, real software integrations,
 * FAQ schema for featured snippets, and conversion-aligned CTAs.
 */

// ============================================================================
// INTERFACES
// ============================================================================

export interface FAQItem {
  question: string;  // Industry-specific query aligned with entity keywords
  answer: string;    // Answer using domain terminology and product capabilities
}

export interface IndustryData {
  slug: string;      // URL-friendly identifier (e.g., 'dentists')
  industryName: string;  // Display name (e.g., 'Dentists')
  
  // SEO Optimization
  metaTitle: string;     // Format: "Best AI Receptionist for [Industry] | [Benefit] | OpenAria"
  metaDescription: string;
  
  // Conversion Optimization
  heroHeading: string;   // H1: Jobs-To-Be-Done focused (e.g., "Stop Missing Emergency Patients")
  heroSubheading: string;
  
  // Information Gain Layer
  painPoints: string[];  // 3 specific, industry-jargon pain points (NOT generic)
  entityKeywords: string[];  // 5-7 NLU entities (named entities, technical terms, domain jargon)
  softwareIntegrations: string[];  // 2-3 real CRMs/tools used by industry professionals
  
  // Schema.org FAQ - Featured Snippet Optimization
  faqSchema: FAQItem[];  // 3 Q&A pairs with industry-specific terminology
  
  // Call-to-Action - JTBD Aligned
  callToAction: string;  // e.g., "Secure More Retainers" vs "Fill Your Chair"
}

// ============================================================================
// INDUSTRY DATA - PRODUCTION READY
// ============================================================================

export const INDUSTRIES_DATA: IndustryData[] = [
  // ========================================================================
  // 1. DENTISTS
  // ========================================================================
  {
    slug: 'dentists',
    industryName: 'Dentists',
    metaTitle: 'Best AI Receptionist for Dentists | HIPAA-Compliant Call Answering | OpenAria',
    metaDescription: 'Automated patient intake and 24/7 emergency call answering for dental practices. Reduce no-shows, capture insurance info, and stay HIPAA-compliant.',
    
    heroHeading: 'Stop Missing Emergency Patients—Answer Every Call, 24/7',
    heroSubheading: 'HIPAA-compliant AI receptionist that handles patient intake, books appointments, and qualifies emergencies instantly.',
    
    painPoints: [
      'Emergency calls ringing unanswered during procedures, forcing staff to leave patients mid-treatment',
      'Manual patient intake creating HIPAA documentation gaps and compliance audit exposure',
      'Insurance verification inquiries backing up your front desk during peak hours',
    ],
    
    entityKeywords: [
      'Root canal emergency',
      'Invisalign consultation',
      'Insurance verification',
      'Emergency exam triage',
      'Patient retention',
      'Preventive care booking',
      'HIPAA-compliant data capture',
    ],
    
    softwareIntegrations: [
      'OpenDental (Practice Management)',
      'Dentrix (Clinical Platform)',
      'Curve Dental (Cloud-based PMS)',
    ],
    
    faqSchema: [
      {
        question: 'Is OpenAria HIPAA-compliant for dental patient records?',
        answer: 'Yes. OpenAria encrypts all patient data end-to-end, maintains audit logs for compliance, and integrates with HIPAA-certified PMS platforms like OpenDental and Dentrix to securely store insurance information, emergency notes, and appointment confirmations.',
      },
      {
        question: 'Can OpenAria qualify root canal emergencies and route them to on-call dentists?',
        answer: 'Absolutely. OpenAria asks symptom-specific questions (pain severity, swelling, previous trauma) to triage emergency exams, then routes qualified emergencies to your on-call dentist or off-hours answering service while booking urgent appointment slots in your Dentrix calendar.',
      },
      {
        question: 'How does OpenAria reduce patient no-shows for Invisalign consultations?',
        answer: 'OpenAria sends automated reminder calls 24 hours before appointments, confirms attendance, and logs patient preferences (treatment goals, material sensitivity) to improve consultation close rates and patient retention.',
      },
    ],
    
    callToAction: 'Eliminate Emergency Call Backlog',
  },

  // ========================================================================
  // 2. PLUMBERS (Home Services)
  // ========================================================================
  {
    slug: 'plumbers',
    industryName: 'Plumbers',
    metaTitle: 'Best AI Receptionist for Plumbers | 24/7 Emergency Dispatch | OpenAria',
    metaDescription: 'Automated emergency call handling and job scheduling for plumbing services. Answer calls instantly, qualify jobs, and dispatch technicians in real-time.',
    
    heroHeading: 'Never Miss a $500+ Emergency Call—Dispatch 24/7 Automatically',
    heroSubheading: 'AI receptionist that qualifies emergency plumbing calls, captures job details, and schedules technicians into ServiceTitan or Jobber in real-time.',
    
    painPoints: [
      'After-hours emergency calls rolling to voicemail or going to competitors while you sleep',
      'Dispatcher overwhelmed by 50+ inbound calls during peak hours, missing high-ticket jobs',
      'Manual job intake creating data entry errors and miscommunication between office and field technicians',
    ],
    
    entityKeywords: [
      'Emergency water leak',
      'Drain cleaning dispatch',
      'Water heater replacement',
      'Service call qualification',
      'Technician routing',
      'After-hours emergency triage',
      'Job estimation',
    ],
    
    softwareIntegrations: [
      'ServiceTitan (Field Service Platform)',
      'Jobber (Job Management & Scheduling)',
      'Housecall Pro (Mobile Dispatch)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria integrate with ServiceTitan to auto-schedule emergency calls?',
        answer: 'Yes. OpenAria captures emergency details (leak location, water pressure, access points), immediately syncs to your ServiceTitan calendar, assigns available technicians based on GPS proximity, and notifies your dispatcher and field team via push notification.',
      },
      {
        question: 'How does OpenAria qualify emergency vs. routine plumbing calls?',
        answer: 'OpenAria asks triage questions: flooding risk, gas line involvement, structural water damage. High-priority emergencies are routed to on-call technicians and bump routine jobs, while standard drain cleaning requests are scheduled for next available slots to maximize dispatcher efficiency.',
      },
      {
        question: 'Does OpenAria handle after-hours calls when your office is closed?',
        answer: 'Completely. OpenAria answers 24/7, captures emergency details, creates jobs in Jobber automatically, alerts your on-call technician via text/push, and sends the customer confirmation—all while you sleep, recovering lost revenue from unanswered calls.',
      },
    ],
    
    callToAction: 'Capture After-Hours Revenue',
  },

  // ========================================================================
  // 3. LAW FIRMS
  // ========================================================================
  {
    slug: 'lawyers',
    industryName: 'Law Firms',
    metaTitle: 'Best AI Receptionist for Law Firms | Protect Billable Hours | OpenAria',
    metaDescription: 'Professional AI receptionist that screens calls, qualifies legal consultation inquiries, and books appointments. Never interrupt attorney billable hours again.',
    
    heroHeading: 'Reclaim 10+ Billable Hours Weekly—Stop Attorneys Answering Phones',
    heroSubheading: 'AI receptionist that screens calls with legal expertise, qualifies case intake, and books qualified consultations automatically.',
    
    painPoints: [
      'Attorneys interrupted during $300+/hour billable work by intake calls, reducing realized revenue and client delivery quality',
      'Unqualified inbound calls wasting paralegal time on non-viable cases with no budget or timeline',
      'After-hours consultation inquiries lost to competitors because no one screens calls after 5 PM',
    ],
    
    entityKeywords: [
      'Legal consultation intake',
      'Retainer agreement',
      'Case qualification',
      'Contingency case screening',
      'Attorney availability booking',
      'Matter number assignment',
      'Conflict of interest screening',
    ],
    
    softwareIntegrations: [
      'Clio (Legal Case Management)',
      'MyCase (Practice Management)',
      'Lawmatics (Intake & CRM)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria qualify legal cases and screen for conflicts of interest?',
        answer: 'Yes. OpenAria asks structured intake questions (case type, opposing party, budget expectations, timeline), cross-references opposing party names against your Clio conflict database, and books only viable leads with qualified prospects to your attorney calendar.',
      },
      {
        question: 'How does OpenAria protect attorney billable time?',
        answer: 'OpenAria screens all inbound calls, qualifying case viability (contingency vs. fee-based, estimated value, timeline) before transferring to attorneys. Non-viable calls are logged but not transferred, recovering 8-12 billable hours weekly per attorney.',
      },
      {
        question: 'Does OpenAria handle after-hours legal consultations?',
        answer: 'Absolutely. OpenAria screens after-hours inquiries, captures case details, assigns matter numbers in Clio automatically, and sends prospects next available consultation times. Qualified leads are never lost to competitors, even outside business hours.',
      },
    ],
    
    callToAction: 'Reclaim Billable Hours',
  },

  // ========================================================================
  // 4. HAIR SALONS
  // ========================================================================
  {
    slug: 'salons',
    industryName: 'Hair Salons',
    metaTitle: 'Best AI Receptionist for Hair Salons | Fill Your Book, Reduce No-Shows | OpenAria',
    metaDescription: 'Automated appointment booking and no-show prevention for hair salons. Answer calls, book stylists instantly, and send reminder texts.',
    
    heroHeading: 'Fill Your Styling Chairs 40% Faster—Eliminate Phone Interruptions',
    heroSubheading: 'AI receptionist that books appointments, matches client preferences to stylists, and reduces no-shows with automated reminders.',
    
    painPoints: [
      'Stylists interrupted mid-blowout by ringing phone, losing focus and client satisfaction during premium services',
      'No-show rate cutting revenue 20-30% because there\'s no staff to confirm appointments 24 hours prior',
      'Manual booking creating double-bookings and stylist conflicts that require rescheduling and angry clients',
    ],
    
    entityKeywords: [
      'Stylist availability',
      'Hair color consultation',
      'Blow-out appointment',
      'Balayage service',
      'No-show prevention',
      'Stylist matching algorithm',
      'Upsell services (extensions, treatments)',
    ],
    
    softwareIntegrations: [
      'Vagaro (Salon Scheduling & CRM)',
      'StyleSeat (Independent Stylist Bookings)',
      'Square Appointments (POS Integration)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria match clients to stylists based on color specialty or technique?',
        answer: 'Yes. OpenAria learns stylist specialties (balayage, cutting, color correction) from your Vagaro profiles, asks clients about their desired service, and books matching stylists automatically. High-value clients requesting specific stylists get priority scheduling.',
      },
      {
        question: 'How does OpenAria reduce no-shows for salon appointments?',
        answer: 'OpenAria sends SMS confirmations at booking, reminder calls 24 hours before, and asks clients to confirm via text. No-show risk clients get rebooking offers 12 hours before. Salons report 50% reduction in no-shows with automated confirmations.',
      },
      {
        question: 'Can OpenAria upsell services when booking?',
        answer: 'Absolutely. OpenAria suggests add-on services (deep conditioning, root touch-ups, extensions) based on previous visit history in Vagaro, increasing average ticket value by 15-25% per appointment without staff effort.',
      },
    ],
    
    callToAction: 'Fill Your Book Faster',
  },

  // ========================================================================
  // 5. VETERINARY CLINICS
  // ========================================================================
  {
    slug: 'veterinarians',
    industryName: 'Veterinary Clinics',
    metaTitle: 'Best AI Receptionist for Vets | 24/7 Pet Emergency Triage | OpenAria',
    metaDescription: 'AI receptionist for veterinary clinics handling pet health inquiries, emergency triage, and appointment scheduling automatically.',
    
    heroHeading: 'Never Interrupt Vet Care Again—Answer Pet Emergencies 24/7',
    heroSubheading: 'AI receptionist that triages emergency calls, captures pet health details, and books appointments without pulling staff away from animal care.',
    
    painPoints: [
      'Veterinarians and technicians interrupted by phone calls during surgery or critical animal care, compromising patient safety',
      'Emergency pet calls going to voicemail after hours, forcing pet owners to seek rival emergency clinics',
      'Manual pet record capture missing vaccination history, medication interactions, and allergy information critical for diagnosis',
    ],
    
    entityKeywords: [
      'Pet emergency triage',
      'Vaccination schedule',
      'Prescription refill request',
      'Allergy documentation',
      'Microchip registration',
      'Surgical recovery boarding',
      'Chronic illness management',
    ],
    
    softwareIntegrations: [
      'ezyVet (Cloud-based Vet PMS)',
      'IDEXX Cornerstone (Veterinary Practice Software)',
      'Vetster (Telemedicine Integration)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria triage pet emergencies and route critical cases correctly?',
        answer: 'Yes. OpenAria asks symptom-specific questions (limping severity, vomiting/diarrhea, difficulty breathing, trauma) and assigns urgency flags in your ezyVet system. Critical emergencies are routed to on-call veterinarians with priority appointment slots while routine cases are scheduled normally.',
      },
      {
        question: 'How does OpenAria capture pet medical history without pulling staff from surgery?',
        answer: 'OpenAria asks callers about pet name, species, breed, symptoms, medications, and known allergies. Information is immediately logged in ezyVet with attachments (vaccination records, previous exams) so the veterinarian sees a complete picture before seeing the pet.',
      },
      {
        question: 'Can OpenAria handle prescription refill requests and vaccination reminders?',
        answer: 'Completely. OpenAria processes refill requests (matching med name to ezyVet records), alerts pharmacists for new prescriptions, and sends vaccination reminders to pet owners 2 weeks before due dates. Clinic revenue improves with preventive care compliance.',
      },
    ],
    
    callToAction: 'Prioritize Animal Care',
  },

  // ========================================================================
  // 6. RESTAURANTS & CATERING
  // ========================================================================
  {
    slug: 'restaurants',
    industryName: 'Restaurants',
    metaTitle: 'Best AI Receptionist for Restaurants | Maximize Table Turnover | OpenAria',
    metaDescription: 'AI reservation booking system for restaurants. Answer calls during service, reduce no-shows, and capture catering leads automatically.',
    
    heroHeading: 'Stop Servers from Leaving Tables—Book Reservations Automatically',
    heroSubheading: 'AI receptionist that books tables in real-time, sends no-show prevention reminders, and qualifies catering opportunities during peak service.',
    
    painPoints: [
      'Servers pulled from table service to answer phones during dinner rush, degrading customer experience and gratuity potential',
      'No-show reservations reducing table utilization and Saturday night revenue by 15-25%',
      'Catering inquiries going unanswered because no one has time to screen large party requests and budget conversations',
    ],
    
    entityKeywords: [
      'Table reservation',
      'Party size optimization',
      'Dietary restriction documentation',
      'Private dining inquiry',
      'Catering event planning',
      'Wine pairing service',
      'Peak time seating algorithm',
    ],
    
    softwareIntegrations: [
      'OpenTable (Reservation & Guest Management)',
      'Toast POS (Integrated Reservations & Payment)',
      'SevenRooms (Hospitality CRM)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria book reservations directly into OpenTable during peak service?',
        answer: 'Yes. OpenAria checks OpenTable availability in real-time, asks party size, date, time, and special requests (high chairs, private booth), then confirms reservation and sends guests confirmation text with parking/dress code info.',
      },
      {
        question: 'How does OpenAria reduce no-shows?',
        answer: 'OpenAria sends SMS confirmation at booking, reminder text 24 hours prior, and courtesy call 2 hours before. Guests confirm via text or phone. Chronic no-show guests are flagged in SevenRooms to require credit card guarantee on future bookings.',
      },
      {
        question: 'Can OpenAria qualify catering and group event inquiries?',
        answer: 'Absolutely. OpenAria asks event date, guest count, dietary needs (vegetarian, gluten-free), budget expectations, and desired menu style. Qualified catering leads are routed to management with deposit agreements pre-drafted in Toast or OpenTable.',
      },
    ],
    
    callToAction: 'Maximize Reservation Revenue',
  },

  // ========================================================================
  // 7. CONSULTANTS & AGENCIES
  // ========================================================================
  {
    slug: 'consultants',
    industryName: 'Consultants & Agencies',
    metaTitle: 'Best AI Receptionist for Consultants | Qualify High-Value Leads | OpenAria',
    metaDescription: 'Lead qualification and consultation booking for agencies and consultants. Identify high-value prospects instantly and accelerate sales cycles.',
    
    heroHeading: 'Qualify 3X More Leads While You Focus on Billable Work',
    heroSubheading: 'AI receptionist that screens consultations, discovers budgets, and books only high-probability prospects with decision-makers.',
    
    painPoints: [
      'Unqualified inbound calls wasting 30+ minutes per week discussing scope with prospects with no budget or timeline',
      'Slow lead response times losing deals to faster-responding competitors during critical decision windows',
      'No documentation of prospect budget, authority, pain points, and timeline causing sales reps to start from scratch',
    ],
    
    entityKeywords: [
      'Project scope discovery',
      'Budget constraint identification',
      'Decision-maker qualification',
      'Timeline urgency signal',
      'Competitor analysis',
      'Retainer engagement model',
      'Authority level assessment',
    ],
    
    softwareIntegrations: [
      'HubSpot (Inbound Lead Management)',
      'Pipedrive (Sales Pipeline Automation)',
      'Salesforce (Enterprise CRM)',
    ],
    
    faqSchema: [
      {
        question: 'How does OpenAria qualify consulting leads for budget and authority?',
        answer: 'OpenAria asks structured questions: project scope, estimated budget range, decision-making process, and timeline urgency. High-budget, time-sensitive prospects with C-suite authority are marked "qualified" in HubSpot; low-budget or exploratory calls are logged separately for nurture sequences.',
      },
      {
        question: 'Can OpenAria book consultations only with decision-makers?',
        answer: 'Yes. OpenAria identifies caller role (decision-maker vs. coordinator), confirms decision-making authority, and requests decision-maker attendance before booking slots. This eliminates no-shows and ensures sales calls are with buyers, not gatekeepers.',
      },
      {
        question: 'How does OpenAria accelerate the sales cycle?',
        answer: 'OpenAria captures project pain points, budget, timeline, and competitor context during intake, populating Pipedrive with sales-ready intel before your team calls. Sales reps skip qualification phases and move directly to value-add conversations.',
      },
    ],
    
    callToAction: 'Secure More Retainers',
  },

  // ========================================================================
  // 8. GYMS & FITNESS STUDIOS
  // ========================================================================
  {
    slug: 'fitness',
    industryName: 'Gyms & Fitness Studios',
    metaTitle: 'Best AI Receptionist for Gyms | Reduce No-Shows, Fill Classes | OpenAria',
    metaDescription: 'AI receptionist for fitness studios handling trial bookings, membership inquiries, and class confirmations. Reduce no-shows by 50%.',
    
    heroHeading: 'Fill Your Classes 40% Faster—Stop Interrupted Personal Training',
    heroSubheading: 'AI receptionist that books trial classes, confirms memberships, and prevents no-shows with automated reminders.',
    
    painPoints: [
      'Personal trainers interrupted during sessions by phone calls, breaking client focus and reducing session quality/upsell opportunities',
      'Trial class no-shows (40%+ rate) reducing conversion to paid membership and wasting instructor capacity',
      'Membership upgrade inquiries and cancellation retention calls going unanswered because staff are busy on the gym floor',
    ],
    
    entityKeywords: [
      'Trial class booking',
      'Membership tier selection',
      'Fitness goal consultation',
      'Cancellation prevention',
      'Personal training session',
      'Group class schedule',
      'No-show reduction algorithm',
    ],
    
    softwareIntegrations: [
      'Zen Planner (Gym & Fitness Scheduling)',
      'Mariana Tek (Class & Membership Management)',
      'Mindbody (Fitness Business Software)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria book trial classes directly into Zen Planner?',
        answer: 'Yes. OpenAria asks fitness level, goals (weight loss, muscle gain, flexibility), and preferred class times. Trial slots are reserved in Zen Planner automatically with instructor assignment. New members receive waiver links and class prep info via SMS.',
      },
      {
        question: 'How does OpenAria reduce trial class no-shows?',
        answer: 'OpenAria sends SMS confirmation at booking, reminder text 24 hours prior, and a courtesy call 2 hours before class with parking/parking info. Attendees confirm via text. Chronic no-show prospects get flagged for faster follow-up or referral to virtual trial options.',
      },
      {
        question: 'Can OpenAria handle membership upgrades and cancellation retention?',
        answer: 'Completely. OpenAria screens upgrade inquiries (current plan, budget, goals) and retention calls (cancellation reasons, contract terms). High-value upgrades are routed to membership sales; retention callers get discount offers scripted in real-time to reduce churn.',
      },
    ],
    
    callToAction: 'Fill Your Class Roster',
  },

  // ========================================================================
  // 9. REAL ESTATE AGENTS
  // ========================================================================
  {
    slug: 'real-estate',
    industryName: 'Real Estate Agents',
    metaTitle: 'Best AI Receptionist for Real Estate | Never Miss a Hot Buyer | OpenAria',
    metaDescription: 'AI receptionist for real estate agents handling property inquiries and showing scheduling. Capture leads instantly, 24/7.',
    
    heroHeading: 'Never Miss a Hot Buyer Inquiry—Answer Every Lead Instantly',
    heroSubheading: 'AI receptionist that qualifies property inquiries, schedules showings, and captures buyer data automatically.',
    
    painPoints: [
      'Agents in showings missing buyer calls or inquiries, losing deals to faster-responding competitors in critical buying windows',
      'Manual showing scheduling creating calendar conflicts and missed opportunities for same-day or evening viewings',
      'Buyer budget, timeline, and neighborhood preferences not documented, forcing agents to re-qualify during showing conversations',
    ],
    
    entityKeywords: [
      'Property inquiry',
      'Buyer qualification',
      'Showing availability scheduling',
      'Neighborhood amenity research',
      'Mortgage pre-qualification status',
      'MLS property details',
      'Commission structure negotiation',
    ],
    
    softwareIntegrations: [
      'Zillow Premier Agent (Lead Management)',
      'Follow Up Boss (CRM & Showing Automation)',
      'MLS Direct Integration (Regional Property Data)',
    ],
    
    faqSchema: [
      {
        question: 'Can OpenAria qualify buyer leads and capture pre-qualification status?',
        answer: 'Yes. OpenAria asks property type interest (single-family, condo, investment), price range, timeline (immediate vs. 6 months), and mortgage pre-qualification status. Qualified cash/pre-approved buyers are routed to top agents; exploratory buyers go to nurture sequences in Follow Up Boss.',
      },
      {
        question: 'How does OpenAria schedule showings without agent involvement?',
        answer: 'OpenAria checks agent availability in real-time, asks buyer preferred times and dates, confirms showing duration, captures buyer contact info and property interests. Showing confirmations with directions and property details are sent automatically via SMS/email.',
      },
      {
        question: 'Can OpenAria capture buyer preferences to help agents prepare?',
        answer: 'Completely. OpenAria asks about property must-haves (square footage, lot size, school district, HOA status, pet-friendly), neighborhood preferences, and lifestyle priorities. This intel is logged in Follow Up Boss so agents can curate comparable properties and anticipate objections.',
      },
    ],
    
    callToAction: 'Capture Hot Leads 24/7',
  },
];

// ============================================================================
// EXPORT UTILITIES
// ============================================================================

/**
 * Get industry data by slug
 */
export function getIndustryBySlug(slug: string): IndustryData | undefined {
  return INDUSTRIES_DATA.find(industry => industry.slug === slug);
}

/**
 * Get all industry slugs (for static generation)
 */
export function getAllIndustrySlugs(): string[] {
  return INDUSTRIES_DATA.map(industry => industry.slug);
}

/**
 * Get all industry names (for dropdown menus, etc.)
 */
export function getAllIndustryNames(): Record<string, string> {
  return INDUSTRIES_DATA.reduce(
    (acc, industry) => {
      acc[industry.slug] = industry.industryName;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Export type for use in components
 */
export type IndustryDataType = IndustryData;
