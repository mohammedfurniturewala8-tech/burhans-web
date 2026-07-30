import React, { useState, useEffect } from 'react';
import { Film, Menu, X } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        scrolled
          ? 'bg-[#0C0B0A] border-b border-[#2A2724] py-4'
          : 'bg-[#0C0B0A]/90 py-5 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a
            href="#"
            className="flex items-center gap-3 text-left focus:outline-none"
          >
            <div className="w-8 h-8 rounded bg-[#1C1917] border border-[#2A2724] flex items-center justify-center text-[#F2F0EC]">
              <Film className="w-4 h-4 text-[#C9A227]" />
            </div>
            <div>
              <span className="font-display font-bold text-base text-[#F2F0EC] tracking-tight block">
                Burhanuddin Ziya
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#9C9890] uppercase block">
                Video Editor
              </span>
            </div>
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#work"
              className="text-sm font-medium text-[#9C9890] hover:text-[#C9A227] transition-colors"
            >
              Work
            </a>
            <a
              href="#about"
              className="text-sm font-medium text-[#9C9890] hover:text-[#C9A227] transition-colors"
            >
              About
            </a>
            <a
              href="#testimonials"
              className="text-sm font-medium text-[#9C9890] hover:text-[#C9A227] transition-colors"
            >
              Testimonials
            </a>
            <a
              href="#contact"
              className="text-sm font-medium text-[#9C9890] hover:text-[#C9A227] transition-colors"
            >
              Contact
            </a>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded bg-[#1C1917] border border-[#2A2724] text-[#F2F0EC] focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#141210] border-b border-[#2A2724] px-6 py-6 space-y-4">
          <a
            href="#work"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F2F0EC] hover:text-[#C9A227] py-2 border-b border-[#2A2724]"
          >
            Work
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F2F0EC] hover:text-[#C9A227] py-2 border-b border-[#2A2724]"
          >
            About
          </a>
          <a
            href="#testimonials"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F2F0EC] hover:text-[#C9A227] py-2 border-b border-[#2A2724]"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-medium text-[#F2F0EC] hover:text-[#C9A227] py-2"
          >
            Contact
          </a>
        </div>
      )}
    </header>
  );
};
