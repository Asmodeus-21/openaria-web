import React from 'react';
import { INDUSTRIES_DATA } from '../data/industriesSemanticData';

interface FooterProps {
  onNavigateLegal?: (page: 'privacy' | 'terms' | 'contact') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigateLegal }) => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded bg-blue-500 flex items-center justify-center font-serif font-bold text-sm">
                A
              </div>
              <span className="font-bold text-lg">ARIA</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              The world's #1 AI Receptionist transforming customer interactions.
            </p>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Product
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#features" className="text-slate-400 hover:text-white transition">
                Features
              </a>
              <a href="#pricing" className="text-slate-400 hover:text-white transition">
                Pricing
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition">
                Demo
              </a>
            </div>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Legal
            </h4>
            <div className="flex flex-col gap-3 text-sm">
              <button
                onClick={() => onNavigateLegal?.('privacy')}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Privacy Policy
              </button>
              <button
                onClick={() => onNavigateLegal?.('terms')}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Terms of Service
              </button>
              <button
                onClick={() => onNavigateLegal?.('contact')}
                className="text-slate-400 hover:text-white transition cursor-pointer text-left"
              >
                Contact
              </button>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Contact
            </h4>
            <div className="flex flex-col gap-3 text-sm text-slate-400">
              <div className="hover:text-white transition cursor-default">
                119 Scarlet Oak Dr.
                <br />
                Phoenixville, PA 19460
              </div>
              <a href="mailto:Open.aria.ai@gmail.com" className="hover:text-white transition">
                Open.aria.ai@gmail.com
              </a>
              <a href="tel:+15868002870" className="hover:text-white transition">
                +1 586 800 2870
              </a>
            </div>
          </div>

          {/* Industry Solutions - NEW COLUMN */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wide">
              Industry Solutions
            </h4>
            <div className="flex flex-col gap-2 text-sm">
              {INDUSTRIES_DATA.map((industry) => (
                <a
                  key={industry.slug}
                  href={`/solutions/${industry.slug}`}
                  className="text-slate-400 hover:text-blue-400 transition"
                >
                  AI for {industry.industryName}
                </a>
              ))}
              <a
                href="/solutions"
                className="text-blue-400 hover:text-blue-300 transition font-semibold mt-2"
              >
                View All →
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-800 pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ARIA AI Inc. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
