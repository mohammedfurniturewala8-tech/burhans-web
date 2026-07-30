import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { fetchActiveHeroVideoUrl, DEFAULT_HERO_VIDEO_URL } from '../lib/supabase';

export const Hero: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string>(DEFAULT_HERO_VIDEO_URL);

  useEffect(() => {
    fetchActiveHeroVideoUrl().then((url) => {
      if (url) setVideoUrl(url);
    });
  }, []);

  return (
    <section className="relative w-full h-screen min-h-[600px] flex items-center justify-center overflow-hidden bg-[#0C0B0A]">
      {/* Full-bleed Showreel Video Element */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video
          key={videoUrl}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/images/hero_poster.jpg"
          className="w-full h-full object-cover object-center scale-100"
        />

        {/* Dark legibility overlay (rgba(12,11,10,0.55)) */}
        <div className="absolute inset-0 bg-[#0C0B0A]/55" />
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
