import React, { useState, useEffect, useRef } from 'react';
import { Star, MapPin, Quote, ChevronLeft, ChevronRight, User } from 'lucide-react';
import { Testimonial } from '../types';

const TESTIMONIALS: Testimonial[] = [
  { id: 1, name: "Sarah Jenkins", role: "Clinic Director", location: "New York, USA", quote: "ARIA completely transformed our front desk. We haven't missed a single patient call in 3 months. Revenue is up 40%." },
  { id: 2, name: "David Chen", role: "Real Estate Broker", location: "Toronto, Canada", quote: "The speed is incredible. ARIA qualifies leads and books viewings before I even wake up. It's like having a team of 10." },
  { id: 3, name: "Marcus Weber", role: "Legal Firm Partner", location: "Berlin, Germany", quote: "Professional, secure, and incredibly smart. Our clients have no idea they are talking to an AI. Highly recommended." },
  { id: 4, name: "Amira K.", role: "Spa Owner", location: "Dubai, UAE", quote: "My staff costs dropped by 60% in the first month. ARIA handles everything—bookings, reminders, payments. It's flawless." },
  { id: 5, name: "James Wilson", role: "HVAC Business Owner", location: "Sydney, Australia", quote: "I used to miss calls while on jobs. Now ARIA books them instantly. I've never been busier." },
  { id: 6, name: "Elena Rodriguez", role: "Dental Practice Manager", location: "Madrid, Spain", quote: "The multilingual support is a game changer. ARIA speaks perfect Spanish and English to our patients." },
  { id: 7, name: "Priya Patel", role: "Consultancy Founder", location: "London, UK", quote: "Setup took 15 minutes. It integrated with my calendar and CRM immediately. The ROI is undeniable." },
  { id: 8, name: "Thomas Mueller", role: "Auto Shop Owner", location: "Munich, Germany", quote: "No more phone tag. ARIA answers, quotes, and books. It's the most reliable employee I have." },
  { id: 9, name: "Sophie Dubois", role: "Event Planner", location: "Paris, France", quote: "It handles hundreds of inquiries during peak season without breaking a sweat. Amazing technology." },
  { id: 10, name: "Kenji Sato", role: "Restaurant Manager", location: "Tokyo, Japan", quote: "Reservations are up 30%. The AI sounds so natural, customers love it." },
];

const TestimonialCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-advance
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // 6 seconds per slide
    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    if (fadeState === 'out') return;
    setFadeState('out');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
      setFadeState('in');
    }, 300); // Wait for fade out animation
  };

  const handlePrev = () => {
    if (fadeState === 'out') return;
    setFadeState('out');

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
      setFadeState('in');
    }, 300);
  };

  const goToIndex = (index: number) => {
    if (index === currentIndex || fadeState === 'out') return;
    setFadeState('out');
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      setCurrentIndex(index);
      setFadeState('in');
    }, 300);
  };

  const current = TESTIMONIALS[currentIndex];

  return (
    <div className="w-full max-w-5xl mx-auto px-4 relative">
       {/* Main Card Stage */}
       <div className="relative min-h-[450px] md:min-h-[400px] flex items-center justify-center">
          
          <div 
            className={`transition-all duration-500 ease-in-out transform w-full ${
              fadeState === 'out' 
                ? 'opacity-0 translate-y-8 scale-95' 
                : 'opacity-100 translate-y-0 scale-100'
            }`}
          >
             {/* The Card */}
             <div className="bg-white rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 md:p-14 text-center border border-slate-100 relative overflow-hidden group hover:shadow-[0_30px_80px_-20px_rgba(59,130,246,0.15)] transition-shadow duration-500">
                
                {/* Decorative Background Elements */}
                <Quote className="absolute top-8 left-10 text-slate-50 w-32 h-32 -z-0 rotate-12 transition-transform duration-700 group-hover:rotate-6 group-hover:scale-110" />
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50/50 to-transparent rounded-bl-full -z-0 pointer-events-none"></div>

                {/* Stars */}
                <div className="flex justify-center gap-2 mb-8 relative z-10">
                   {[1,2,3,4,5].map(s => (
                      <div key={s} className="relative drop-shadow-sm">
                         <Star className="w-6 h-6 text-amber-400 fill-amber-400" strokeWidth={1} />
                      </div>
                   ))}
                </div>

                {/* Quote Text */}
                <h3 className="text-2xl md:text-4xl font-medium text-slate-900 leading-snug mb-10 relative z-10 font-sans tracking-tight">
                   "{current.quote}"
                </h3>

                {/* Author Info Section */}
                <div className="flex flex-col items-center relative z-10">
                   {/* Avatar Placeholder */}
                   <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 text-white flex items-center justify-center text-xl font-bold mb-4 shadow-lg shadow-blue-500/30 ring-4 ring-white">
                      {current.name.charAt(0)}
                   </div>
                   
                   <div className="text-xl font-bold text-slate-900 mb-1">{current.name}</div>
                   <div className="text-base text-slate-500 font-medium mb-4">{current.role}</div>
                   
                   <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                      <MapPin size={12} className="text-blue-500" />
                      {current.location}
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Navigation Controls */}
       <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-12 px-4">
          
          {/* Left Arrow */}
          <button 
            onClick={handlePrev} 
            className="hidden md:flex p-4 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-lg hover:-translate-x-1 active:scale-95 group"
            aria-label="Previous testimonial"
          >
             <ChevronLeft size={24} className="group-hover:stroke-[3px]" />
          </button>
          
          {/* Dots Indicator */}
          <div className="flex gap-3">
             {TESTIMONIALS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => goToIndex(idx)}
                  className={`h-2.5 rounded-full transition-all duration-500 ease-out ${
                    idx === currentIndex 
                      ? 'w-10 bg-slate-900 shadow-md shadow-slate-900/20' 
                      : 'w-2.5 bg-slate-200 hover:bg-slate-300 hover:scale-125'
                  }`}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
             ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={handleNext} 
            className="hidden md:flex p-4 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all hover:shadow-lg hover:translate-x-1 active:scale-95 group"
            aria-label="Next testimonial"
          >
             <ChevronRight size={24} className="group-hover:stroke-[3px]" />
          </button>
       </div>
    </div>
  );
};

export default TestimonialCarousel;