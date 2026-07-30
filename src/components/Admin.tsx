import React, { useState, useEffect } from 'react';
import { Upload, CheckCircle, AlertCircle, ArrowLeft, RefreshCw, Film, Plus, Edit2, Trash2, ArrowUp, ArrowDown, X, Phone } from 'lucide-react';
import { 
  fetchActiveHeroVideoUrl, 
  uploadHeroVideoFile, 
  DEFAULT_HERO_VIDEO_URL,
  fetchPortfolioVideos,
  uploadThumbnailFile,
  addPortfolioVideo,
  updatePortfolioVideo,
  deletePortfolioVideo,
  updateVideosSortOrder,
  formatDriveEmbedUrl,
  type DbPortfolioVideo
} from '../lib/supabase';

// NOTE: Hardcoded phone number for client-side authorization gate demonstration.
// THIS IS NOT SECURE SERVER-SIDE AUTHENTICATION. In production, use SMS OTP or Supabase Auth.
const ADMIN_PHONE_NUMBER = '8788352487';

const PORTFOLIO_CATEGORIES = ['Gaming', 'Corporate/Brand', 'Music/AMV', 'Cinematic', 'Fast Cuts'];

interface AdminProps {
  onNavigateHome: () => void;
}

export const Admin: React.FC<AdminProps> = ({ onNavigateHome }) => {
  const [phoneInput, setPhoneInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  // Hero Video States
  const [currentVideoUrl, setCurrentVideoUrl] = useState<string>(DEFAULT_HERO_VIDEO_URL);
  const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadHeroProgress, setUploadHeroProgress] = useState(0);

  // Portfolio Video States
  const [videos, setVideos] = useState<DbPortfolioVideo[]>([]);
  const [loadingVideos, setLoadingVideos] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form Modals States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<DbPortfolioVideo | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCategory, setFormCategory] = useState('Gaming');
  const [formDriveUrl, setFormDriveUrl] = useState('');
  const [selectedThumbFile, setSelectedThumbFile] = useState<File | null>(null);
  const [existingThumbUrl, setExistingThumbUrl] = useState('');
  const [uploadingThumb, setUploadingThumb] = useState(false);
  const [uploadThumbProgress, setUploadThumbProgress] = useState(0);

  useEffect(() => {
    fetchActiveHeroVideoUrl().then((url) => setCurrentVideoUrl(url));
    loadVideos();
  }, []);

  const loadVideos = async () => {
    setLoadingVideos(true);
    const data = await fetchPortfolioVideos();
    setVideos(data);
    setLoadingVideos(false);
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDigits = phoneInput.replace(/\D/g, '');
    if (cleanDigits === ADMIN_PHONE_NUMBER || cleanDigits.endsWith(ADMIN_PHONE_NUMBER)) {
      setIsAuthenticated(true);
      setPhoneError(false);
    } else {
      setPhoneError(true);
    }
  };

  // Hero Upload
  const handleHeroUpload = async () => {
    if (!selectedHeroFile) return;
    setUploadingHero(true);
    setUploadHeroProgress(10);
    setStatusMessage(null);

    const result = await uploadHeroVideoFile(selectedHeroFile, (progress) => {
      setUploadHeroProgress(progress);
    });

    setUploadingHero(false);
    if (result.success && result.url) {
      setCurrentVideoUrl(result.url);
      setStatusMessage({
        type: 'success',
        text: 'Hero video successfully updated and saved!'
      });
      setSelectedHeroFile(null);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to upload video.'
      });
    }
  };

  // Open Form modal for Add
  const handleOpenAdd = () => {
    setEditingVideo(null);
    setFormTitle('');
    setFormDescription('');
    setFormCategory('Gaming');
    setFormDriveUrl('');
    setSelectedThumbFile(null);
    setExistingThumbUrl('');
    setStatusMessage(null);
    setIsFormOpen(true);
  };

  // Open Form modal for Edit
  const handleOpenEdit = (video: DbPortfolioVideo) => {
    setEditingVideo(video);
    setFormTitle(video.title);
    setFormDescription(video.description);
    setFormCategory(video.category);
    setFormDriveUrl(video.drive_url);
    setSelectedThumbFile(null);
    setExistingThumbUrl(video.thumbnail_url);
    setStatusMessage(null);
    setIsFormOpen(true);
  };

  // Save Add/Edit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle || !formDescription || !formDriveUrl) {
      setStatusMessage({ type: 'error', text: 'Please fill in all text fields.' });
      return;
    }

    setUploadingThumb(true);
    setUploadThumbProgress(10);

    let thumbnailUrl = existingThumbUrl;

    // If new thumbnail selected, upload it
    if (selectedThumbFile) {
      const result = await uploadThumbnailFile(selectedThumbFile, (progress) => {
        setUploadThumbProgress(progress);
      });
      if (result.success && result.url) {
        thumbnailUrl = result.url;
      } else {
        setUploadingThumb(false);
        setStatusMessage({ type: 'error', text: result.error || 'Thumbnail upload failed.' });
        return;
      }
    }

    if (!thumbnailUrl) {
      setUploadingThumb(false);
      setStatusMessage({ type: 'error', text: 'Thumbnail cover image is required.' });
      return;
    }

    // Embed format check for Drive links
    const embedDriveUrl = formatDriveEmbedUrl(formDriveUrl);

    const videoData: DbPortfolioVideo = {
      title: formTitle,
      description: formDescription,
      category: formCategory,
      drive_url: embedDriveUrl,
      thumbnail_url: thumbnailUrl,
      sort_order: editingVideo ? editingVideo.sort_order : videos.length
    };

    let saveResult;
    if (editingVideo && editingVideo.id) {
      saveResult = await updatePortfolioVideo(editingVideo.id, videoData);
    } else {
      saveResult = await addPortfolioVideo(videoData);
    }

    setUploadingThumb(false);
    setIsFormOpen(false);

    if (saveResult.success) {
      setStatusMessage({
        type: 'success',
        text: editingVideo ? 'Video item updated successfully!' : 'New video item added successfully!'
      });
      loadVideos();
    } else {
      setStatusMessage({
        type: 'error',
        text: saveResult.error || 'Failed to save portfolio video.'
      });
    }
  };

  // Delete Video item
  const handleDelete = async (video: DbPortfolioVideo) => {
    if (!video.id) return;
    const confirm = window.confirm(`Delete "${video.title}"? This can't be undone.`);
    if (!confirm) return;

    setStatusMessage(null);
    const result = await deletePortfolioVideo(video.id, video.thumbnail_url);
    if (result.success) {
      setStatusMessage({ type: 'success', text: 'Video item deleted successfully!' });
      loadVideos();
    } else {
      setStatusMessage({ type: 'error', text: result.error || 'Failed to delete video.' });
    }
  };

  // Reorder sorting (Up/Down arrow triggers)
  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= videos.length) return;

    const list = [...videos];
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;

    // Local update
    setVideos(list);

    // Save list sort order to Supabase
    const result = await updateVideosSortOrder(list);
    if (!result.success) {
      setStatusMessage({ type: 'error', text: result.error || 'Failed to save updated sorting.' });
      loadVideos();
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0B0A] text-[#F2F0EC] flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-[#1C1917] border border-[#2A2724] rounded-xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-lg bg-[#141210] border border-[#2A2724] flex items-center justify-center mx-auto text-[#C9A227]">
              <Phone className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl font-bold text-[#F2F0EC]">
              Admin Verification
            </h1>
            <p className="text-xs text-[#9C9890]">
              Enter authorized admin phone number to access control panel.
            </p>
          </div>

          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-[#9C9890] mb-2 uppercase">
                Admin Phone Number
              </label>
              <input
                type="tel"
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                placeholder="Enter phone number (e.g. 8788352487)"
                className="w-full px-4 py-3 rounded-lg bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-sm focus:outline-none focus:border-[#C9A227] transition-colors font-mono"
                autoFocus
              />
              {phoneError && (
                <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Unauthorized phone number. Access denied.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-[#C9A227] text-[#0C0B0A] font-semibold text-sm hover:bg-[#b08d20] transition-colors"
            >
              Verify & Unlock Admin Panel
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
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2A2724] pb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-[#1C1917] border border-[#2A2724] flex items-center justify-center text-[#C9A227]">
              <Film className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-[#F2F0EC]">
                Burhanuddin Ziya Control Room
              </h1>
              <p className="text-xs text-[#9C9890] font-mono">
                Supabase Connected Site Panel
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded bg-[#1C1917] border border-[#2A2724] text-xs font-medium text-[#F2F0EC] hover:border-[#C9A227] hover:text-[#C9A227] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>View Homepage</span>
          </button>
        </div>

        {/* Status Alerts */}
        {statusMessage && (
          <div
            className={`p-4 rounded border text-sm flex items-start gap-3 ${
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

        {/* Section 1: Hero Video Uploader */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-6 bg-[#1C1917] border border-[#2A2724] rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-mono text-[#9C9890] uppercase tracking-wider">
              Active Hero Video
            </h2>
            <div className="aspect-video bg-[#0C0B0A] rounded overflow-hidden border border-[#2A2724]">
              <video src={currentVideoUrl} controls autoPlay muted loop playsInline className="w-full h-full object-cover" />
            </div>
            <div className="text-[11px] text-[#9C9890] break-all font-mono bg-[#141210] p-2.5 rounded border border-[#2A2724]">
              {currentVideoUrl}
            </div>
          </div>

          <div className="md:col-span-6 bg-[#1C1917] border border-[#2A2724] rounded-lg p-6 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="text-sm font-mono text-[#9C9890] uppercase tracking-wider mb-3">
                Upload Hero Showreel (MP4)
              </h2>
              <input
                type="file"
                accept="video/mp4"
                onChange={(e) => setSelectedHeroFile(e.target.files?.[0] || null)}
                disabled={uploadingHero}
                className="block w-full text-xs text-[#9C9890] file:mr-4 file:py-2 file:px-3 file:rounded file:border-0 file:bg-[#141210] file:text-[#F2F0EC] hover:file:bg-[#2A2724] border border-[#2A2724] rounded p-2 bg-[#141210]"
              />
              {uploadingHero && (
                <div className="space-y-2 pt-4">
                  <div className="w-full bg-[#141210] rounded h-1.5 overflow-hidden border border-[#2A2724]">
                    <div className="bg-[#C9A227] h-full transition-all duration-300" style={{ width: `${uploadHeroProgress}%` }} />
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={handleHeroUpload}
              disabled={!selectedHeroFile || uploadingHero}
              className="w-full py-3 rounded bg-[#C9A227] text-[#0C0B0A] font-semibold text-sm hover:bg-[#b08d20] disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" />
              <span>{uploadingHero ? 'Uploading Hero Video...' : 'Upload & Set Active Hero'}</span>
            </button>
          </div>
        </div>

        {/* Section 2: Portfolio Videos CRUD list */}
        <div className="bg-[#1C1917] border border-[#2A2724] rounded-lg p-6 space-y-6">
          <div className="flex items-center justify-between border-b border-[#2A2724] pb-4">
            <div>
              <h2 className="text-lg font-display font-bold text-[#F2F0EC]">
                Portfolio Video Grid
              </h2>
              <p className="text-xs text-[#9C9890]">
                Add, remove, and adjust sorting order of the portfolio works.
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-[#C9A227] text-[#0C0B0A] font-semibold text-xs hover:bg-[#b08d20] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Video</span>
            </button>
          </div>

          {loadingVideos ? (
            <div className="text-center py-12 text-[#9C9890] flex items-center justify-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#C9A227]" />
              <span>Loading grid dataset...</span>
            </div>
          ) : videos.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-[#2A2724] rounded-lg text-[#9C9890] text-sm">
              No videos added yet. Click "Add New Video" to build your portfolio grid.
            </div>
          ) : (
            <div className="space-y-3">
              {videos.map((video, idx) => (
                <div
                  key={video.id || idx}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#141210] border border-[#2A2724] rounded-lg hover:border-[#9C9890] transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-20 aspect-video object-cover rounded bg-[#1C1917] border border-[#2A2724]"
                    />
                    <div className="text-left">
                      <span className="px-2 py-0.5 rounded bg-[#1C1917] border border-[#2A2724] text-[10px] font-mono text-[#C9A227]">
                        {video.category}
                      </span>
                      <h3 className="font-display font-semibold text-sm text-[#F2F0EC] mt-1">
                        {video.title}
                      </h3>
                      <p className="text-[11px] text-[#9C9890] line-clamp-1 max-w-md">
                        {video.description}
                      </p>
                    </div>
                  </div>

                  {/* Controls / Edit / Delete / Sort buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="flex items-center border border-[#2A2724] rounded bg-[#1C1917] overflow-hidden">
                      <button
                        onClick={() => handleMove(idx, 'up')}
                        disabled={idx === 0}
                        className="p-2 text-[#9C9890] hover:text-[#C9A227] disabled:opacity-30"
                        title="Move Up"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 'down')}
                        disabled={idx === videos.length - 1}
                        className="p-2 text-[#9C9890] hover:text-[#C9A227] disabled:opacity-30 border-l border-[#2A2724]"
                        title="Move Down"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => handleOpenEdit(video)}
                      className="p-2 rounded bg-[#1C1917] border border-[#2A2724] text-[#9C9890] hover:text-[#C9A227] hover:border-[#C9A227] transition-colors"
                      title="Edit Item"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDelete(video)}
                      className="p-2 rounded bg-[#1C1917] border border-[#2A2724] text-red-400 hover:bg-red-950/20 hover:border-red-500 transition-colors"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Video Modal Popup */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0C0B0A]/85 backdrop-none animate-in fade-in duration-150 overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#1C1917] border border-[#2A2724] rounded-lg p-6 shadow-2xl space-y-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#2A2724] pb-4">
              <h2 className="font-display font-bold text-lg text-[#F2F0EC]">
                {editingVideo ? 'Edit Portfolio Video' : 'Add Portfolio Video'}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded bg-[#141210] text-[#9C9890] hover:text-[#F2F0EC] border border-[#2A2724]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-[#9C9890] mb-1.5 uppercase">Title</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Esports Frag Montage"
                  className="w-full px-3 py-2 rounded bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-xs focus:outline-none focus:border-[#C9A227] transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-[#9C9890] mb-1.5 uppercase">Description</label>
                <textarea
                  required
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short summary of work done, styles used..."
                  className="w-full px-3 py-2 rounded bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-xs focus:outline-none focus:border-[#C9A227] transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-[#9C9890] mb-1.5 uppercase">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-xs focus:outline-none focus:border-[#C9A227] transition-colors"
                  >
                    {PORTFOLIO_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-[#9C9890] mb-1.5 uppercase">Google Drive Link / ID</label>
                  <input
                    type="text"
                    required
                    value={formDriveUrl}
                    onChange={(e) => setFormDriveUrl(e.target.value)}
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3 py-2 rounded bg-[#141210] border border-[#2A2724] text-[#F2F0EC] text-xs focus:outline-none focus:border-[#C9A227] transition-colors"
                  />
                </div>
              </div>

              {/* Cover Thumbnail Upload */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-[#9C9890] uppercase">Thumbnail Cover Image</label>
                <div className="flex items-center gap-4">
                  {existingThumbUrl && !selectedThumbFile && (
                    <img
                      src={existingThumbUrl}
                      alt="Thumbnail Preview"
                      className="w-16 h-10 object-cover rounded bg-[#141210] border border-[#2A2724]"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedThumbFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-[#9C9890] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-[#141210] file:text-[#F2F0EC] hover:file:bg-[#2A2724] border border-[#2A2724] rounded p-2 bg-[#141210] flex-1"
                  />
                </div>
                {uploadingThumb && (
                  <div className="w-full bg-[#141210] rounded h-1 overflow-hidden border border-[#2A2724]">
                    <div className="bg-[#C9A227] h-full transition-all duration-200" style={{ width: `${uploadThumbProgress}%` }} />
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-[#2A2724] flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  disabled={uploadingThumb}
                  className="px-4 py-2 rounded bg-[#141210] border border-[#2A2724] text-[#9C9890] text-xs font-semibold hover:text-[#F2F0EC]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadingThumb}
                  className="px-4 py-2 rounded bg-[#C9A227] text-[#0C0B0A] text-xs font-semibold hover:bg-[#b08d20] disabled:opacity-50"
                >
                  {uploadingThumb ? 'Saving changes...' : 'Save Portfolio Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
