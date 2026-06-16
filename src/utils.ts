/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Parses any video link and converts it into an embeddable format
 * Handles YouTube, Vimeo, Google Drive, direct MP4/WebM video files, and base64 video uploads.
 */
export function getEmbedUrl(url: string): { type: 'iframe' | 'video' | 'canvas'; url: string } {
  if (!url) {
    return { type: 'canvas', url: '' };
  }

  const trimmed = url.trim();

  // Check if it is a Base64 data video
  if (trimmed.startsWith('data:video/')) {
    return { type: 'video', url: trimmed };
  }

  // Check if it is an MP4/WebM or other direct video file
  if (trimmed.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)) {
    return { type: 'video', url: trimmed };
  }

  // Google Drive
  // Examples:
  // https://drive.google.com/file/d/1A_B_C/view?usp=sharing
  // https://drive.google.com/open?id=1A_B_C
  // https://drive.google.com/file/d/1A_B_C/preview
  const gdRegex = /drive\.google\.com\/(?:file\/d\/([a-zA-Z0-9_-]+)|open\?id=([a-zA-Z0-9_-]+))/;
  const gdMatch = trimmed.match(gdRegex);
  if (gdMatch) {
    const fileId = gdMatch[1] || gdMatch[2];
    return { type: 'iframe', url: `https://drive.google.com/file/d/${fileId}/preview` };
  }

  // YouTube
  let ytId = '';
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    const shortsMatch = trimmed.match(/shorts\/([a-zA-Z0-9_-]{11})/);
    const embedMatch = trimmed.match(/embed\/([a-zA-Z0-9_-]{11})/);
    const watchMatch = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    const shareMatch = trimmed.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
    
    ytId = (shortsMatch && shortsMatch[1]) || 
           (embedMatch && embedMatch[1]) || 
           (watchMatch && watchMatch[1]) || 
           (shareMatch && shareMatch[1]) || 
           '';

    if (!ytId) {
      const anyMatch = trimmed.match(/(?:v\/|v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{11})/);
      if (anyMatch) ytId = anyMatch[1];
    }
  }

  if (ytId) {
    return {
      type: 'iframe',
      url: `https://www.youtube.com/embed/${ytId}?autoplay=1&mute=1&loop=1&playlist=${ytId}&enablejsapi=1`
    };
  }

  // Vimeo
  let vimeoId = '';
  if (trimmed.includes('vimeo.com')) {
    const matches = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)([0-9]+)/);
    if (matches) vimeoId = matches[1];
  }

  if (vimeoId) {
    return {
      type: 'iframe',
      url: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1`
    };
  }

  // Generic HTTP player links as fallback
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return { type: 'iframe', url: trimmed };
  }

  return { type: 'canvas', url: '' };
}
