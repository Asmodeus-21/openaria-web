import React from 'react';

const LOGOS = [
  "Apple", "Google", "Microsoft", "Amazon", "Netflix", "Meta", "Tesla", "Nvidia", 
  "IBM", "Oracle", "Samsung", "Adobe", "Salesforce", "Intel", "Sony", "Uber", 
  "Airbnb", "Stripe", "Shopify", "Zoom", "Slack", "LinkedIn", "PayPal", "Spotify", 
  "Dropbox", "Cisco", "Dell", "HP", "Atlassian", "Twilio", "TikTok", "Snap", 
  "Cloudflare", "VMware"
];

const LogoTicker: React.FC = () => {
  return (
    <div className="w-full overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>
      
      <div className="flex w-max animate-scroll hover:[animation-play-state:paused]">
        {/* Render the list twice to create seamless loop */}
        {[...LOGOS, ...LOGOS].map((logo, index) => (
          <div 
            key={index} 
            className="flex-shrink-0 mx-8 md:mx-12 py-4 opacity-40 hover:opacity-100 transition-opacity duration-300 cursor-default"
          >
            <span className="text-xl md:text-2xl font-bold font-sans text-slate-900 tracking-tight">
              {logo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LogoTicker;