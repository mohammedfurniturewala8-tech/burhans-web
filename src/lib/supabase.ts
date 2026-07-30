import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const HERO_BUCKET = 'hero-videos';
const THUMB_BUCKET = 'video-thumbnails';
const LOCAL_HERO_STORAGE_KEY = 'burhan_active_hero_url';

export const DEFAULT_HERO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

// Checks if we are running in local mockup/demo mode
export const isMockupMode = (): boolean => {
  return supabaseUrl.includes('xyzcompany.supabase.co') || supabaseAnonKey === 'public-anon-key-placeholder';
};

/**
 * Extracts Google Drive ID and formats it into a secure /preview embed link
 */
export function formatDriveEmbedUrl(urlOrId: string): string {
  if (!urlOrId) return '';
  
  // If it's already an embed preview link
  if (urlOrId.includes('/preview')) return urlOrId;

  // Regular expression to extract file ID from common Google Drive URL formats
  const regExp = /\/file\/d\/([a-zA-Z0-9_-]+)\b|id=([a-zA-Z0-9_-]+)/;
  const matches = urlOrId.match(regExp);
  const fileId = matches ? (matches[1] || matches[2]) : urlOrId;

  return `https://drive.google.com/file/d/${fileId}/preview`;
}

/**
 * Fetches the active hero video URL
 */
export async function fetchActiveHeroVideoUrl(): Promise<string> {
  const localOverride = localStorage.getItem(LOCAL_HERO_STORAGE_KEY);
  if (isMockupMode()) return localOverride || DEFAULT_HERO_VIDEO_URL;

  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('active_hero_url')
      .limit(1)
      .single();

    if (error || !data?.active_hero_url) {
      return localOverride || DEFAULT_HERO_VIDEO_URL;
    }
    return data.active_hero_url;
  } catch {
    return localOverride || DEFAULT_HERO_VIDEO_URL;
  }
}

/**
 * Uploads a video file to Supabase Storage bucket 'hero-videos'
 */
export async function uploadHeroVideoFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (isMockupMode()) {
    const objectUrl = URL.createObjectURL(file);
    localStorage.setItem(LOCAL_HERO_STORAGE_KEY, objectUrl);
    if (onProgress) onProgress(100);
    return { 
      success: true, 
      url: objectUrl,
      error: 'Running in Local Demo Mode. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY on Vercel to save to cloud database.'
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}.${fileExt}`;
    const filePath = `showreels/${fileName}`;

    if (onProgress) onProgress(20);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(HERO_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000, public',
        upsert: true
      });

    if (uploadError) {
      return { success: false, error: `Upload Failed: ${uploadError.message}. Ensure bucket "${HERO_BUCKET}" is public.` };
    }

    if (onProgress) onProgress(70);

    const { data: urlData } = supabase.storage.from(HERO_BUCKET).getPublicUrl(uploadData.path);
    const publicUrl = urlData.publicUrl;

    const { error: dbError } = await supabase
      .from('site_config')
      .upsert({ id: 1, active_hero_url: publicUrl });

    if (dbError) {
      return { success: false, error: `Database Save Failed: ${dbError.message}` };
    }

    localStorage.setItem(LOCAL_HERO_STORAGE_KEY, publicUrl);
    if (onProgress) onProgress(100);
    return { success: true, url: publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred.' };
  }
}

// ----------------------------------------------------
// PORTFOLIO VIDEO CRUD METHODS
// ----------------------------------------------------

export interface DbPortfolioVideo {
  id?: string;
  title: string;
  description: string;
  category: string;
  drive_url: string;
  thumbnail_url: string;
  sort_order: number;
}

/**
 * Fetches all portfolio videos ordered by sort_order
 */
export async function fetchPortfolioVideos(): Promise<DbPortfolioVideo[]> {
  if (isMockupMode()) {
    // Return mock data parsed from local storage or static array if empty
    const local = localStorage.getItem('mock_portfolio_videos');
    if (local) return JSON.parse(local);
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('portfolio_videos')
      .select('*')
      .order('sort_order', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error('Error fetching portfolio videos:', err);
    return [];
  }
}

/**
 * Uploads a thumbnail file to Supabase Storage bucket 'video-thumbnails'
 */
export async function uploadThumbnailFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  if (isMockupMode()) {
    const objectUrl = URL.createObjectURL(file);
    if (onProgress) onProgress(100);
    return { success: true, url: objectUrl };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `thumb_${Date.now()}.${fileExt}`;
    const filePath = `covers/${fileName}`;

    if (onProgress) onProgress(30);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(THUMB_BUCKET)
      .upload(filePath, file, {
        cacheControl: '31536000, public',
        upsert: true
      });

    if (uploadError) {
      return { success: false, error: `Thumbnail Upload Failed: ${uploadError.message}. Make sure bucket "${THUMB_BUCKET}" is public.` };
    }

    if (onProgress) onProgress(80);

    const { data: urlData } = supabase.storage.from(THUMB_BUCKET).getPublicUrl(uploadData.path);
    if (onProgress) onProgress(100);
    return { success: true, url: urlData.publicUrl };
  } catch (err: any) {
    return { success: false, error: err.message || 'An unexpected error occurred during thumbnail upload.' };
  }
}

/**
 * Saves a new portfolio video
 */
export async function addPortfolioVideo(video: DbPortfolioVideo): Promise<{ success: boolean; error?: string }> {
  if (isMockupMode()) {
    const list = await fetchPortfolioVideos();
    const newVideo = { ...video, id: `mock-${Date.now()}` };
    list.push(newVideo);
    localStorage.setItem('mock_portfolio_videos', JSON.stringify(list));
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('portfolio_videos')
      .insert(video);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Updates an existing portfolio video's properties
 */
export async function updatePortfolioVideo(id: string, video: Partial<DbPortfolioVideo>): Promise<{ success: boolean; error?: string }> {
  if (isMockupMode()) {
    const list = await fetchPortfolioVideos();
    const idx = list.findIndex(v => v.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...video };
      localStorage.setItem('mock_portfolio_videos', JSON.stringify(list));
    }
    return { success: true };
  }

  try {
    const { error } = await supabase
      .from('portfolio_videos')
      .update(video)
      .eq('id', id);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Deletes a portfolio video row and its corresponding storage cover image
 */
export async function deletePortfolioVideo(id: string, thumbnailUrl?: string): Promise<{ success: boolean; error?: string }> {
  if (isMockupMode()) {
    const list = await fetchPortfolioVideos();
    const updated = list.filter(v => v.id !== id);
    localStorage.setItem('mock_portfolio_videos', JSON.stringify(updated));
    return { success: true };
  }

  try {
    // Delete database entry first
    const { error: dbError } = await supabase
      .from('portfolio_videos')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    // Delete thumbnail from storage if path exists
    if (thumbnailUrl) {
      const fileName = thumbnailUrl.split('/').pop();
      if (fileName) {
        await supabase.storage.from(THUMB_BUCKET).remove([`covers/${fileName}`]);
      }
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Bulk updates the sort order of a list of videos
 */
export async function updateVideosSortOrder(videos: DbPortfolioVideo[]): Promise<{ success: boolean; error?: string }> {
  if (isMockupMode()) {
    localStorage.setItem('mock_portfolio_videos', JSON.stringify(videos));
    return { success: true };
  }

  try {
    const updates = videos.map((video, idx) => 
      supabase
        .from('portfolio_videos')
        .update({ sort_order: idx })
        .eq('id', video.id)
    );

    const results = await Promise.all(updates);
    const failed = results.find(r => r.error);
    if (failed) throw failed.error;

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
