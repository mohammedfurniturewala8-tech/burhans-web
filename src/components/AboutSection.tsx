import React from 'react';
import { SKILLS_TAGS } from '../data/projects';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-[#141210] border-t border-b border-[#2A2724] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column - Bio & Philosophy */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9C9890] block">
              About & Philosophy
            </span>

            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#F2F0EC]">
              Pacing, Sound, and Color.
            </h2>

            <p className="text-base text-[#9C9890] leading-relaxed">
              I’m <strong className="text-[#F2F0EC]">Burhanuddin Ziya</strong>, a video editor focused on narrative flow, retention, and clean post-production. I edit gaming montages, brand spots, anime music videos, and cinematic edits.
            </p>

            <p className="text-sm text-[#9C9890] leading-relaxed">
              Every cut is timed to sound design hit-markers, color-graded for visual atmosphere, and structured to hold viewer focus from the initial hook to final frame.
            </p>

            {/* Stat Cards - Plain text + thin border only */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
              <div className="p-4 rounded bg-[#1C1917] border border-[#2A2724]">
                <div className="font-display font-bold text-xl text-[#F2F2EC]">100+</div>
                <div className="text-xs text-[#9C9890] mt-1 font-mono">Edits Delivered</div>
              </div>

              <div className="p-4 rounded bg-[#1C1917] border border-[#2A2724]">
                <div className="font-display font-bold text-xl text-[#F2F0EC]">4K UHD</div>
                <div className="text-xs text-[#9C9890] mt-1 font-mono">60FPS Master</div>
              </div>

              <div className="p-4 rounded bg-[#1C1917] border border-[#2A2724]">
                <div className="font-display font-bold text-xl text-[#F2F0EC]">24–48h</div>
                <div className="text-xs text-[#9C9890] mt-1 font-mono">Turnaround</div>
              </div>
            </div>
          </div>

          {/* Right Column - Skills Stack */}
          <div className="lg:col-span-5 bg-[#1C1917] border border-[#2A2724] rounded-lg p-8 space-y-6">
            <div>
              <h3 className="font-display font-bold text-lg text-[#F2F0EC] mb-1">
                Post-Production Tools
              </h3>
              <p className="text-xs text-[#9C9890] font-mono">
                Software & Techniques
              </p>
            </div>

            {/* Skills Badges */}
            <div className="flex flex-wrap gap-2">
              {SKILLS_TAGS.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded bg-[#141210] border border-[#2A2724] text-xs text-[#9C9890]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
