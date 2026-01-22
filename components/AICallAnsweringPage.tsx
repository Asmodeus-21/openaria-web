import React from 'react';
import { Zap, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import Button from './Button';
import SEOHead from './SEOHead';
import { AI_CALL_ANSWERING_META } from '../seo.config';
import { trackLeadEvent, trackInitiateCheckout } from '../utils/facebookPixel';

const AICallAnsweringPage: React.FC<{ openForm: () => void; openLive: () => void }> = ({ openForm, openLive: _openLive }) => {
  return (
    <>
      <SEOHead metadata={AI_CALL_ANSWERING_META} />

      <div className="bg-white">
        {/* Hero */}
        <section className="pt-24 pb-16 px-4 bg-gradient-to-b from-slate-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 mb-6">
              AI Call Answering Service
            </h1>
            <p className="text-xl text-slate-600 mb-8 leading-relaxed">
              ARIA answers 100% of your calls 24/7, even on weekends and holidays. Capture every lead, qualify customers, and grow your business without hiring.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => {
                  trackInitiateCheckout('14-Day Trial - AI Call Answering', 97);
                  openForm();
                }}
              >
                Start 14-Day Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  trackLeadEvent('AI Call Answering - Watch Demo');
                  openForm();
                }}
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        {/* The Problem */}
        <section className="py-20 px-4 bg-red-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
              The Hidden Cost of Missed Calls
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: AlertCircle,
                  stat: '75%',
                  desc: 'of small business calls go unanswered. Each one is money left on the table.'
                },
                {
                  icon: Users,
                  stat: '40%',
                  desc: 'of customers will never call back after one missed call. They\'ll call your competitor instead.'
                },
                {
                  icon: Clock,
                  stat: '24/7',
                  desc: 'customers call outside business hours. Traditional receptionists can\'t handle this volume.'
                }
              ].map((item, idx) => (
                <div key={idx} className="p-8 bg-white rounded-lg border-2 border-red-200">
                  <item.icon className="text-red-600 mb-4" size={32} />
                  <div className="text-4xl font-bold text-red-600 mb-2">{item.stat}</div>
                  <p className="text-slate-700">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-16 text-center">
            How AI Call Answering Works
          </h2>
          <div className="space-y-8">
            {[
              {
                title: 'Instant Answer',
                desc: 'ARIA answers on the first ring. No hold music. No "press 1 for...". Instant, professional greeting tailored to your business.'
              },
              {
                title: 'Understand the Need',
                desc: 'ARIA asks intelligent questions to understand what the customer needs. It processes natural language, accents, background noise—perfectly.'
              },
              {
                title: 'Capture Lead Information',
                desc: 'ARIA captures the customer\'s name, phone, email, and reason for calling. All data is instantly logged and sent to your CRM.'
              },
              {
                title: 'Schedule if Possible',
                desc: 'If the customer needs an appointment, ARIA checks your live calendar and books it right then. Automatic confirmation sent via email/SMS.'
              },
              {
                title: 'Escalate to You if Needed',
                desc: 'For complex issues or VIP customers, ARIA transfers the call to you instantly with full context about the conversation.'
              }
            ].map((item, idx) => (
              <div key={idx} className="p-8 border-l-4 border-blue-600 bg-slate-50 rounded-r-lg">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-700 text-lg">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What Gets Captured */}
        <section className="py-20 px-4 bg-blue-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
              What ARIA Captures from Every Call
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                'Caller\'s name, phone, and email',
                'Reason for calling / Intent',
                'Budget or timeline information',
                'Pain points and objections',
                'Appointment preferences and slots',
                'Follow-up actions required'
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start p-6 bg-white rounded-lg">
                  <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                  <p className="text-slate-700 text-lg">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CRM Integration */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Works With Your Favorite Tools
          </h2>
          <div className="grid md:grid-cols-4 gap-6 text-center">
            {[
              'GoHighLevel',
              'Pipedrive',
              'HubSpot',
              'Salesforce',
              'Zoho CRM',
              'Calendly',
              'Google Calendar',
              'Outlook'
            ].map((tool, idx) => (
              <div key={idx} className="p-6 border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800">
                {tool}
              </div>
            ))}
          </div>
          <p className="text-center text-slate-600 mt-8 text-lg">
            Not seeing your tool? We integrate with any system via Zapier, webhook, or custom API.
          </p>
        </section>

        {/* ROI */}
        <section className="py-20 px-4 bg-green-50">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
              Real ROI Examples
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  business: 'Real Estate Agency',
                  metrics: [
                    '400 calls/month → 380 answered (was 100)',
                    '38 qualified leads/month',
                    'Plus 15 appointments booked automatically',
                    '~$4,500/month new revenue'
                  ]
                },
                {
                  business: 'HVAC Contractor',
                  metrics: [
                    '200 calls/month → 195 answered',
                    '30+ emergency calls handled 24/7',
                    '25 service appointments auto-scheduled',
                    '~$3,200/month in additional revenue'
                  ]
                },
                {
                  business: 'Law Firm',
                  metrics: [
                    '150 calls/month → 145 answered',
                    '20 qualified client inquiries',
                    '8 new cases per month (avg $1,500 each)',
                    '~$12,000/month new revenue'
                  ]
                }
              ].map((example, idx) => (
                <div key={idx} className="p-8 bg-white rounded-lg border border-green-200">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{example.business}</h3>
                  <ul className="space-y-3">
                    {example.metrics.map((metric, midx) => (
                      <li key={midx} className="text-slate-700 flex gap-2">
                        <Zap className="text-green-600 flex-shrink-0 mt-0.5" size={18} />
                        <span>{metric}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose ARIA */}
        <section className="py-20 px-4 max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-slate-900 mb-12 text-center">
            Why ARIA Beats Other Call Answering Services
          </h2>
          <div className="space-y-4">
            {[
              { title: 'Zero Training', desc: 'Unlike human receptionists, ARIA needs no training. Set it up and it\'s immediately productive.' },
              { title: 'Perfect Consistency', desc: 'Never tired, never sick, never makes mistakes. Every call is handled with the same professionalism.' },
              { title: 'Scales Instantly', desc: 'Handle 1 call or 100 concurrent calls. No hiring, no overhead. Same flat price.' },
              { title: 'Available 24/7/365', desc: 'Nights, weekends, holidays. ARIA never closes. Human receptionists can\'t compete.' },
              { title: 'Data Goes Straight to Your CRM', desc: 'No manual data entry. Lead info automatically syncs with GoHighLevel, Pipedrive, etc.' },
              { title: 'Intelligent Routing', desc: 'Complex calls? ARIA routes to the right department or person instantly.' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-6 p-6 border border-slate-200 rounded-lg hover:border-blue-500 transition">
                <CheckCircle className="text-blue-600 flex-shrink-0 mt-1" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-slate-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-20 px-4 bg-blue-600 text-white text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold mb-6">Never Miss Another Call</h2>
            <p className="text-xl mb-8 opacity-90">
              Get ARIA set up in minutes. See real results in your first week. Risk-free 14-day trial.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button
                size="lg"
                onClick={() => {
                  trackInitiateCheckout('Free Trial - AI Call Answering Footer', 97);
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
                  trackLeadEvent('AI Call Answering - Talk to ARIA');
                  openForm();
                }}
                className="border-white text-white hover:bg-blue-700"
              >
                Talk to ARIA
              </Button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default AICallAnsweringPage;
