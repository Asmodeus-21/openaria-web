import React from 'react';
import { CheckCircle, Phone, Calendar, Zap, BarChart3, Lock, Globe, Clock } from 'lucide-react';
import Button from './Button';
import SEOHead from './SEOHead';
import { AI_RECEPTIONIST_META } from '../seo.config';
import { trackLeadEvent, trackInitiateCheckout } from '../utils/facebookPixel';

const AIReceptionistPage: React.FC<{ openForm: () => void; openLive: () => void }> = ({ openForm, openLive: _openLive }) => {
  return (
    <>
      <SEOHead metadata={AI_RECEPTIONIST_META} />

      <div className="bg-white">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              AI Receptionist That Actually Works
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              Stop missing calls. ARIA answers every customer call 24/7, qualifies leads, books appointments, and sends data straight to your CRM—automatically.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => {
                  trackInitiateCheckout('14-Day Trial - AI Receptionist', 97);
                  openForm();
                }}
              >
                Start 14-Day Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackLeadEvent('AI Receptionist - See Demo');
                  openForm();
                }}
              >
                See Demo
              </Button>
            </div>
          </div>
        </section>

        {/* Why AI Receptionist */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Why Missed Calls Kill Revenue
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Phone,
                title: 'Lost Leads = Lost Money',
                desc: 'On average, 75% of calls go unanswered in small businesses. Each missed call is a customer going to your competitor.'
              },
              {
                icon: Clock,
                title: '24/7 Availability',
                desc: 'Customers call outside business hours. Traditional receptionists can\'t answer after 5 PM. ARIA never sleeps.'
              },
              {
                icon: BarChart3,
                title: 'Qualification Matters',
                desc: 'Not all calls are valuable. ARIA qualifies leads in real-time, so your team focuses on hot prospects.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 rounded-lg border border-slate-200 hover:border-blue-500 transition">
                <item.icon className="text-blue-600 mb-4" size={32} />
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How ARIA Works */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
              How ARIA Works
            </h2>
            <div className="space-y-12">
              {[
                {
                  num: '1',
                  title: 'Call Comes In',
                  desc: 'Customer calls your business number. ARIA answers instantly on the first ring.'
                },
                {
                  num: '2',
                  title: 'ARIA Understands & Qualifies',
                  desc: 'Using advanced AI, ARIA understands the customer\'s intent, asks clarifying questions, and qualifies them as a lead.'
                },
                {
                  num: '3',
                  title: 'Books Appointments or Captures Info',
                  desc: 'If they need an appointment, ARIA checks your calendar and books instantly. Otherwise, ARIA captures their contact info.'
                },
                {
                  num: '4',
                  title: 'Sends Data to Your CRM',
                  desc: 'Lead info automatically syncs to GoHighLevel, Pipedrive, HubSpot, or your CRM of choice.'
                },
                {
                  num: '5',
                  title: 'You Follow Up',
                  desc: 'Your sales team gets the qualified lead and closes the deal. ARIA handles the heavy lifting.'
                }
              ].map((step, idx) => (
                <div key={idx} className="flex gap-8 items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-blue-600 text-white font-bold text-lg">
                      {step.num}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{step.title}</h3>
                    <p className="text-slate-600 text-lg">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            Powerful Features Built In
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              { icon: Phone, title: 'Inbound & Outbound Calls', desc: 'Handle incoming calls. Make outbound calls for follow-ups and campaigns.' },
              { icon: Calendar, title: 'Smart Appointment Booking', desc: 'Integrates with Google Calendar, Outlook, and booking systems. Instant confirmations.' },
              { icon: Zap, title: 'Real-Time CRM Sync', desc: 'Automatically push lead data to GoHighLevel, Pipedrive, HubSpot, Salesforce.' },
              { icon: Lock, title: 'Enterprise Security', desc: 'SOC2 compliant, GDPR ready, end-to-end encryption for all calls.' },
              { icon: Globe, title: '50+ Languages', desc: 'Native-level fluency in English, Spanish, French, Mandarin, and more.' },
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Track calls handled, leads captured, appointments booked, and revenue impact.' }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 border border-slate-200 rounded-lg">
                <feature.icon className="text-blue-600 mb-4" size={28} />
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
              Perfect For Any Industry
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: 'Real Estate',
                  bullets: [
                    'Qualify buyer/seller inquiries instantly',
                    'Schedule property showings automatically',
                    'Capture all leads 24/7'
                  ]
                },
                {
                  title: 'Healthcare',
                  bullets: [
                    'Schedule patient appointments',
                    'Handle insurance inquiries securely',
                    'HIPAA compliant call handling'
                  ]
                },
                {
                  title: 'Home Services (HVAC, Plumbing)',
                  bullets: [
                    'Emergency call routing 24/7',
                    'Instant service appointment scheduling',
                    'Technician dispatch automation'
                  ]
                },
                {
                  title: 'Law Firms',
                  bullets: [
                    'Qualify potential clients',
                    'Capture case details automatically',
                    'Route to appropriate attorney'
                  ]
                }
              ].map((useCase, idx) => (
                <div key={idx} className="p-8 bg-white rounded-lg border border-slate-200">
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{useCase.title}</h3>
                  <ul className="space-y-3">
                    {useCase.bullets.map((bullet, bidx) => (
                      <li key={bidx} className="flex gap-3 items-start">
                        <CheckCircle className="text-green-600 flex-shrink-0 mt-1" size={20} />
                        <span className="text-slate-700">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4 max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How does ARIA answer calls so fast?',
                a: 'ARIA uses Gemini 3.0, Google\'s most advanced AI model. It processes calls in under 100ms—faster than human reflexes. Calls are routed directly to ARIA without any delay.'
              },
              {
                q: 'Can ARIA understand accents and background noise?',
                a: 'Yes. ARIA is trained on millions of real-world conversations. It handles accents, background noise, interruptions, and complex speech patterns without issue.'
              },
              {
                q: 'What if a customer needs a human?',
                a: 'ARIA can transfer to a human agent instantly. You control the handoff conditions (e.g., if the customer asks for a human, or if the issue is too complex).'
              },
              {
                q: 'How does ARIA book appointments?',
                a: 'ARIA integrates with Google Calendar, Outlook, Calendly, and most booking systems. When a customer requests an appointment, ARIA checks real-time availability and books instantly.'
              },
              {
                q: 'Is my call data secure?',
                a: 'Yes. ARIA is SOC2 Type II compliant, GDPR ready, and uses end-to-end encryption for all calls. Your data never leaves secure servers.'
              },
              {
                q: 'What\'s the setup time?',
                a: 'Minutes. We send you a new phone number or port your existing one. Connect your CRM, calendar, and you\'re live. Most customers go live in under 24 hours.'
              }
            ].map((faq, idx) => (
              <details key={idx} className="p-6 bg-slate-50 rounded-lg cursor-pointer group">
                <summary className="font-bold text-lg text-slate-900 flex justify-between items-center">
                  {faq.q}
                  <span className="text-slate-400 group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="text-slate-700 mt-4 leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-blue-600 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Ready to Stop Missing Calls?</h2>
            <p className="text-xl mb-8 opacity-90">
              Try ARIA free for 14 days. No credit card required. See exactly how much revenue you're leaving on the table.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => {
                  trackInitiateCheckout('Free Trial - AI Receptionist Footer', 97);
                  openForm();
                }}
                className="bg-white text-blue-600 hover:bg-slate-100"
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackLeadEvent('AI Receptionist - Schedule Demo');
                  openForm();
                }}
                className="border-white text-white hover:bg-blue-700"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AIReceptionistPage;
