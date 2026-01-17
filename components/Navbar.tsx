import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import Button from './Button';
import { INDUSTRIES_DATA } from '../data/industriesSemanticData';

interface NavbarProps {
  onOpenForm: () => void;
  onOpenLive: () => void;
  onNavigateLegal?: (page: 'privacy' | 'terms' | 'contact') => void;
}

const Navbar: React.FC<NavbarProps> = ({ onOpenForm, onOpenLive, onNavigateLegal }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsDropdownOpen, setSolutionsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Top 5 highest-value industries
  const topIndustries = INDUSTRIES_DATA.slice(0, 5);

  const navLinks = [
    { name: 'How It Works', href: '/ai-receptionist' },
    { name: 'Features', href: '#features' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Testimonials', href: '#testimonials' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();

    // If it's a page link, navigate to it
    if (href.startsWith('/')) {
      window.location.href = href;
      setMobileMenuOpen(false);
      setSolutionsDropdownOpen(false);
      return;
    }

    // If it's a hash link, scroll to it
    const targetId = href.replace('#', '');
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
      setSolutionsDropdownOpen(false);
    }
  };

  const handleSolutionsClick = () => {
    window.location.href = '/solutions';
    setMobileMenuOpen(false);
    setSolutionsDropdownOpen(false);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white font-serif font-bold text-xl shadow-lg shadow-slate-900/10">
            A
          </div>
          <span className="font-semibold text-lg tracking-tight text-slate-900">ARIA</span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              {link.name}
            </a>
          ))}

          {/* Solutions Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Solutions
              <ChevronDown
                size={16}
                className={`transition-transform ${solutionsDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {/* Dropdown Menu */}
            <div
              className={`absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden transition-all duration-200 origin-top-left ${
                solutionsDropdownOpen
                  ? 'opacity-100 visible scale-100'
                  : 'opacity-0 invisible scale-95 pointer-events-none'
              }`}
            >
              <div className="py-2">
                {/* Top 5 Industries */}
                {topIndustries.map((industry) => (
                  <a
                    key={industry.slug}
                    href={`/solutions/${industry.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/solutions/${industry.slug}`;
                      setSolutionsDropdownOpen(false);
                    }}
                    className="block px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors border-l-2 border-transparent hover:border-blue-600"
                  >
                    <span className="font-medium">AI for {industry.industryName}</span>
                    <p className="text-xs text-slate-500 mt-1">
                      {industry.painPoints[0].substring(0, 50)}...
                    </p>
                  </a>
                ))}

                <div className="border-t border-slate-200 my-2"></div>

                {/* View All Link */}
                <a
                  href="/solutions"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSolutionsClick();
                  }}
                  className="block px-4 py-3 text-sm font-semibold text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  View All 9 Industries →
                </a>
              </div>
            </div>
          </div>
        </nav>

        {/* Desktop CTA Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            onClick={() => onOpenForm()}
            className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors"
          >
            Talk with ARIA
          </button>
          <Button size="sm" onClick={() => onOpenForm()}>
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-slate-900 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-xl flex flex-col gap-6">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="text-xl font-medium text-slate-900 cursor-pointer"
            >
              {link.name}
            </a>
          ))}

          {/* Mobile Solutions Section */}
          <div>
            <button
              onClick={() => setSolutionsDropdownOpen(!solutionsDropdownOpen)}
              className="flex items-center gap-2 text-xl font-medium text-slate-900 w-full"
            >
              Solutions
              <ChevronDown
                size={20}
                className={`transition-transform ${solutionsDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {solutionsDropdownOpen && (
              <div className="mt-4 ml-4 pl-4 border-l-2 border-blue-200 flex flex-col gap-3">
                {topIndustries.map((industry) => (
                  <a
                    key={industry.slug}
                    href={`/solutions/${industry.slug}`}
                    onClick={(e) => {
                      e.preventDefault();
                      window.location.href = `/solutions/${industry.slug}`;
                      setMobileMenuOpen(false);
                      setSolutionsDropdownOpen(false);
                    }}
                    className="text-sm text-slate-700 hover:text-blue-600 transition-colors"
                  >
                    {industry.industryName}
                  </a>
                ))}
                <a
                  href="/solutions"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/solutions';
                    setMobileMenuOpen(false);
                    setSolutionsDropdownOpen(false);
                  }}
                  className="text-sm font-semibold text-blue-600 mt-2"
                >
                  View All 9 Industries
                </a>
              </div>
            )}
          </div>

          <hr className="border-slate-100" />
          <Button
            variant="outline"
            fullWidth
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenForm();
            }}
          >
            Talk with ARIA
          </Button>
          <Button
            fullWidth
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenForm();
            }}
          >
            Get Started
          </Button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
