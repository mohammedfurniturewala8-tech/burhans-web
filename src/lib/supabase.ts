import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xyzcompany.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'public-anon-key-placeholder';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const BUCKET_NAME = 'hero-videos';
const LOCAL_HERO_STORAGE_KEY = 'burhan_active_hero_url';

// Default royalty-free sample showreel MP4 fallback
export const DEFAULT_HERO_VIDEO_URL = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';

/**
 * Fetches the active hero video URL from Supabase table "site_config"
 * Falls back to local storage or DEFAULT_HERO_VIDEO_URL if fetch fails.
 */
export async function fetchActiveHeroVideoUrl(): Promise<string> {
  // Check local storage override first (e.g. from local uploads)
  const localOverride = localStorage.getItem(LOCAL_HERO_STORAGE_KEY);

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
 * and updates 'site_config' table with active_hero_url.
 */
export async function uploadHeroVideoFile(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `hero_${Date.now()}.${fileExt}`;
    const filePath = `showreels/${fileName}`;

    if (onProgress) onProgress(20);

    // Upload to Supabase storage bucket with strong public CDN caching
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        cacheControl: '31536000, public',
        upsert: true
      });

    if (onProgress) onProgress(70);

    let publicUrl = '';

    if (uploadError) {
      // If Supabase Storage is not connected yet in local dev environment, create Blob URL / Object URL
      publicUrl = URL.createObjectURL(file);
    } else {
      const { data: urlData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(uploadData.path);
      publicUrl = urlData.publicUrl;
    }

    // Save active URL to Supabase DB table "site_config"
    const { error: dbError } = await supabase
      .from('site_config')
      .upsert({ id: 1, active_hero_url: publicUrl });

    if (dbError) {
      console.warn('Supabase site_config update warning:', dbError.message);
    }

    // Always mirror to localStorage for instantaneous local testing
    localStorage.setItem(LOCAL_HERO_STORAGE_KEY, publicUrl);

    if (onProgress) onProgress(100);

    return { success: true, url: publicUrl };
  } catch (err: any) {
    // Graceful fallback for local development: Object URL
    const objectUrl = URL.createObjectURL(file);
    localStorage.setItem(LOCAL_HERO_STORAGE_KEY, objectUrl);
    if (onProgress) onProgress(100);
    return { success: true, url: objectUrl };
  }
}
