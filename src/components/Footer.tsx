import React from 'react';
import { Mail, MessageCircle, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer id="contact" className="bg-[#141210] border-t border-[#2A2724] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Contact Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9C9890] block">
            Get in Touch
          </span>
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-[#F2F0EC]">
            Let’s Work Together
          </h2>
          <p className="text-sm text-[#9C9890]">
            Direct contact links for project inquiries and editing commissions.
          </p>
        </div>

        {/* 3 Contact Touch Targets */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mb-16">
          {/* Instagram */}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-lg bg-[#1C1917] border border-[#2A2724] hover:border-[#C9A227] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded bg-[#141210] border border-[#2A2724] flex items-center justify-center text-[#F2F0EC] mx-auto mb-3">
              <svg className="w-5 h-5 fill-current text-[#9C9890] group-hover:text-[#C9A227] transition-colors" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </div>
            <span className="font-display font-semibold text-sm text-[#F2F0EC] group-hover:text-[#C9A227] transition-colors flex items-center justify-center gap-1">
              <span>Instagram</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] text-[#9C9890] mt-0.5 font-mono block">@burhanuddinziya</span>
          </a>

          {/* Email */}
          <a
            href="mailto:burhanuddinziya@example.com"
            className="group p-6 rounded-lg bg-[#1C1917] border border-[#2A2724] hover:border-[#C9A227] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded bg-[#141210] border border-[#2A2724] flex items-center justify-center text-[#9C9890] group-hover:text-[#C9A227] transition-colors mx-auto mb-3">
              <Mail className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-sm text-[#F2F0EC] group-hover:text-[#C9A227] transition-colors flex items-center justify-center gap-1">
              <span>Email</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] text-[#9C9890] mt-0.5 font-mono block">burhanuddinziya@gmail.com</span>
          </a>

          {/* WhatsApp */}
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-lg bg-[#1C1917] border border-[#2A2724] hover:border-[#C9A227] transition-colors text-center"
          >
            <div className="w-10 h-10 rounded bg-[#141210] border border-[#2A2724] flex items-center justify-center text-[#9C9890] group-hover:text-[#C9A227] transition-colors mx-auto mb-3">
              <MessageCircle className="w-5 h-5" />
            </div>
            <span className="font-display font-semibold text-sm text-[#F2F0EC] group-hover:text-[#C9A227] transition-colors flex items-center justify-center gap-1">
              <span>WhatsApp</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            <span className="text-[11px] text-[#9C9890] mt-0.5 font-mono block">Quick Message</span>
          </a>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-[#2A2724] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#9C9890]">
          <span>© {new Date().getFullYear()} Burhanuddin Ziya. All rights reserved.</span>
          <span className="font-mono text-[11px]">Video Editing Portfolio</span>
        </div>
      </div>
    </footer>
  );
};
