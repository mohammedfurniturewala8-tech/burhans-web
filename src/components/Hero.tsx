import React from 'react';
import { ChevronDown } from 'lucide-react';
import Ferrofluid from './Ferrofluid';

export const Hero: React.FC = () => {
  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0C0B0A]">
      {/* Full-bleed Ferrofluid WebGL Background */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <Ferrofluid
          colors={["#C9A227", "#F2F0EC", "#C9A227"]}
          speed={0.5}
          scale={1.2}
          turbulence={1}
          fluidity={0.1}
          rimWidth={0.25}
          sharpness={3}
          shimmer={1.2}
          glow={2.2}
          flowDirection="down"
          opacity={0.85}
          mouseInteraction={true}
          mouseStrength={1.2}
          mouseRadius={0.35}
        />

        {/* Dark legibility overlay */}
        <div className="absolute inset-0 bg-[#0C0B0A]/40 pointer-events-none" />
      </div>

      {/* Hero Content Overlay */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        {/* Name */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-bold tracking-tight text-[#F2F0EC]">
          Burhanuddin Ziya
        </h1>

        {/* One-line Tagline */}
        <p className="text-lg sm:text-xl text-[#9C9890] max-w-2xl mx-auto font-normal leading-relaxed">
          Video Editor specializing in Gaming Montages, Brand Commercials, AMVs, Cinematic Edits, and Fast Cuts.
        </p>

        {/* Single Primary CTA Button */}
        <div className="pt-4">
          <a
            href="#work"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-[#C9A227] text-[#0C0B0A] font-semibold text-base hover:bg-[#b08d20] transition-colors shadow-none"
          >
            <span>Explore Work</span>
            <ChevronDown className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
};
