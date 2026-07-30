import React, { useEffect } from 'react';
import { X, ExternalLink, Clock, Tag, UserCheck } from 'lucide-react';
import { formatDriveEmbedUrl } from '../lib/supabase';
import type { Project } from '../data/projects';

interface VideoModalProps {
  project: Project | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ project, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  const driveEmbedUrl = formatDriveEmbedUrl(project.driveFileId);
  const directDriveUrl = driveEmbedUrl.replace('/preview', '/view');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0C0B0A]/85 backdrop-none animate-in fade-in duration-150">
      {/* Modal Dialog Container */}
      <div className="relative w-full max-w-4xl bg-[#1C1917] border border-[#2A2724] rounded-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#2A2724] bg-[#141210]">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 rounded bg-[#1C1917] border border-[#2A2724] text-xs font-mono text-[#C9A227]">
              {project.category}
            </span>
            <h3 className="font-display font-semibold text-base text-[#F2F0EC] truncate max-w-md">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded bg-[#1C1917] text-[#9C9890] hover:text-[#F2F0EC] border border-[#2A2724] focus:outline-none"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Player Container */}
        <div className="relative w-full aspect-video bg-[#0C0B0A] border-b border-[#2A2724]">
          <iframe
            src={driveEmbedUrl}
            title={project.title}
            className="w-full h-full border-0"
            allow="autoplay; encrypted-media; fullscreen"
            allowFullScreen
          />
        </div>

        {/* Modal Content */}
        <div className="p-5 overflow-y-auto space-y-4 bg-[#1C1917]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#2A2724] pb-4">
            <div>
              <h4 className="text-lg font-display font-bold text-[#F2F0EC] mb-1">
                {project.title}
              </h4>
              <p className="text-xs text-[#9C9890] leading-relaxed max-w-2xl">
                {project.description}
              </p>
            </div>

            <a
              href={directDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded bg-[#141210] border border-[#2A2724] text-xs font-medium text-[#C9A227] hover:border-[#C9A227] transition-colors whitespace-nowrap"
            >
              <span>Drive Link</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-6 text-xs text-[#9C9890]">
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-[#9C9890]" />
              <span>Duration: <strong className="text-[#F2F0EC] font-mono">{project.duration}</strong></span>
            </div>

            {project.client && (
              <div className="flex items-center gap-2">
                <UserCheck className="w-3.5 h-3.5 text-[#9C9890]" />
                <span>Client: <strong className="text-[#F2F0EC]">{project.client}</strong></span>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Tag className="w-3.5 h-3.5 text-[#9C9890]" />
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded bg-[#141210] border border-[#2A2724] text-[10px] text-[#9C9890]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
