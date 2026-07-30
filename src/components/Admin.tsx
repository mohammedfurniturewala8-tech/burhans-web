import React, { useState, useEffect } from 'react';
import { Lock, Upload, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Film } from 'lucide-react';
import { fetchActiveHeroVideoUrl, uploadHeroVideoFile, DEFAULT_HERO_VIDEO_URL } from '../lib/supabase';

// NOTE: Hardcoded password for client-side password gate demonstration.
// THIS IS NOT SECURE SERVER-SIDE AUTHENTICATION. In production, use Supabase Auth or Vercel Auth.
const ADMIN_PASSWORD = 'ziya2026';

interface AdminProps {
  onNavigateHome: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigateHome }) => {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(DEFAULT_HERO_VIDEO_URL);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchActiveHeroVideoUrl().then((url) => setCurrentVideoUrl(url));
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setStatusMessage(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(10);
    setStatusMessage(null);

    const result = await uploadHeroVideoFile(selectedFile, (progress) => {
      setUploadProgress(progress);
    });

    setUploading(false);

    if (result.success && result.url) {
      setCurrentVideoUrl(result.url);
      setStatusMessage({
        type: 'success',
        text: 'Hero video successfully updated! Your changes are live on the homepage hero section.'
      });
      setSelectedFile(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to upload video. Please try again.'
      });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] text-[#F2F0EC] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1C1917] border border-[#2A2724] rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-[#141210] border border-[#2A2724] flex items-center justify-center mx-auto text-[#C9A227]">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#F2F0EC]">
              Admin Portal
            </h1>
            <p className="text-xs text-[#9C9890]">
              Enter access password to manage the active hero video showreel.
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9C9890] mb-2 uppercase">
                Password
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter admin password (ziya2026)"
                className="w-full px-4 py-3 rounded-lg bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-sm focus:outline-none focus:border-[#C9A227] transition-colors"
                autoFocus
              />
              {passwordError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Incorrect password. (Default demo: ziya2026)
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#C9A227] text-[#0C0B0A] font-semibold text-sm hover:bg-[#b08d20] transition-colors shadow-none"
            >
              Access Admin Panel
            </button>
          </form>

          <div className="pt-4 border-t border-[#2A2724] text-center">
            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-2 text-xs text-[#9C9890] hover:text-[#F2F0EC] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Portfolio</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0C0B0A] text-[#F2F0EC] p-6 sm:p-12">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2724] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#1C1917] border border-[#2A2724] flex items-center justify-center text-[#C9A227]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#F2F0EC]">
                Hero Video Management
              </h1>
              <p className="text-xs text-[#9C9890] font-mono">
                Supabase Storage Bucket: <span className="text-[#C9A227]">hero-videos</span>
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1C1917] border border-[#2A2724] text-xs font-medium text-[#F2F0EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Main Site</span>
          </button>
        </div>

        {/* Status Message */}
        {statusMessage && (
          <div
            className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
              statusMessage.type === 'success'
                ? 'bg-[#1C1917] border-[#C9A227] text-[#F2F0EC]'
                : 'bg-[#1C1917] border-red-500 text-red-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-[#C9A227] shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{statusMessage.text}</div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Active Video Preview */}
          <div className="bg-[#1C1917] border border-[#2A2724] rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-mono text-[#9C9890] uppercase tracking-wider">
              Active Hero Video Preview
            </h2>

            <div className="aspect-video bg-[#0C0B0A] rounded-lg overflow-hidden border border-[#2A2724] relative">
              <video
                src={currentVideoUrl}
                controls
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              />
            </div>

            <div className="text-xs text-[#9C9890] break-all bg-[#141210] p-3 rounded-lg border border-[#2A2724] font-mono">
              <span className="text-[#F2F0EC] block font-semibold mb-1">Current Active URL:</span>
              {currentVideoUrl}
            </div>
          </div>

          {/* Right Column: Upload New Video */}
          <div className="bg-[#1C1917] border border-[#2A2724] rounded-xl p-6 space-y-6">
            <h2 className="text-sm font-mono text-[#9C9890] uppercase tracking-wider">
              Upload New Hero Showreel
            </h2>

            <div className="space-y-4">
              <label className="block text-xs text-[#9C9890]">
                Select Video File (MP4 format recommended)
              </label>

              <input
                type="file"
                accept="video/mp4,video/quicktime,video/webm"
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-xs text-[#9C9890] file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#141210] file:text-[#F2F0EC] hover:file:bg-[#2A2724] file:cursor-pointer border border-[#2A2724] rounded-lg p-2 bg-[#141210]"
              />

              {selectedFile && (
                <div className="text-xs text-[#F2F0EC] bg-[#141210] p-3 rounded-lg border border-[#2A2724] font-mono">
                  <div><strong>Selected:</strong> {selectedFile.name}</div>
                  <div><strong>Size:</strong> {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              )}

              {uploading && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-[#9C9890]">
                    <span>Uploading to Supabase...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-[#141210] rounded-full h-2 overflow-hidden border border-[#2A2724]">
                    <div
                      className="bg-[#C9A227] h-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full py-3.5 rounded-lg bg-[#C9A227] text-[#0C0B0A] font-semibold text-sm hover:bg-[#b08d20] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Uploading Video...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Set as Active Hero</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
