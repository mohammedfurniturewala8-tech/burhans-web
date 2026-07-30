import React from 'react';

export const TestimonialsSection: React.FC = () => {
  return (
    <section id="testimonials" className="py-24 bg-[#0C0B0A] relative border-b border-[#2A2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9C9890] block mb-2">
            Client Experience
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-[#F2F0EC]">
            Testimonials
          </h2>
        </div>

        {/* Empty State Placeholder Card */}
        <div className="max-w-xl mx-auto bg-[#1C1917] border border-[#2A2724] rounded-lg p-8 text-center space-y-3">
          <h3 className="font-display font-semibold text-base text-[#F2F0EC]">
            Client Feedback Coming Soon
          </h3>
          <p className="text-xs text-[#9C9890] leading-relaxed">
            Client quotes and post-production feedback are currently being aggregated.
          </p>
        </div>
      </div>
    </section>
  );
};
