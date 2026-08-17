/** Builds an Unsplash CDN URL for a verified photo id. Next/Image applies
 * its own responsive resizing on top of this, so no width/quality params
 * are baked in here beyond format/crop normalization. */
export function unsplash(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&q=80`;
}
