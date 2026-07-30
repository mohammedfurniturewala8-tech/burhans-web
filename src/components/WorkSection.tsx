import React, { useState } from 'react';
import { Play, Clock } from 'lucide-react';
import { PROJECTS, CATEGORIES, type CategoryFilter, type Project } from '../data/projects';

interface WorkSectionProps {
  onSelectProject: (project: Project) => void;
}

export const WorkSection: React.FC<WorkSectionProps> = ({ onSelectProject }) => {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');

  const filteredProjects = activeCategory === 'All'
    ? PROJECTS
    : PROJECTS.filter((p) => p.category === activeCategory);

  return (
    <section id="work" className="py-24 bg-[#0C0B0A] relative border-t border-[#2A2724]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-[#2A2724] pb-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#9C9890] block mb-2">
              Portfolio Grid
            </span>
            <h2 className="text-3xl sm:text-5xl font-display font-bold text-[#F2F0EC]">
              Selected Work
            </h2>
          </div>

          <p className="text-sm text-[#9C9890] max-w-md">
            Filter edits by category. Click any project card to open the modal video player preview.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded text-xs font-medium whitespace-nowrap transition-colors focus:outline-none ${
                  isActive
                    ? 'bg-[#C9A227] text-[#0C0B0A] font-semibold'
                    : 'bg-[#141210] text-[#9C9890] border border-[#2A2724] hover:text-[#F2F0EC] hover:border-[#9C9890]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group bg-[#1C1917] border border-[#2A2724] rounded-lg overflow-hidden cursor-pointer hover:border-[#C9A227] transition-colors flex flex-col"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-[#141210] overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                />

                {/* Simple Dark Overlay */}
                <div className="absolute inset-0 bg-[#0C0B0A]/40 group-hover:bg-[#0C0B0A]/20 transition-colors" />

                {/* Play Button Overlay */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-12 h-12 rounded-full bg-[#C9A227] text-[#0C0B0A] flex items-center justify-center">
                    <Play className="w-5 h-5 fill-current ml-0.5" />
                  </div>
                </div>

                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-[#0C0B0A]/90 text-[11px] font-mono text-[#F2F0EC] border border-[#2A2724] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#9C9890]" />
                  <span>{project.duration}</span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2 py-1 rounded bg-[#0C0B0A]/90 text-[11px] font-mono text-[#9C9890] border border-[#2A2724]">
                  {project.category}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-semibold text-base text-[#F2F0EC] group-hover:text-[#C9A227] transition-colors mb-2 line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-xs text-[#9C9890] leading-relaxed line-clamp-2 mb-4">
                    {project.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-[#2A2724]">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded bg-[#141210] text-[10px] font-mono text-[#9C9890] border border-[#2A2724]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
