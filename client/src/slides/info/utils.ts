// List of allowed YouTube hostnames
const ALLOWED_YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'www.youtube.com',
  'youtu.be',
  'www.youtu.be'
]);

export const validateYoutubeUrl = (url: string) => {
  if (!url) return false;

  try {
    const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
    if (!ALLOWED_YOUTUBE_HOSTS.has(urlObj.hostname)) {
      return false;
    }

    // For youtube.com, must have /watch with v parameter or /embed/ path
    if (urlObj.hostname.endsWith('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        const videoId = new URLSearchParams(urlObj.search).get('v');
        return Boolean(videoId?.match(/^[\w-]{11}$/));
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        const videoId = urlObj.pathname.split('/embed/')[1];
        return Boolean(videoId?.match(/^[\w-]{11}$/));
      }
      return false;
    }

    // For youtu.be, must be direct video ID in path
    if (urlObj.hostname.endsWith('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return Boolean(videoId?.match(/^[\w-]{11}$/));
    }

    return false;
  } catch {
    return false;
  }
}

export const extractYoutubeId = (url: string) => {
  if (!url) return "";

  try {
    const urlObj = new URL(url.includes('http') ? url : `https://${url}`);
    
    if (!ALLOWED_YOUTUBE_HOSTS.has(urlObj.hostname)) {
      return "";
    }

    // Handle youtube.com formats
    if (urlObj.hostname.endsWith('youtube.com')) {
      if (urlObj.pathname === '/watch') {
        const videoId = new URLSearchParams(urlObj.search).get('v');
        return videoId?.match(/^[\w-]{11}$/) ? videoId : "";
      }
      if (urlObj.pathname.startsWith('/embed/')) {
        const videoId = urlObj.pathname.split('/embed/')[1];
        return videoId?.match(/^[\w-]{11}$/) ? videoId : "";
      }
      return "";
    }

    // Handle youtu.be format
    if (urlObj.hostname.endsWith('youtu.be')) {
      const videoId = urlObj.pathname.slice(1);
      return videoId?.match(/^[\w-]{11}$/) ? videoId : "";
    }

    return "";
  } catch (error) {
    console.error('Failed to extract YouTube video ID', error);
    return "";
  }
}

export const getYoutubeEmbedUrl = (url: string) => {
  const videoId = extractYoutubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : "";
}

export const getYoutubeThumbnailUrl = (url: string) => {
  const videoId = extractYoutubeId(url);
  return videoId ? `https://img.youtube.com/vi/${videoId}/sddefault.jpg` : "";
}

